const plugin = require('dashboard-plugin')
const generateViewState = require('./data-source')

const component = {
    template: 'template.html',
    __dirname
}

const configuration = () => {
    return {
        "dynamic-countdown": {
            name: 'Countdown',
            template: {
                eventTitle: plugin.createStringField('Name of event'),
                imageUrl: plugin.createStringField('Background image url'),
                eventDate: plugin.createStringField('Event date in yyyy-mm-dd format')
            }
        }
    }
}

module.exports = plugin.templated(configuration, component, generateViewState)
