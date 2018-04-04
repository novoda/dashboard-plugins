const plugin = require('dashboard-plugin')
const generateViewState = require('./data-source')

const component = {
    template: 'template.html',
    __dirname
}

const configuration = () => {
    return {
        novoda_blog_diversity: {
            name: 'Novoda Blog Diversity Dashboard'
        }
    }
}

module.exports = plugin.templated(configuration, component, generateViewState)
