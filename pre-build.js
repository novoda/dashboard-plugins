const fs = require('fs-extra')
const path = require('path')

const walkPath = './'

const topLevelDirectories = fs.readdirSync('./')
    .filter(file => !file.startsWith('.'))
    .filter(file => fs.lstatSync(path.join(walkPath, file)).isDirectory())
    .filter(file => file !== 'node_modules')
    .map(dir => path.join(walkPath, dir))


const collectDependencies = (file) => {
    return fs.readJsonSync(path.join(file, 'package.json')).dependencies
}

const dependencies = topLevelDirectories.map(collectDependencies)
    .map(dependenciesBlock => {
        return Object.keys(dependenciesBlock).map(key => {
            const version = dependenciesBlock[key]
            return {
                name: key,
                version: version,
            }
        })
    }).reduce((accumulator, current) => {
        return accumulator.concat(current)
    }, [])
    .reduce((accumulator, current) => {
        const cached = accumulator[current.name]
        if (cached) {
            console.log('conflict', cached, 'using:', current.name, current.version)
        }
        return accumulator[current.name] = current.version, accumulator
    }, {})

const packageJson = require('./package.json')
packageJson.dependencies = dependencies

fs.writeJsonSync('./package.json', packageJson, { spaces: 4 })
