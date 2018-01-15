const plugin = require('dashboards/plugin').templated
const retrieveLatestNovodaBlog = require('./data-source')

const component = {
    template: 'template.html',
    __dirname
}

const configuration = () => {
    return {
        novoda_blog: {
            name: 'Novoda Blog'
        }
    }
}

module.exports = plugin(configuration, component, retrieveLatestNovodaBlog)
