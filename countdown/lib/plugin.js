const plugin = require('dashboard-plugin')
const moment = require('moment')

const component = {
    template: 'template.html',
    __dirname
}

const configuration = () => {
    return {
        countdown: {
            name: 'London Winter Party 2017 Countdown'
        }
    }
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

const generateViewState = () => {
    const now = moment();
    const target = moment('2017-12-20');
    let delta = target.diff(now, 'hours')

    const viewState = {
        daysRemaining: formatDelta(toDays(delta))
    }
    return Promise.resolve(viewState)
}

module.exports = plugin.templated(configuration, component, generateViewState)
