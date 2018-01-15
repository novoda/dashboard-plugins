const plugin = require('dashboards/plugin').templated
const generateViewState = require('./data-source')

const component = {
    template: 'template.html',
    __dirname
}

const configuration = () => {
    return {
        play_store_review: {
            name: 'Google Play Store Review',
            template: {
                package_name: plugin.createStringField('Package name'),
                minimum_rating: plugin.createStringField('Minimum rating')
            }
        }
    }
}

module.exports = (database) => plugin(configuration, component, generateViewState(database))
