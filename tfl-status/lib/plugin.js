const plugin = require('dashboard-plugin')
const generateViewState = require('./data-source')
const secrets = require('./api-secrets.json');

const REFRESH_INTERVAL = 150

const component = {
    template: 'template.html',
    __dirname
}

const configuration = () => {
    return {
        "tfl-status": {
            name: 'TfL Status',
            template: {
                app_id: plugin.createStringField(secrets.app_id),
                app_key: plugin.createStringField(secrets.app_key)
            }
        }
    }
}

const viewStateProvider = (database) => (configuration, meta) => {
    const generateViewState = require('./data-source')
    return plugin.cache(database, meta.id, REFRESH_INTERVAL, () => generateViewState(configuration))
}

module.exports = (database) => plugin.templated(configuration, component, viewStateProvider(database))
