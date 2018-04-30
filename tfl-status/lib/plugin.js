const plugin = require('dashboard-plugin')
const generateViewState = require('./data-source')
const secrets = require('./api-secrets.json');

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

const updateData = (cache, configuration, pluginInstanceId) => {
    return cache.hasExpired(pluginInstanceId)
        .then(isExpired => {
            if (isExpired) {
                console.log('Cache miss. Writing to cache...')
                generateViewState(configuration)
                    .then((data) => {
                        cache.save(pluginInstanceId, data)
                        return new Promise((resolve, reject) => resolve(data))
                    })
            }
            else {
                console.log('Cache hit.')
                return cache.read(pluginInstanceId)
            }
        })
}

const viewStateProvider = (cache) => (configuration, pluginInstanceId) => {
    // if (cache.hasExpired(pluginInstanceId)) {
    //     console.log('Cache miss. Writing to cache...')
    //     return generateViewState(configuration)
    //         .then((data) => {
    //             cache.save(pluginInstanceId, data)
    //             return data
    //         })
    // }
    // return cache.read(pluginInstanceId)
    return updateData(cache, configuration, pluginInstanceId)
}

module.exports = (cache) => plugin.templated(configuration, component, viewStateProvider(cache))
