(function () {
    const teamContributorsCount = document.querySelector('.team-contributors-container').children.length
    window.setInterval(() => {
        const position = document.documentElement.style.getPropertyValue('--team-contributor-position')
        const newPosition = position - 1 < -teamContributorsCount - position ? 0 : position - 1
        document.documentElement.style.setProperty('--team-contributor-position', newPosition)
    }, 3000)
})()
