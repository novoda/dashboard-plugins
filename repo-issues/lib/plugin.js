const plugin = require('dashboard-plugin')
const generateViewState = require('./data-source')

const component = {
    template: 'template.html',
    __dirname
}

const configuration = () => {
    return {
        "repo-issues": {
            name: 'repo-issues',
            template: {
                showIssues: plugin.createStringField('show issues? true|false'),
                showPRs: plugin.createStringField('show pull requests? true|false'),
                showDetailsThreshold : plugin.createStringField('max number of results to show details'),
                token : plugin.createStringField('github token'),
            }
        }
    }
}

module.exports = plugin.templated(configuration, component, generateViewState)
