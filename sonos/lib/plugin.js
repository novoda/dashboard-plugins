const plugin = require('dashboard-plugin')
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

module.exports = (database) => plugin.templated(configuration, component, generateViewState(database))
