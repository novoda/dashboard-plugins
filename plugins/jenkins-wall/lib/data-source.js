const http = require('request-promise-native')
const TEST_NUMBER_REGEXP = /Test Result: (\d*,?\d*) test(?:s|) failing out of a total of (\d*,?\d*) test(?:s|)./;

const generateViewState = (configuration) => {
    const user = configuration.user.value
    const token = configuration.token.value
    const baseUrl = configuration.base_url.value
    const viewName = configuration.view_name.value

    const authorization = new Buffer(`${user}:${token}`).toString('base64')
    const request = {
        url: `${baseUrl}/view/${viewName}/api/json?depth=1&tree=jobs[displayName,color,healthReport[description],lastBuild[number]]`,
        headers: {
            Authorization: `Basic ${authorization}`
        }
    }
    return http.get(request)
        .then(toJobs)
        .then(toViewState)
}

const toJobs = (rawResponse) => {
    return JSON.parse(rawResponse).jobs.map(job => {
        return {
            name: job.displayName,
            success: job.color !== 'red',
            buildNumber: job.lastBuild ? job.lastBuild.number : 0,
            testResult: toTestResult(job.healthReport)
        }
    });
}

const toTestResult = (healthReport) => {
    const report = healthReport
        .map(each => each.description)
        .filter(each => each)
        .filter(each => each.match(TEST_NUMBER_REGEXP))
        .map(each => {
            const numbers = TEST_NUMBER_REGEXP.exec(each).map(toNumber)
            return {
                failing: numbers[1],
                total: numbers[2]
            }
        })
    return report[0] || { failing: 0, total: 0 }
}

const toNumber = (string) => {
    return parseInt(string.replace(/[^0-9]/g, ''));
}

const toViewState = (jobs) => {
    return {
        jobs: jobs.map(job => {
            return {
                name: job.name,
                totalTests: job.testResult.total,
                failingTests: job.testResult.failing,
                style: job.success ? 'build-success' : 'build-fail'
            }
        })
    }
}

module.exports = generateViewState
