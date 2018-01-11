const http = require('request-promise-native')

const generateViewState = (configuration) => {
    const currency = configuration.currency.value
    return Promise.all([fetchCurrentPrice(currency), fetchYesterdayPrice(currency)])
        .then(results => toViewState(results)(currency))
}

const fetchCurrentPrice = (currency) => {
    const request = {
        url: `https://api.coindesk.com/v1/bpi/currentprice/${currency}.json`
    }

    return http.get(request)
}

const fetchYesterdayPrice = (currency) => {
    const request = {
        url: `https://api.coindesk.com/v1/bpi/historical/close.json?for=yesterday&currency=${currency}`
    }

    return http.get(request)
}

const toViewState = (rawResponses) => (currency) => {
    const currentPriceResponse = JSON.parse(rawResponses[0])
    const yesterdayPriceResponse = JSON.parse(rawResponses[1])

    const currentPrice = currentPriceResponse.bpi[currency].rate_float
    const currentPriceFormatted = getCurrentPriceFormatted(currentPrice)
    const yesterdayDiff = getYesterdayDiff(yesterdayPriceResponse)(currentPrice)
    const yesterdayDiffFormatted = getYesterdayDiffFormatted(yesterdayDiff)
    const yesterdayDiffPercentage = getYesterdayDiffPercentageFormatted(yesterdayDiff)(currentPrice)
    const symbol = getSymbolFor(currency)
    const textColor = getTextColorFor(yesterdayDiff)
    const sign = getSign(yesterdayDiff)
    return {
        currentPrice: currentPriceFormatted,
        yesterdayDiff: yesterdayDiffFormatted,
        yesterdayDiffPercentage: yesterdayDiffPercentage,
        symbol: symbol,
        currency: currency,
        textColor: textColor,
        sign: sign
    }
}

const getCurrentPriceFormatted = (currentPrice) => {
    const currentPriceString = currentPrice.toFixed(2)
    return (+currentPriceString).toLocaleString()
}

const getYesterdayDiff = (yesterdayPriceResponse) => (currentPrice) => {
    const yesterdayPrice = yesterdayPriceResponse.bpi[Object.keys(yesterdayPriceResponse.bpi)[0]]
    return currentPrice - yesterdayPrice
}

const getYesterdayDiffFormatted = (yesterdayDiff) => {
    return Math.abs(yesterdayDiff).toFixed(2)
}

const getYesterdayDiffPercentageFormatted = (yesterdayDiff) => (currentPrice) => {
    const yesterdayDiffPercentage = (yesterdayDiff * 100 / currentPrice)
    return Math.abs(yesterdayDiffPercentage).toFixed(2)
}

const getSymbolFor = (currency) => {
    const currencySymbols = {
        'USD': '$', // US Dollar
        'EUR': '&#8364;', // Euro
        'CRC': '&#8353;', // Costa Rican Colón
        'GBP': '&pound;', // British Pound Sterling
        'ILS': '&#8362;', // Israeli New Sheqel
        'INR': '&#8377;', // Indian Rupee
        'JPY': '&#165;', // Japanese Yen
        'PLN': '&#122;&#322;', // Polish Zloty
        'PYG': '&#71;&#115;', // Paraguayan Guarani
        'CHF': '&#67;&#72;&#70;' // Swiss 
    };
    return currencySymbols[currency]
}

const getTextColorFor = (yesterdayDiff) => {
    const negativeColor = '#e5425a'
    const positiveColor = '#61CA00'
    return yesterdayDiff < 0 ? negativeColor : positiveColor
}

const getSign = (yesterdayDiff) => {
    return yesterdayDiff < 0 ? '-' : '+'
}

module.exports = generateViewState