const plugin = require('dashboard-plugin')
const generateViewState = require('./data-source')

const component = {
    template: 'template.html',
    __dirname
}

const configuration = () => {
    return {
        "cryptocurrency-price": {
            name: 'cryptocurrency-price',
            template: {
                apiKey: plugin.createStringField('Coin market cap api key')
                // add config stuff here
            }
        }
    }
}

module.exports = plugin.templated(configuration, component, generateViewState)
