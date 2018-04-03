const fs = require('fs')
const path = require('path')

const walkPath = './'

const topLevelDirectories = fs.readdirSync('./')
    .filter(file => !file.startsWith('.'))
    .filter(file => fs.lstatSync(path.join(walkPath, file)).isDirectory())
    .filter(file => file !== 'node_modules')
    .map(dir => path.join(walkPath, dir))


const collectDependencies = (file) => {
    const packageFile = fs.readFileSync(path.join(file, 'package.json'))
    return JSON.parse(packageFile).dependencies
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
        if (cached && cached !== current.version) {
            console.log('conflict with', current.name, 'using:', cached, 'instead of', current.version)
            console.log('\n')
            return accumulator
        }
        return accumulator[current.name] = current.version, accumulator
    }, {})

const packageJson = require('./package.json')
packageJson.dependencies = dependencies

fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 4))
