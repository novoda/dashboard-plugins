const Rail = require('national-rail-darwin')
const createHafas = require('vbb-hafas')
const moment = require('moment')

const generateViewState = (configuration) => {
    return createHafas('novoda-dashboard').departures('900000120014', { duration: 10 })
        .then(results => {
            return results.map(result => {
                return {
                    when: moment(result.when).format('h:mm a'),
                    direction: result.direction,
                    line: result.line.name
                }
            })
        })
        .then(results => {
            return {
                stationName: "Grünberger Str./Warschauer Str.",
                departures: results.map(departure => {
                    return {
                        destination: departure.direction,
                        time: departure.when,
                        line: departure.line
                    }
                })
            }
        })
        .catch(console.error)
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
