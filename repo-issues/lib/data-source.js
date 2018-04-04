const http = require('request-promise-native')
const moment = require('moment')
const octokit = require('@octokit/rest')()

const organisation = 'novoda'
const languageIconMap = {
    "html": "html5",
    "groovy": "gradle",
    "css": "css3",
    "objective-c": "apple"
}

let showIssues = false
let showPRs = true
let show_details_threshold = 5

const generateViewState = (configuration) => {
    showIssues = configuration.showIssues === 'true'
    showPRs = configuration.showPRs === 'true'
    show_details_threshold = parseInt(configuration.showDetailsThreshold, 10)

    octokit.authenticate({type: 'oauth', token: `${configuration.token}`})

    return paginate(octokit.repos.getForOrg)
        .then(data => Promise.all(data.map(queryRepoIssues)))
        .then(repos => repos.filter(each => each.prs.length > 0 || each.issues.length > 0)) // remove repositories with no open prs or issues
        .then(repos => repos.sort((a, b) => a.pushed_at < b.pushed_at)) // sort repositories by last pushed date
        .then(toViewState)
}

function paginate(method) {
    return method({ org: organisation, type: 'public', per_page: 100 })
        .then(response => {
            let data = response.data
            while (octokit.hasNextPage(response)) {
                return octokit.getNextPage(response).then(response => data.concat(response.data))
            }
            return data
        })
}

function queryRepoIssues(repo) {
    return octokit.issues.getForRepo({ owner: organisation, repo: repo.name })
        .then(result => toRepoIssues(result, repo))
}

function toRepoIssues(result, repo) {
    const allItems = { prs: [], issues: [] }

    result.data
        .filter(each =>
            (showPRs && each.pull_request !== undefined) ||
            (showIssues && each.pull_request === undefined))
        .sort((a, b) => a.updated_at < b.updated_at)
        .map(toOpenIssue)
        .map(each => each.is_pr ? allItems.prs.push(each) : allItems.issues.push(each))

    return {
        name: repo.name,
        url: repo.html_url,
        language: repo.language,
        private: repo.private,
        pushed_at: repo.pushed_at,
        issues: allItems.issues,
        prs: allItems.prs
    }
}

function toOpenIssue(issue) {
    return {
        title: issue.title,
        number: issue.number,
        updated: moment(issue.updated_at).fromNow(),
        url: issue.html_url,
        is_pr: issue.pull_request !== undefined,
        comments: issue.comments,
        user: {
            avatar: issue.user.avatar_url,
            nick: issue.user.login
        }
    }
}

function toViewState(repos) {
    return {
        repos: repos.map(repo => {
            return {
                name: repo.name,
                url: repo.html_url,
                language: toIconName(repo.language),
                private: repo.private,
                issues: repo.issues.map(addViewStyle),
                prs: repo.prs.map(addViewStyle),
                show_details: repos.length < show_details_threshold
            }
        })
    }
}

function addViewStyle(issue) {
    issue['issue_style'] = issue.is_pr ? 'is_pr' : 'is_issue'
    return issue
}

function toIconName(language) {
    const lang = language ? language.toLowerCase() : ''
    const icon = languageIconMap[lang]
    return icon === undefined ? lang : icon
}

module.exports = generateViewState
