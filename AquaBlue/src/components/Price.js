/**
 * A component to display price information of a product, formatted according to currency and culture definitions
 *
 * @param {object} model - ProductPriceModel containing data regarding the price of the product
 * @param {object} state - current state of the store
 */

import { withState } from '$ustoreinternal/services/withState'
import { UStoreProvider } from '@ustore/core'
import { formatNumByLocale } from '$ustoreinternal/services/utils'

const Price = ({ model, state }) => {
  const { currentStore, currentCurrency, currentCulture } = state

  if (!currentStore || !currentCurrency || !currentCulture || !model || Number.isNaN(model.Price) || Number.isNaN(model.Tax))
    return ''

  let formatParams = {
    taxFormat: currentStore.TaxFormat,
    symbol: currentCurrency.Symbol,
    code: currentCurrency.Code,
    currencyFormat: currentCulture.CurrencyFormat,
    decimalSeparator: currentCulture.DecimalSeparator,
    decimalPlaces: currentCulture.DecimalPlaces,
    languageCode: currentCulture.LanguageCode
  }

  const { price, tax, priceIncludingTax } = UStoreProvider.state.culture.getConvertedPrices(model)


  //format the given price and tax amount to a string according to the tax, culture and currency definitions of models in state
  const priceDisplayString = formatParams.taxFormat
    .replace(/{Price}/g, formatForCurrencyAndCulture(price, formatParams))
    .replace(/{Tax}/g, formatForCurrencyAndCulture(tax, formatParams))
    .replace(/{PriceIncludingTax}/g, formatForCurrencyAndCulture(priceIncludingTax, formatParams))


  // new Intl.NumberFormat(currentCulture.LanguageCode).format(priceDisplayString)
  return (
    <span className="price">{priceDisplayString} {formatParams.code}</span>
  )
}

//format the given amount to a string according to the passed definitions of currency an culture
const formatForCurrencyAndCulture = (amount, formatParams) => {
  const { currencyFormat, symbol, decimalPlaces, decimalSeparator } = formatParams
  // split the amount to Integer and floating, apply toFixed(decimalPlaces) to get correct amount of digits.
  const [intAmount, floating] = amount.toFixed(decimalPlaces).toString().split('.') //in case of decimalPlaces == 0, the 'floating' const will be undefined.

  return currencyFormat
    .replace(/{Symbol}/g, symbol)
    // format the given amount to a string according to passed culture definitions
    // apply the formatNumByLocale function only on the Integer part of the amount, and add the floating part only if exist.
    // only show decimalSeparator if floating exist  (in case of decimalPlaces == 0, the 'floating' const will be undefined)
    .replace(/{Amount}/g, formatNumByLocale(intAmount, formatParams.languageCode) + (floating ? decimalSeparator + floating : ''))
}

export default withState(Price)
