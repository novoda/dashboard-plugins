const generateViewState = (configuration) => {
    const images = configuration.images.value.split(',')
        .map(each => each.trim())
    const viewState = {
        artwork: images[Math.floor((Math.random() * images.length))]
    }
    return Promise.resolve(viewState)
}

module.exports = generateViewState
