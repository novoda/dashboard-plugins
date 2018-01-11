const http = require('request-promise-native')

const createCoverageRequest = (token, projectId) => {
    return {
        url: 'https://sonar.novoda.com/api/measures/component',
        qs: {
            componentKey: projectId,
            metricKeys: 'coverage'
        },
        auth: {
            user: token,
            pass: ''
        }
    }
}

const generateViewState = (configuration) => {
    const projectId = configuration.project_id.value
    const sonarToken = configuration.token.value
    const coverageRequest = createCoverageRequest(sonarToken, projectId)
    return http.get(coverageRequest).then(body => {
        const response = JSON.parse(body)
        const { name, measures } = response.component;
        if (measures && measures.length > 0) {
            return {
                projectName: name,
                coverage: measures[0].value
            }
        }
        return Promise.reject(`No measures found for ${projectId}`)
    })
}

module.exports = generateViewState
