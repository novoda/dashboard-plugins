const http = require('request-promise-native')

const fetchCompetition = (competitionId, authToken) => {
    const request = {
        url: `http://api.football-data.org/v1/competitions/${competitionId}`,
        headers: {
            'X-Auth-Token': authToken, 'X-Response-Control': 'minified'
        }
    }
    return http.get(request)
}

const generateViewState = (configuration) => {
    const competitionIdValue = configuration.competitionId.value
    const authTokenValue = configuration.authToken.value
    return Promise.all([fetchCompetition(competitionIdValue, authTokenValue)])
        .then(results => toViewState(results)(competitionIdValue, authTokenValue))
}

const toViewState = (rawResponses) => (competitionId, authToken) => {
    const competitionResponse = JSON.parse(rawResponses[0])

    return {
        competitionId: competitionId,
        authToken: authToken,
        competition: competitionResponse[`caption`],
        matchDay: competitionResponse[`currentMatchday`],
        totalMatchDays: competitionResponse[`numberOfMatchdays`]
    }
}


module.exports = generateViewState