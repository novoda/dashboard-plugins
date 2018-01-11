const plugin = require('dashboard-plugin').templated

const component = {
    template: 'template.html',
    __dirname
}

const colours = [
    'blue',
    'green',
    'pink'
]

const configuration = () => {
    return {
        arcade_score: {
            name: 'Arcade Score',
            template: {
                game_name: plugin.createStringField('Game name')
            }
        }
    }
}

const viewStateGenerator = (database) => (configuration) => {
    const game = configuration.game_name.value
    return database.ref(`/arcadeScore/${game}/scores/`)
        .orderByChild("score")
        .limitToLast(20)
        .once('value')
        .then(snapshot => {
            const scores = []
            snapshot.forEach(childSnapshot => {
                scores.push(childSnapshot.val())
            })
            return scores
        })
        .then(scores => {
            const highestScoresOnly = scores.reduce((accumulator, current) => {
                const cache = accumulator[current.userName]
                if (cache && current.score > cache.score) {
                    accumulator[current.userName] = current
                }
                if (!cache) {
                    accumulator[current.userName] = current;
                }
                return accumulator
            }, {})
            return Object.keys(highestScoresOnly).map(key => {
                return highestScoresOnly[key]
            }).sort((a, b) => {
                return b.score - a.score
            })
        })
        .then(scores => {
            return {
                gameName: game.toUpperCase(),
                scores: scoreList(scores)
            }
        })
}

const scoreList = (scores) => {
    return scores.map((score, index) => {
        const meta = {
            colour: colours[index % colours.length],
            name: score.userName
        }
        return Object.assign(meta, score)
    }).map((score, index) => {
        return Object.assign(score, { rank: index + 1 })
    })
}

module.exports = (database) => plugin(configuration, component, viewStateGenerator(database))
