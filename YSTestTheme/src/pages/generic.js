import { Component } from "react"
import deepcopy from "deepcopy"
import {withRouter} from 'next/router'
import { UStoreProvider } from '@ustore/core'
import pages from '$themepages/index'
import {isServer, camelToPascal, dashToCamel, setCookie, getCookie, getNextConfig} from '$ustoreinternal/services/utils'
import { getInitialProps , initialLoad,redirectToLogout,redirectToStoreErrorPage,redirectToGenericErrorPage} from '$ustoreinternal/services/initialLoad'
import themeContext from '$ustoreinternal/services/themeContext'
import urlGenerator from '$ustoreinternal/services/urlGenerator'
import  { Router } from '$routes'
import legacyIframeHandler from '$ustoreinternal/services/legacyIframeHandler'
import '$styles/index.scss'
import {initiateThemeState} from '$themeservices/initThemeState'

class Generic  extends Component{

  constructor(props) {
    super(props)
    const publicRuntimeConfig  = getNextConfig()

    if (!isServer()) {
      themeContext.updateRouteParams()
      themeContext.init()

      UStoreProvider.init(publicRuntimeConfig, {
        ...themeContext.get(),
        onAccessDenied: () => redirectToLogout(),
        onStoreNotAvailable: () => redirectToStoreErrorPage(),
        onGeneralError: () => redirectToGenericErrorPage()
      }).then(() => {
        initiateThemeState()
      })

      UStoreProvider.state.set(this.props.state)
    }

    this.config = publicRuntimeConfig
  }

  componentDidMount(){
    const  { buildType } = this.config

    // connect redux state change to react to update when state has changed
    this.unsubscribe = UStoreProvider.state.subscribe(() => {
      // This prevent the storeFriendlyID from being null on reload in legacy page.
      if (UStoreProvider.state.get().currentStore) {
        themeContext.set('storeFriendlyID', UStoreProvider.state.get().currentStore.FriendlyID)
      }

      this.forceUpdate()
    })

    // in client init the context and set cookies according to the context
    if (!isServer()) {
      themeContext.init()
      const {securityToken, languageCode} = themeContext.get()
      securityToken && setCookie('_token', securityToken)
      languageCode && setCookie('_language', languageCode)
    }

    //Init iframe handler service
    const {router: {asPath}} = this.props

    legacyIframeHandler.handleRoute(asPath)

    if (!isServer() && buildType === 'client_only') {
      return initialLoad()
    }
  }

  componentWillUnmount() {
    this.unsubscribe()
    legacyIframeHandler.unmount()
  }

  getPageComponentName(page) {
    return camelToPascal(dashToCamel(page))
  }

  applyStateChanges(pages, pageComponentName) {

    const modifyStateBeforeRender = pages[pageComponentName] ? pages[pageComponentName].modifyStateBeforeRender : pages.Home.modifyStateBeforeRender;
    const uStoreState = UStoreProvider ? UStoreProvider.state.get() : {};

    const userState = modifyStateBeforeRender ? modifyStateBeforeRender(deepcopy(uStoreState)) : uStoreState;
    return userState || uStoreState;
  }

  render() {
    // in client only mode render an empty div, when application is initialise it will render the page.
    if (isServer() && this.config.buildType === 'client_only') {
      return <div/>
    }

    const {router: {query,asPath}} = this.props

    // in client only will redirect when the url is missing the page name
    if ((asPath.match(/\//g) || []).length < 3 && !isServer()) {
      setTimeout(() => Router.push(urlGenerator.get({page:'home'}) + window.location.search))
    }

    // in client if security token is missing get it from the cookie
    if (!isServer && !query.SecurityToken) {
        query.SecurityToken = getCookie('_token')
    }

	const ctx = themeContext.get()
    if (!ctx || !ctx.page) {
      return null
    }

    const pageComponentName = this.getPageComponentName(ctx.page)

    // modify state that is sent to the page with out modifying the state in the uStoreProvider
    const state = this.applyStateChanges(pages, pageComponentName)

    // create all properties needed from the page component
    const newProps = {...this.props,  state, customState: state.customState }

    return React.createElement(pages[pageComponentName], newProps)
  }
}

Generic.getInitialProps = getInitialProps

export default withRouter(Generic)
