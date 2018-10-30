const plugin = require('dashboard-plugin')
const generateViewState = require('./data-source')

const component = {
    template: 'template.html',
    __dirname
}

const configuration = () => {
    return {
        "national-rail": {
            name: 'national-rail',
            template: {
                darwinToken: plugin.createStringField('National rail Darwin token: http://realtime.nationalrail.co.uk/OpenLDBWSRegistration'),
                stationCode: plugin.createStringField('Station code available from: http://www.nationalrail.co.uk/stations_destinations/48541.aspx')
            }
        }
    }
}

module.exports = plugin.templated(configuration, component, generateViewState)
