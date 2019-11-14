import 'isomorphic-fetch'

export const loadLocalization = async ({ serverDomain }, locale) => {
  try {
    const localeUrl = `${serverDomain}/uStoreThemes/Global/Localizations/${locale}.js?rand=${Math.random()}`
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
