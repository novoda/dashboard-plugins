module.exports = {
    plugin: (database) => require('./plugin')(database),
    webhook: (database) => require('./webhook')(database)
}
