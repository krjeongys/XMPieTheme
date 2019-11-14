import {
  isServer,
  dashToCamel,
  globalVar,
  createContext,
  getNextConfig
} from '$ustoreinternal/services/utils'
import themeContext from '$ustoreinternal/services/themeContext'
import { UStoreProvider } from '@ustore/core'
import pages from '$themepages/index'
import i18n from 'roddeh-i18n'
import { Router } from '$routes'
import {loadLocalization} from '$ustoreinternal/services/localization'
import {initiateThemeState} from '$themeservices/initThemeState'

const getUserInitialProps = async (initialPropsFunctionName, ctx) => {
  const routedPage = Object.keys(pages).filter(p => p.toLowerCase() === initialPropsFunctionName.toLowerCase())

  if (routedPage.length > 0 && pages[routedPage].getInitialProps) {
    return await pages[routedPage].getInitialProps(ctx)
  }

  return pages.Home.getInitialProps ? await pages.Home.getInitialProps(ctx) : {}
}

export const getInitialProps = (ctx) => {
  const { buildType } = getNextConfig()
  if (isServer() && buildType === 'client_only') {
    return {}
  }

  return initialLoad(ctx)
}

export const redirectToLogout = (ctx) => {
  const { securityToken, storeFriendlyID, storeID } = themeContext.get()
  redirectToLegacy(ctx, `logout.aspx?SecurityToken=${securityToken}&StoreGuid=${storeID}&storeid=${storeFriendlyID}`)
}

export const redirectToStoreErrorPage = (ctx) => {
  redirectToLegacy(ctx, 'ShowMessage.aspx?ErrorCode=0')
}

export const redirectToGenericErrorPage = (ctx) => {
  redirectToLegacy(ctx, `errorPage.aspx`)
}

const redirectToLegacy = (ctx, legacyURL) => {
  const { classicUrl } = themeContext.get()
  const url = `${classicUrl}/${legacyURL}`
  if (ctx && ctx.res) {
    ctx.res.writeHead(302, {
      Location: url
    })
    ctx.res.end()
  } else {
    window.location.href = url
  }
  return {}
}

export const initialLoad = async (ctxParam) => {
  const publicRuntimeConfig = getNextConfig()
  const ctx = ctxParam || createContext()

  if (isServer()) {
    themeContext.init(ctx)
  } else {
    themeContext.updateRouteParams(ctx)
  }

  // in dev mode wait for load localizations
  if (isServer()) {
    const keys = await loadLocalization(themeContext.get(), themeContext.context['languageCode'])

    globalVar.uStoreLocalization = {
      [themeContext.context['languageCode']]: i18n.create({ values: keys })
    }
  }

  await UStoreProvider.init(publicRuntimeConfig, {
    ...themeContext.get(),
    onAccessDenied: () => redirectToLogout(ctx),
    onStoreNotAvailable: () => redirectToStoreErrorPage(ctx),
    onGeneralError: () => redirectToGenericErrorPage(ctx)
  })

  await initiateThemeState()

  // redirect to logout if the url and cookie have a different storeid
  // this state is relevant only in case of dev mode because the state is returned from the server
  if (UStoreProvider.state.get().currentStore) {
    const { ID: storeidFromToken } = UStoreProvider.state.get().currentStore
    const { storeID: storeIDFromURL } = themeContext.get()

    if (storeidFromToken.toString() !== storeIDFromURL) {
      redirectToLogout(ctx)
    } else {
      themeContext.set('storeID', storeidFromToken)
      themeContext.set('storeFriendlyID', UStoreProvider.state.get().currentStore.FriendlyID)
    }
  }

  const { page } = themeContext.get()
  const initialPropsFunctionName = dashToCamel(page)

  //sets the user initial props to custom state.
  const userInitialProps = await getUserInitialProps(initialPropsFunctionName, ctx)
  if (userInitialProps) {
    UStoreProvider.state.customState.setBulk(userInitialProps)
  }

  const userCustomState = { customState: { ...UStoreProvider.state.get().customState, ...userInitialProps } }

  // returns the state from the component to be rendered.
  return { state: { ...UStoreProvider.state.get(), ...userCustomState }, context: ctx.query }
}
