const plugin = require('dashboard-plugin')
const generateViewState = require('./data-source')

const REFRESH_INTERVAL_MILLIS = (2 * 60) * 1000

const component = {
    template: 'template.html',
    __dirname
}

const configuration = () => {
    return {
        "tfl-status": {
            name: 'TfL Status',
            template: {
                app_id: plugin.createStringField('TfL API App ID'),
                app_key: plugin.createStringField('TfL API App Key')
            }
        }
    }
}

const viewStateProvider = (database) => (configuration, meta) => {
    return plugin.cache(database, meta.id, REFRESH_INTERVAL_MILLIS, () => generateViewState(configuration))
}

module.exports = (database) => plugin.templated(configuration, component, viewStateProvider(database))
