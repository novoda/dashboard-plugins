const http = require('request-promise-native')
const moment = require('moment')
const octokit = require('@octokit/rest')()

const show_details_threshold = 5
const organisation = 'novoda'
const languageIconMap = {
    "html": "html5",
    "groovy": "gradle",
    "css": "css3",
    "objective-c" : "apple"
}

let showIssues = false
let showPRs = true

const generateViewState = (configuration) => {
    showIssues = configuration.showIssues
    showPRs = configuration.showPRs

    octokit.authenticate({type: 'oauth', token: `${configuration.token}`})
    
    return octokit.repos.getForOrg({ org: organisation, type: 'all', per_page: 9999 })
        .then(repos => Promise.all(repos.data.map(queryRepoIssues)))
        .then(prs => prs.filter(each => each.prs.length > 0 || each.issues.length > 0))
        .then(toViewState)
}

function queryRepoIssues(repo) {
    return octokit.issues.getForRepo({ owner: organisation, repo: repo.name })
        .then(result => toRepoIssues(result, repo))
}

function toRepoIssues(result, repo) {
    const allitems = { prs: [], issues: [] }

    result.data
        .filter(each =>
            (showPRs && each.pull_request !== undefined) ||
            (showIssues && each.pull_request === undefined))
        .sort((a, b) => a.updated_at < b.updated_at)
        .map(toOpenIssue)
        .map(each => each.is_pr ? allitems.prs.push(each) : allitems.issues.push(each))

    return {
        name: repo.name,
        url: repo.html_url,
        language: repo.language,
        private: repo.private,
        issues: allitems.issues,
        prs: allitems.prs
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
                issues: repo.issues.map(toIssueViewState),
                prs: repo.prs.map(toIssueViewState),
                show_details: repos.length < show_details_threshold
            }
        })
    }
}

function toIssueViewState(issue) {
    issue['issue_style'] = issue.is_pr ? 'is_pr' : 'is_issue'
    return issue
}

function toIconName(language) {
    const lang = language ? language.toLowerCase() : ''
    const icon = languageIconMap[lang]
    return icon === undefined ? lang : icon
}

module.exports = generateViewState
