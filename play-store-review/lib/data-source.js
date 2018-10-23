const googlePlay = require('google-play-scraper')

const generateViewState = (configuration) => {
    const packageName = configuration.package_name.value
    const minimumRating = configuration.minimum_rating.value
    return Promise.all([fetchListing(packageName), fetchReviews(packageName)]).then(result => {
        return toViewState(minimumRating, result[0], result[1])
    }).catch(error => {
        console.error(error)
        return {
            title: '',
            text: 'No reviews available',
            image: ''
        }
    })
}

const fetchListing = (appId) => {
    return googlePlay.app({ appId: appId, throttle: 1 })
}

const fetchReviews = (appId) => {
    return googlePlay.reviews({
        appId: appId,
        page: 0,
        sort: googlePlay.sort.NEWEST,
        throttle: 1
    }).catch(error =>{
        console.error(error)
        return []
    })
}

const toViewState = (minimumRating, listing, reviews) => {
    const filteredReviews = reviews.filter(review => review.score >= minimumRating);
    if (filteredReviews.length === 0) {
        return {
            title: listing.title || '',
            text: 'No reviews available',
            image: listing.icon || ''
        }
    }

    const review = filteredReviews[Math.floor(Math.random() * filteredReviews.length)];
    return {
        rating: `${'★'.repeat(review.score)}${'☆'.repeat(5 - review.score)}`,
        text: review.text || '',
        image: listing.icon || ''
    }
}

module.exports = generateViewState
