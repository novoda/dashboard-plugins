const plugin = require('dashboards/plugin').templated
const generateViewState = require('./data-source')

const component = {
    template: 'template.html',
    __dirname
}

const configuration = () => {
    return {
        bitcoin_price: {
            name: 'Bitcoin Price',
            template: {
                currency: plugin.createStringField('Currency (GBP, EUR, etc)')
            }
        }
    }
}

module.exports = plugin(configuration, component, generateViewState)
