const plugin = require('dashboard-plugin')
const generateViewState = require('./data-source')

const component = {
    template: 'template.html',
    __dirname
}

const configuration = () => {
    return {
        "football-plugin": {
            name: 'football-plugin',
            template: {
                awayTeamName: plugin.createStringField('awayTeamName'),
                homeTeamName: plugin.createStringField('homeTeamName'),
                homeTeamFlag: plugin.createStringField('homeTeamFlag'),
                awayTeamFlag: plugin.createStringField('awayTeamFlag'),
                goalsHomeTeam: plugin.createStringField('goalsHomeTeam'),
                goalsAwayTeam: plugin.createStringField('goalsAwayTeam'),
                competition: plugin.createStringField('competition'),
            }
        }
    }
}

module.exports = plugin.templated(configuration, component, generateViewState)
