import 'isomorphic-fetch'

export const loadLocalization = async ({ apiUrl, storeID }, locale) => {
  try {
    const localeUrl = `${apiUrl}/v1/store/localization?cultureCode=${locale}&storeID=${storeID}`

    const jsonFile = await fetch(localeUrl)
    const fileContent = await jsonFile.text()

    const json = fileContent
      .replace(/window\.uStoreLocalization\s+=\s+window\.uStoreLocalization\s+\|\|\s+{};/igm, '')
      .replace(/window.uStoreLocalization\[\'[a-z]{2}-[A-Z]+\'\]\s+=/igm, '')
      .replace(/\s*;$/, '')
    return JSON.parse(json)
  } catch (e) {
    return {}
  }
}
