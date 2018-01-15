const plugin = require('dashboard-plugin').templated
const generateViewState = require('./data-source')

const component = {
    template: 'template.html',
    __dirname
}

const configuration = () => {
    return {
        github_contributors: {
            name: 'GitHub Contributors',
            template: {
                endpoint: plugin.createStringField('Endpoint'),
            }
        }
    }
}

module.exports = plugin(configuration, component, generateViewState)
