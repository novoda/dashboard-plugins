const plugin = require('dashboard-plugin')
const generateViewState = require('./data-source')

const component = {
    template: 'template.html',
    __dirname
}

const configuration = () => {
    return {
        sonar: {
            name: 'Sonar',
            template: {
                project_id: plugin.createStringField('Project Id'),
                token: plugin.createStringField('Sonar Token')
            }
        }
    }
}

module.exports = plugin.templated(configuration, component, generateViewState)
