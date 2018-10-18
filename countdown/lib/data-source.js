const moment = require('moment')

const generateViewState = (configuration) => {
    const viewState = {
        eventTitle: configuration.eventTitle.value,
        daysRemaining: getDaysRemainingFor(configuration.eventDate.value),
        imageUrl: configuration.imageUrl.value
    }
    return Promise.resolve(viewState)
}

const getDaysRemainingFor = (rawDate) => {
    const now = moment()
    const target = moment(rawDate)
    let delta = target.diff(now, 'hours')
    return formatDelta(toDays(delta))
}

const toDays = (delta) => {
    if (delta <= 0) {
        return 0
    } else if (delta < 24) {
        return 1
    } else {
        return Math.floor(delta / 24)
    }
}

const formatDelta = (delta) => {
    switch (delta) {
        case -1:
            return '🍌'
        case 0:
            return 'Today!'
        case 1:
            return 'Tomorrow!'
        default:
            return `${delta} days`
    }
}


module.exports = generateViewState
