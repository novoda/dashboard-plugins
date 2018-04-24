const http = require('request-promise-native')

const fetchCompetition = (competitionId) => {
    const request = {
        url: `http://api.football-data.org/v1/competitions/${competitionId}`,
        headers: {
            'X-Auth-Token': 'f7ed7ab3066343fd897113e9d281e1f2', 'X-Response-Control': 'minified'
        }
    }
    return http.get(request)
}

const generateViewState = (configuration) => {
    const competitionIdValue = configuration.competitionId.value
    return Promise.all([fetchCompetition(competitionIdValue)])
        .then(results => toViewState(results)(competitionIdValue))
}

const toViewState = (rawResponses) => (competitionId) => {
    const competitionResponse = JSON.parse(rawResponses[0])

    return {
        competitionId: competitionId,
        competition: competitionResponse[`caption`],
        matchDay: competitionResponse[`currentMatchday`],
        totalMatchDays: competitionResponse[`numberOfMatchdays`]
    }
}


module.exports = generateViewState