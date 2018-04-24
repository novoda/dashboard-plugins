(function () {
    const metaTags = document.getElementsByTagName("meta")
    const matchList = document.getElementById("matchList")
    const array = Array.from(metaTags)
    const competitionId = array.filter(tag => { return tag.getAttribute("name") === "competitionId" }).map(element => element.getAttribute("content"))[0]
    const matchDay = array.filter(tag => { return tag.getAttribute("name") === "matchDay" }).map(element => element.getAttribute("content"))[0]
    const authToken = array.filter(tag => { return tag.getAttribute("name") === "authToken" }).map(element => element.getAttribute("content"))[0]

    const fetchFixtures = (competitionId) => {
        const request = {
            mode:'cors',
            headers: {
                'X-Auth-Token': authToken, 'X-Response-Control': 'minified'
            }
        }
        return fetch(`http://api.football-data.org/v1/competitions/${competitionId}/fixtures`, request).then(response => response.json())
    }

    const generateViewState = (competitionId) => {
        return Promise.all([fetchFixtures(competitionId)])
            .then(results => toViewState(results)(competitionId))
    }

    const flagForTeam = (teamName) => {
        switch (teamName) {
            default:
                break
        }
    }

    const toViewState = (rawResponses) => () => {
        const fixturesResponse = rawResponses[0]
        const matches = fixturesResponse[`fixtures`].filter(value => {
            return value[`matchday`] == matchDay
        })

        return {
            matches: matches.map(match => {

                const result = toResult(match[`result`])
                const status = toColoredStatus(match[`status`])
                console.log(match[`status`])
                const homeTeamName = match[`homeTeamName`]
                const awayTeamName = match[`awayTeamName`]

                return {
                    date: new Date(match[`date`]).toLocaleString().replace(/:\d{2}\s/,' '),
                    status: status,
                    homeTeamName: homeTeamName,
                    homeTeamFlag: flagForTeam(homeTeamName),
                    awayTeamName: awayTeamName,
                    awayTeamFlag: flagForTeam(awayTeamName),
                    goalsHomeTeam: result.goalsHomeTeam,
                    goalsAwayTeam: result.goalsAwayTeam,
                    extraTimeGoalsHome: result.extraTimeGoalsHome,
                    extraTimeGoalsAway: result.extraTimeGoalsAway,
                    penaltiesHome: result.penaltiesHome,
                    penaltiesAway: result.penaltiesAway,
                }
            })
        }
    }

    const toResult = (resultJSON) => {

        const goalsHome = resultJSON[`goalsHomeTeam`]
        const goalsAway = resultJSON[`goalsAwayTeam`]
        const extraTime = resultJSON[`extraTime`]
        const penaltyShootout = resultJSON[`penaltyShootout`]

        if(goalsHome && goalsAway) {
            return {
                goalsHomeTeam: String(goalsHome),
                goalsAwayTeam: String(goalsAway),
                extraTimeGoalsHome: toScore(extraTime).goalsHomeTeam,
                extraTimeGoalsAway: toScore(extraTime).goalsAwayTeam,
                penaltiesHome: toScore(penaltyShootout).goalsHomeTeam,
                penaltiesAway: toScore(penaltyShootout).goalsAwayTeam,
            }
        }

        return {
            goalsHomeTeam: String(`-`),
            goalsAwayTeam: String(`-`),
        }
    }

    const toScore = (resultJSON) => {
        if (resultJSON) {
            const goalsHome = resultJSON[`goalsHomeTeam`]
            const goalsAway = resultJSON[`goalsAwayTeam`]

            if (goalsHome && goalsAway) {
                return {
                    goalsHomeTeam: String(goalsHome),
                    goalsAwayTeam: String(goalsAway),
                }
            }
        }

        return {
            goalsHomeTeam: null,
            goalsAwayTeam: null,
        }
    }

    const toColoredStatus = (status) => {
        switch (status) {
            case `FINISHED`:
                return {
                    text:`FINISHED`,
                    color: `coral`
                }
            case `IN_PLAY`:
                return {
                    text:`LIVE`,
                    color: `chartreuse`
                }
            case `TIMED`:
                return {
                    text:`TIMED`,
                    color: `yellow`
                }
            case `SCHEDULED`:
                return {
                    text:`SCHEDULED`,
                    color: `white`
                }
            case `POSTPONED`:
                return {
                    text:`POSTPONED`,
                    color: `white`
                }
            case `CANCELED`:
                return {
                    text:`CANCELED`,
                    color: `red`
                }
            default:
                return null
        }
    }

    const createHTMLForViewState = (viewState) => {
        matchList.querySelectorAll('li').forEach(element => {
            matchList.removeChild(element)
        })

        viewState.matches.forEach(match => {

            var new_row = document.createElement('li');
            new_row.className = 'matchList'

            var itemDiv = createDiv('item')
            var matchDiv = createDiv('matchContainer')
            var teamsContainerDiv = createDiv('teamsContainer')
            var extraTimeScoreContainerDiv = createDiv('extraTimeScoreContainer')

            var homeTeamSpan = createSpan('homeTeam')(match.homeTeamName)
            var awayTeamSpan = createSpan('awayTeam')(match.awayTeamName)
            var homeTeamScore = createSpan('score')(match.goalsHomeTeam)
            var scoreDash = createSpan('score scoreDivisor')(':')
            var awayTeamScore = createSpan('score')(match.goalsAwayTeam)
            var homeExtraTimeScore = createSpan('extraTimeScore')(match.extraTimeGoalsHome)
            var extraTimeScoreDash = createSpan('extraTimeScore scoreDivisor')(':')
            var awayExtraTimeScore = createSpan('extraTimeScore')(match.extraTimeGoalsAway)

            /*

            This should be addressed once we find a solution for supporting emojis

            var homeFlagDiv = document.createElement('span')
            homeFlagDiv.className = 'teamFlag'
            homeFlagDiv.textContent = match.homeTeamFlag

            var awayFlagDiv = document.createElement('span')
            awayFlagDiv.className = 'teamFlag'
            awayFlagDiv.textContent = match.awayTeamFlag

            */

            var statusDiv = document.createElement('div')

            var statusSpan = createSpan('matchStatus')(match.status.text)
            statusSpan.style.color = match.status.color

            var dateDiv = document.createElement('div')

            var dateSpan = createSpan('date')(match.date)

            new_row.appendChild(itemDiv)
            itemDiv.appendChild(matchDiv)
            matchDiv.appendChild(teamsContainerDiv)

            teamsContainerDiv.appendChild(homeTeamSpan)
            teamsContainerDiv.appendChild(homeTeamScore)
            teamsContainerDiv.appendChild(scoreDash)
            teamsContainerDiv.appendChild(awayTeamScore)
            teamsContainerDiv.appendChild(awayTeamSpan)

            if (match.extraTimeGoalsHome && match.extraTimeGoalsAway) {
                matchDiv.appendChild(extraTimeScoreContainerDiv)
                extraTimeScoreContainerDiv.appendChild(homeExtraTimeScore)
                extraTimeScoreContainerDiv.appendChild(extraTimeScoreDash)
                extraTimeScoreContainerDiv.appendChild(awayExtraTimeScore)
            }

            if (match.penaltiesHome && match.penaltiesAway) {
                var penalties = createPenaltiesDiv(match)
                matchDiv.appendChild(penalties)
            }

            matchDiv.appendChild(statusDiv)
            statusDiv.appendChild(statusSpan)
            matchDiv.appendChild(dateDiv)
            dateDiv.appendChild(dateSpan)
            matchList.appendChild(new_row)
        })
    }

    const createDiv = (className) => {
        var div = document.createElement('div')
        div.className = className
        return div
    }

    const createSpan = (className) => (textContent) => {
        var span = document.createElement('span')
        span.className = className
        span.textContent = textContent
        return span
    }

    const createPenaltiesDiv = (match) => {
        var penalties = createDiv('penalties')

        var penaltiesDiv = createDiv('penaltiesDiv')
        penalties.appendChild(penaltiesDiv)
        
        var penaltiesDivAway = createDiv('penaltiesDiv')
        penalties.appendChild(penaltiesDivAway)
        
        for (i = 0; i < match.penaltiesHome; i++) {
            var dotContainer = createDotContainer('circleBase')
            penaltiesDiv.appendChild(dotContainer)
        }
        
        for (i = 0; i < match.penaltiesAway; i++) {
            var dotContainer = createDotContainer('circleBase')
            penaltiesDivAway.appendChild(dotContainer)
        }

        for (i = 0; i < match.penaltiesHome - match.penaltiesAway; i++) {
            var dotContainer = createDotContainer('circleBaseRed')
            penaltiesDivAway.appendChild(dotContainer)
        }
        
        for (i = 0; i < match.penaltiesAway - match.penaltiesHome; i++) {
            var dotContainer = createDotContainer('circleBaseRed')
            penaltiesDiv.appendChild(dotContainer)
        }

        return penalties
    }

    const createDotContainer = (className) => {
        var dotContainer = document.createElement('div')
        dotContainer.className = 'dotContainer'
        var dot = document.createElement('div')
        dot.className = className
        dotContainer.appendChild(dot)
        return dotContainer
    }

    generateViewState(competitionId).then(viewState => {
        createHTMLForViewState(viewState)
    })

    window.setInterval(function () {
        generateViewState(competitionId).then(viewState => {
            createHTMLForViewState(viewState)
        })
    }, 40000);

})()