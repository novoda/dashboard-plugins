const plugin = require('dashboards/plugin').templated
const generateViewState = require('./data-source')

const component = {
    template: 'template.html',
    __dirname
}

const configuration = () => {
    return {
        sonos: {
            name: 'Sonos',
            template: {
                room_name: plugin.createStringField('Room name'),
                last_fm_api_key: plugin.createStringField('LastFM Api Key')
            }
        }
    }
}

module.exports = (database) => plugin(configuration, component, generateViewState(database))
