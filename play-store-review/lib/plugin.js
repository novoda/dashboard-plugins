process.env.DEBUG="google-play-scraper"

const plugin = require('dashboard-plugin')
const generateViewState = require('./data-source')
const REFRESH_INTERVAL_MILLIS = (5 * 60) * 1000


const component = {
    template: 'template.html',
    __dirname
}

const configuration = () => {
    return {
        play_store_review: {
            name: 'Google Play Store Review',
            template: {
                package_name: plugin.createStringField('Package name'),
                minimum_rating: plugin.createStringField('Minimum rating')
            }
        }
    }
}

const viewStateProvider = (database) => (configuration, meta) => {
    return plugin.cache(database, meta.id, REFRESH_INTERVAL_MILLIS, () => generateViewState(configuration))
}

module.exports = (database) => plugin.templated(configuration, component, viewStateProvider(database))
