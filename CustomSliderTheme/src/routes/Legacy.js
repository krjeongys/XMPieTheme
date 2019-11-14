import { Component } from 'react'
import Layout from '../components/Layout'
import {UStoreProvider} from '@ustore/core'
import legacyIframeHandler from '$ustoreinternal/services/legacyIframeHandler'
import {Link, Router} from '$routes'
import {getCurrentCulture, queryOrCookieStrToObj, isServer} from '$ustoreinternal/services/utils'
import './Legacy.scss'

//Using https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
export class Legacy extends Component {

  constructor (props) {
    super(props)
    this.handleFrameMessage = this.handleFrameMessage.bind(this)
    this.isRoutingFromLegacy = false
  }

  handleFrameMessage = (e) => {
    const msg = e.data
    if (!msg || !msg.type) {
      return
    }
    const {router: {asPath}} = this.props
    const {isRoutingFromLegacy, messageHandled: changeRouteOrDimensionsHandled} = legacyIframeHandler.changeRouteOrDimensions(msg, asPath)
    this.isRoutingFromLegacy =  this.isRoutingFromLegacy || isRoutingFromLegacy
    const messageHandled = changeRouteOrDimensionsHandled || legacyIframeHandler.handleScrolling(msg)

    if (!messageHandled && !(['START', 'STATE', 'ACTION', 'PARTIAL_STATE', 'INIT_INSTANCE', '@SCROLL_ON' , '@SCROLL_OFF', '@SCROLL_TO', '@CHANGE_ROUTE'].includes(msg.type))) {
      UStoreProvider.state.dispatch(msg)
    }
  }

  componentDidMount () {
    if (!isServer()) {
      window.addEventListener('resize', legacyIframeHandler.handleResize)
      window.addEventListener('message', this.handleFrameMessage)
      window.addEventListener('blur', () => legacyIframeHandler.handleClickingIframe())

      legacyIframeHandler.adaptContainerToIframe()
    }
  }

  componentWillUnmount () {
    window.removeEventListener('resize', legacyIframeHandler.handleResize)
    window.removeEventListener('message', this.handleFrameMessage)
    window.removeEventListener('blur', () => legacyIframeHandler.handleClickingIframe() )

    if (!this.isRoutingFromLegacy) {
      legacyIframeHandler.hideIframe()
    }
  }

  render () {
    return <Layout {...this.props}>
      <div className="iframe-container" ref={e => legacyIframeHandler.iframeContainer = e}/>
    </Layout>
  }
}

