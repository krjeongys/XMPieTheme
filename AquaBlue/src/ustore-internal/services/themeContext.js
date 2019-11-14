import {
  getCookie,
  getHeader,
  isServer,
  queryOrCookieStrToObj,
  setCookie,
  getNextConfig
} from '$ustoreinternal/services/utils'
import { routes } from '$routes'

const publicRuntimeConfig = getNextConfig()

class ThemeContext {
  constructor () {
    this.context = { ...publicRuntimeConfig, ...{ page: 'home' } }
  }

  get (key) {
    return key ? this.context[key] : this.context
  }

  set(key, value) {
    this.context[key] = value
  }

  deleteKey(key) {
    delete this.context[key]
  }

  updateRouteParams(ctx) {
    const asPath = ctx ? ctx.asPath : window.location.pathname

    this.set('page', 'home')
    this.deleteKey('id')

    routes.forEach(r => {
      const m = r.match(asPath.split('?')[0])
      if (m) {
        Object.assign(this.context, m)
      }
    })
  }

  init(ctx) {
    if (ctx) {
      if (ctx.req) {
        this.context.securityToken = getHeader(ctx.req, '_token')
        this.context.languageCode = getHeader(ctx.req, '_language')
        this.context.storeID = getHeader(ctx.req, '_storeID')
        this.context.currencyFriendlyID = getHeader(ctx.req, '_currencyID')
      }
      if (ctx.query) {
        ctx.query.SecurityToken && (this.context.securityToken = ctx.query.SecurityToken)
        ctx.query.languageCode && (this.context.languageCode = ctx.query.languageCode)
        ctx.query.StoreGuid && (this.context.storeID = ctx.query.StoreGuid)
        ctx.query.currencyFriendlyID && (this.context.currencyFriendlyID = ctx.query.currencyFriendlyID)
      }
    } else {
      const searchStr = window.location.search.substring(1)

      if (searchStr) {
        const q = queryOrCookieStrToObj(searchStr)
        if (q.SecurityToken) {
          this.context.securityToken = q.SecurityToken
          setCookie('_token', this.context.securityToken)
        }

        if (q.CultureCode) {
          this.context.languageCode = q.CultureCode
          setCookie('_language', this.context.languageCode)
        }

        if (q.StoreGuid) {
          this.context.storeID = q.StoreGuid
          setCookie('_storeID', this.context.storeID)
        }

        if (q.currencyFriendlyID) {
          this.context.currencyFriendlyID = q.currencyFriendlyID
          setCookie('_currencyID', this.context.currencyFriendlyID)
        }

      }
      this.context.languageCode = getCookie('_language') || this.context.languageCode
      this.context.showThemeAsDraft = getCookie('_showThemeAsDraft') || this.context.showThemeAsDraft
      this.context.securityToken = getCookie('_token') || this.context.securityToken
      this.context.storeID = getCookie('_storeID') || this.context.storeID
      this.context.currencyFriendlyID = getCookie('_currencyID') || this.context.currencyFriendlyID
    }

    const asPath = isServer() ? ctx.req.path : window.location.pathname

    routes.forEach(r => {
      const m = r.match(asPath.split('?')[0])

      if (m) {
        this.context = Object.assign({}, this.context, m)
      }
    })
  }
}

export default new ThemeContext()
