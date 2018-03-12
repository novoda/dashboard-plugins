const plugin = require('dashboard-plugin')
const generateViewState = require('./data-source')

const component = {
    template: 'template.html',
    __dirname
}

const configuration = () => {
    return {
        "tfl-status": {
            name: 'TFL Status',
            template: {
                app_id: plugin.createStringField('Tfl Api App ID'),
                app_key: plugin.createStringField('Tfl Api App Key')
            }
        }
    }
}

module.exports = plugin.templated(configuration, component, generateViewState)
