const Rail = require('national-rail-darwin')

const generateViewState = (configuration) => {
    const rail = new Rail(configuration.darwinToken.value)
    const stationCode = configuration.stationCode.value
    return Promise.all([fetchStation(rail, stationCode),fetchStationBoard(rail, stationCode)])
        .then(results => {
            const departures = results[1].trainServices.map(each => ({
                destination: each.destination.name,
                expected: each.etd,
                time: each.std,
                platform: each.platform || '-',
                callingAt: each.subsequentCallingPoints.reduce((acc, curr, index, array) => (acc += ` ${curr.locationName}${index !== array.length - 1 ? ',': ''}`), "Calling at").toUpperCase()
            }))
            return {
                stationName: results[0][0].name,
                departures: departures
            }
        })
}


const fetchStation = (rail, stationCode) => {
    return new Promise((resolve, reject) => {
        rail.getStationDetails(stationCode, function (err, result) {
            err ? reject(err) : resolve(result)
        })
    })
}

const fetchStationBoard = (rail, stationCode) => {
    return new Promise((resolve, reject) => {
        rail.getDepartureBoardWithDetails(stationCode, {}, function (err, result) {
            err ? reject(err) : resolve(result)
        })
    })
}

module.exports = generateViewState
