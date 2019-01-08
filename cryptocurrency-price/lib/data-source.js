const http = require('request-promise-native')

//https://min-api.cryptocompare.com/documentation?key=Price&cat=multipleSymbolsFullPriceEndpoint

const generateViewState = (configuration) => {
  const viewState = {}

    return fetchCurrentPrices(configuration).then(result =>

      Promise.resolve(parseCurrentPrices(result, configuration.cryptoCurrency.value, configuration.fiatCurrency.value))
    )

}

const fetchCurrentPrices = (configuration) => {
    const request = {
        url: 'https://min-api.cryptocompare.com/data/pricemultifull',
        headers: {
            "authorization": `Apikey ${configuration.apiKey.value}`
        },
        qs: {
            fsyms: configuration.cryptoCurrency.value,
            tsyms: configuration.fiatCurrency.value
        }
    }
    return http.get(request)
}

const parseCurrentPrices = (response, cryptoCurrency, fiatCurrency) => {
  const jsonResponse = JSON.parse(response)
  const cryptoCurrencies = cryptoCurrency.split(",")
  const fiatCurrencies = fiatCurrency.split(",")
  const viewState = {}


// nested forEach for crypto/fiat

  cryptoCurrencies.forEach( (currency, currencyIndex) => {
    viewState[`cryptoCurrency${currencyIndex + 1}Name`] = currency
    fiatCurrencies.forEach( (fiatCurrency, fiatIndex) => {
      viewState[`currency${currencyIndex + 1}toFiatCurrency${fiatIndex + 1}`] = jsonResponse.DISPLAY[currency][fiatCurrency].PRICE
    })
  })

  return viewState
}

module.exports = generateViewState
