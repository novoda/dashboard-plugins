const plugin = require('dashboard-plugin')

const component = {
    template: 'template.html',
    __dirname
}

const configuration = () => {
    return {
        clock: {
            name: 'Clock'
        }
    }
}

module.exports = plugin.templated(configuration, component)
