const plugin = require('dashboard-plugin')
const generateViewState = require('./data-source')

const component = {
    template: 'template.html',
    __dirname
}

const configuration = () => {
    return {
        "football-plugin": {
            name: 'football-plugin',
            template: {
                competitionId: plugin.createStringField('Competition ID'),
                authToken: plugin.createStringField('Auth Token')
            }
        }
    }
}

module.exports = plugin.templated(configuration, component, generateViewState)
