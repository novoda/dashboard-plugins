module.exports = {
    plugin: (database) => require('./plugin')(database),
    webhook: (slackToken, storage, database) => require('./webhook')(slackToken, storage, database)
}
