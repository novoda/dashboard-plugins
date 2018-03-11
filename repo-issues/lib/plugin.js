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
                showIssues: false,
                showPRs: true,
                token : "Github Token"
            }
        }
    }
}

module.exports = plugin.templated(configuration, component, generateViewState)
