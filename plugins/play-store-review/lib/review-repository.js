const googlePlay = require('google-play-scraper')

const DATABASE_ROOT = '/play-store-reviews'

const fetchLatest = (database) => (appId, interval) => {
    const rootRef = database.ref(`${DATABASE_ROOT}/${encodeKey(appId)}`)
    return rootRef.child('lastUpdated')
        .once('value')
        .then(snapshot => snapshot.val())
        .then(updateDataIfStale(appId, interval, rootRef))
        .then(queryApp(appId, rootRef))
}

const encodeKey = (key) => {
    return encodeURIComponent(key).replace(/[.]/g, '%2E')
}

const updateDataIfStale = (appId, interval, rootRef) => (lastUpdated) => {
    if (lastUpdated > Date.now() + interval) {
        const actions = [updateReviews(rootRef, appId), updateListing(rootRef, appId)]
        return Promise.all(actions).then(() => {
            return rootRef.child('lastUpdated').set(Date.now())
        }).catch(err => {
            console.log(err)
            return Promise.resolve()
        })
    }
    return Promise.resolve()
}

const updateReviews = (rootRef, appId) => {
    return fetchReviews(appId, rootRef)
        .then(insertReviews(rootRef))
}

const fetchReviews = (appId) => {
    return googlePlay.reviews({
        appId: appId,
        page: 0,
        sort: googlePlay.sort.NEWEST,
        throttle: 1
    })
}

const insertReviews = (rootRef) => (reviews) => {
    const reviewsHash = reviews
        .map(review => {
            const date = new Date(review.date).getTime()
            return Object.assign(review, { date: date })
        })
        .map(toFirebasePayload)
        .reduce((accumulator, current) => {
            return accumulator[current.id] = current, accumulator
        }, {})
    return rootRef.child('review').update(reviewsHash)
}

const updateListing = (rootRef, appId) => {
    return fetchListing(appId)
        .then(listing => {
            return insertListing(rootRef, appId, listing)
        })
}

const fetchListing = (appId) => {
    return googlePlay.app({ appId: appId, throttle: 1 })
}

const insertListing = (rootRef, appId, listing) => {
    return rootRef.child('listing').set(toFirebasePayload(listing))
}

const toFirebasePayload = (object) => {
    return Object.keys(object).reduce((accumulator, key) => {
        return accumulator[key] = object[key] || '', accumulator
    }, {})
}

const queryApp = (appId, rootRef) => () => {
    return Promise.all([queryReviews(rootRef), queryListing(rootRef)])
        .then(result => {
            return {
                reviews: result[0],
                listing: result[1]
            }
        })
}

const queryReviews = (rootRef) => {
    return rootRef.child('review')
        .orderByChild("date")
        .limitToLast(20)
        .once('value')
        .then(snapshot => {
            const data = []
            snapshot.forEach(childSnapshot => {
                data.push(childSnapshot.val())
            })
            return data
        })
}

const queryListing = (rootRef) => {
    return rootRef.child('listing')
        .once('value')
        .then(snapshot => snapshot.val())
}

module.exports.fetchLatest = fetchLatest
