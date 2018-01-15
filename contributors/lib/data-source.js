const moment = require('moment');
const http = require('request-promise-native');

const fetchAggregatedStats = (url, from, to, timezone) => {
    const request = {
        url: url,
        qs: {
            from: from.toISOString(),
            to: to.toISOString(),
            timezone: timezone
        },
        json: true
    };
    return http.get(request);
}

const now = () => moment().locale('en-gb')

const normaliseProject = (project) => {
    return project.replace(/(: (Scheduled|Verified)$)/g, '')
}

const removeDuplicates = (normalizedProjects) => {
    return Array.from(new Set(normalizedProjects))
}

const toUserStats = (key, userStats) => {
    let projects = Object.keys(userStats.assignedProjectsStats || [])
    if (projects.length === 0 || projects === {}) {
        projects = ['No assignment']
    }
    const normalizedProjects = projects.map(normaliseProject)
    const allProjects = removeDuplicates(normalizedProjects).join(', ')
    return {
        userName: key,
        assignedProjects: allProjects,
        assignedCount: userStats.assignedProjectsContributions,
        externalCount: userStats.externalRepositoriesContributions || 0,
        avatar: `https://github.com/${key}.png?size=200px`
    }
}

const toContributors = (users) => {
    return {
        teamContributors: users.filter(userStats => userStats.externalCount > 0),
        projectContributors: users.filter(userStats => userStats.externalCount <= 0)
    };
}

const generateViewState = (configuration) => {
    return fetchAggregatedStats(
        configuration.endpoint.value,
        now().startOf('week'),
        now(),
        'Europe/London'
    ).then(result => {
        const users = Object.keys(result.usersStats)
            .map(key => toUserStats(key, result.usersStats[key]))
            .filter(userStats => userStats.assignedCount > 0)
        return toContributors(users)
    })
}

module.exports = generateViewState
