const http = require('request-promise-native')

const lines = {
    "bakerloo": "#B26300",
    "central": "#DC241F",
    "circle": "#FFD329",
    "district": "#007D32",
    "hammersmith-city": "#F4A9BE",
    "jubilee": "#A1A5A7",
    "metropolitan": "#9B0058",
    "northern": "#000000",
    "piccadilly": "#0019A8",
    "victoria": "#0098D8",
    "waterloo-city": "#93CEBA",
    "elizabeth": "#9364CC",
    "london-overground": "#EF7B10",
    "tram": "#00BD19",
    "dlr": "#00AFAD",
    "tfl-rail": "#0019A8"
}

const readLineStatus = (statuses) => {
    return statuses.length === 0 ? 'Unknown' : statuses[0].statusSeverityDescription
}

const generateViewState = (configuration) => {
    const appId = configuration.app_id.value
    const appKey = configuration.app_key.value

    const options = {
        url: `https://api.tfl.gov.uk/Line/Mode/tube%2Coverground/Status?app_id=${appId}&app_key=${appKey}`,
        json: true
    }

    return http.get(options).then((response) => {
        return response.map(each => {
            return {
                name: each.name,
                colour: lines[each.id],
                status: readLineStatus(each.lineStatuses)
            }
        })
    })
}

module.exports = generateViewState
