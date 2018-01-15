const repository = require('./review-repository')
const REFRESH_REVIEWS_INTERVAL = (60 * 1000) * 30

const generateViewState = (database) => (configuration) => {
    const packageName = configuration.package_name.value
    const minimumRating = configuration.minimum_rating.value
    return repository.fetchLatest(database)(packageName, REFRESH_REVIEWS_INTERVAL)
        .then(result => {
            return toViewState(minimumRating, result.listing, result.reviews)
        }).catch(console.log)
}

const toViewState = (minimumRating, listing, reviews) => {
    const filteredReviews = reviews.filter(review => review.score >= minimumRating);

    if (filteredReviews.length === 0) {
        return {
            title: listing.title,
            text: 'No reviews available',
            image: `https:${listing.icon}`
        }
    }

    const review = filteredReviews[Math.floor(Math.random() * filteredReviews.length)];
    return {
        rating: `${'★'.repeat(review.score)}${'☆'.repeat(5 - review.score)}`,
        text: review.text,
        image: `https:${listing.icon}`
    }
}

module.exports = generateViewState
