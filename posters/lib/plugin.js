const plugin = require('dashboard-plugin')
const generateViewState = require('./data-source')

const component = {
    template: 'template.html',
    __dirname
}

const configuration = () => {
    return {
        "posters": {
            name: 'posters',
            template: {
                images: plugin.createStringField('Comma separated image urls'),
            }
        }
    }
}

module.exports = plugin.templated(configuration, component, generateViewState)
