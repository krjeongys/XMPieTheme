/**
 * @function Header - contains all the components of the header section
 *
 * @param {object} categoriesTree - a list of CategoryTreeNodeModel. Each node should contain:
 * 		Category {object} - CategoryModel
 * 		SubCategories {object} - list of CategoryTreeNodeModel
 * @param {object} currencies - all currencies - should contain:
 *    ID {string} - unique currency id
 *    Symbol {string} - the currency character
 *    Code {string} - the currency name
 * @param {object} currentCurrency - the selected currency - should contain:
 *    ID {string} - unique currency id
 *    Symbol {string} - the currency character
 *    Code {string} - the currency name
 * @param {object} cultures - all cultures - should contain:
 *    ID {string} - unique culture id
 *    Flag {string} - the flag file name
 *    DisplayName {string} - the language name
 * @param currentCulture - the selected culture - should contain:
 *    ID {string} - unique culture id
 *    Flag {string} - the flag file name
 *    DisplayName {string} - the language name
 * @param currentUser - should contains at least FirstName
 */

import React, {Component} from 'react'
import {throttle} from 'throttle-debounce'
import {UStoreProvider} from '@ustore/core'
import Search from './Search'
import CategoriesNavbar from './CategoriesNavbar'
import CategoriesSidebar from './CategoriesSidebar'
import Profile from './Profile'
import Company from './Company'
import SignOut from './SignOut'
import Overlay from '$core-components/Overlay'
import Switcher from '$core-components/Switcher'
import Cart from "./Cart"
import './Header.scss'
import {Router, Link} from '$routes'
import urlGenerator from '$ustoreinternal/services/urlGenerator'
import legacyIframeHandler from '$ustoreinternal/services/legacyIframeHandler'
import {t} from '$themelocalization'
import {setCookie} from "$ustoreinternal/services/utils";
import {getVariableValue} from "$ustoreinternal/services/cssVariables";
import theme from '$styles/_theme.scss'
import Icon from '$core-components/Icon'

class Header extends Component {
  constructor() {
    super();
    this.header = React.createRef();		// A reference to the main wrapper element

    this.state = {
      drawerOpen: false,						    // Left drawer - opened/closed
      overlayActive: false,	  			    // The overlay - active or not
      lastScrollPos: 0,                 // Latest position of the scroller
      logoImageUrl: require(`$assets/images/logo.png`)
    }
  }

  componentDidMount() {
    const {currentStore} = this.props
    document.title = document && document.title && currentStore ? currentStore.Name : '';
    
    window.addEventListener('scroll', this.onScroll);
    throttle(250, this.onScroll);					// Call this function once in 250ms only
    window.addEventListener('resize', this.onResize);
    throttle(250, this.onResize);					// Call this function once in 250ms only

    this.setLogoImage()
  }

  componentDidUpdate() {

  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll)
    window.removeEventListener('resize', this.onResize)
  }

  // NOTE: this is not supported in SSR
  setLogoImage = () => {
    const variableForLogoImg = window.matchMedia(`(min-width: ${theme.lg})`).matches ? '--logo-image' : '--logo-image-mobile'
    this.setState({logoImageUrl : getVariableValue(variableForLogoImg,require(`$assets/images/logo.png`),true)})
  }

  onScroll = () => {
    let el = this.header
    let topContentHeight = 0
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop
    let scrollDiff = this.state.lastScrollPos - scrollTop
    this.setState({
      lastScrollPos: scrollTop
    });

    if ((scrollDiff > 0) && (scrollTop > topContentHeight)) {
      // On scrolling up - add position: fixed to the main wrapper
      // so the header will appear at the top of the current view
      el && el.classList && el.classList.add('sticky-slidein')
      document.body.style.marginTop = el.offsetHeight + "px"
    } else {
      // On scrolling down - remove the scrolling up functionality
      el && el.classList && el.classList.remove('sticky-slidein')
      document.body.style.marginTop = "0px"
    }
  }

  onResize = () => {
    this.setLogoImage()
  }

  drawerStateChange(open) {
    this.setState({drawerOpen: open})
    this.setState({overlayActive: open})

    if(open) {
      document.body.style.overflow = 'hidden'
    }
    else {
      document.body.style.overflow = 'auto'
    }
  }

  burgerClicked() {
    this.drawerStateChange(true)
  }

  overlayClicked() {
    this.drawerStateChange(false)
  }

  getFlagFromCode(languageCode) {
    return `${languageCode}.svg`
  }

  render() {
    if(!this.props.customState) {
      return null
    }

    const {customState: {categoriesTree, userOrdersSummary}, currencies, cultures, currentCulture, currentUser, currentCurrency} = this.props

    const currenciesViewModel = currencies && currencies.map(({ID, Symbol, Code}) => ({
      ID, sign: Symbol, value: Code
    }))

    const culturesViewModel = cultures && cultures.map(({ID, CountryCode, Name}) => ({
      ID, icon: this.getFlagFromCode(CountryCode), value: Name
    }))

    const currencySelected = (selected) => {
      const selectedCurrency = currencies.find(i => i.ID === selected)
      UStoreProvider.state.culture.setCurrentCurrency(selectedCurrency)
      setCookie('_currencyID', selectedCurrency.FriendlyID)
      legacyIframeHandler.postMessage({
        type: '@CHANGE_CURRENCY',
        data: selectedCurrency.FriendlyID
      })
    }

    const cultureSelected = (selected) => {
      const selectedCulture = cultures.find(i => i.ID === selected)
      const pathWithNewLangugageCode = window.location.pathname.replace(/[a-z]{2}-[a-zA-Z]{1,}-{0,1}[a-zA-Z]{0,}/,selectedCulture.LanguageCode)
      const searchString  = window.location.search
      const hashString = window.location.hash
      window.location.replace(pathWithNewLangugageCode + searchString + hashString)
    }

    const sidebarRedirect = (pageParams) => {
      this.drawerStateChange(false)
      Router.pushRoute(urlGenerator.get(pageParams))
    }

    return (
      <div className='header'>
        <div className='header-stripe' ref={(ref) =>this.header = ref} draweropen={`${this.state.drawerOpen}`}>
          <div className="logo-wrapper">
            <div className="menu-icon-container" onClick={this.burgerClicked.bind(this)}>
              <Icon name="menu.svg" width="23px" height="20px" className="menu-icon" />
            </div>
            <Link to={urlGenerator.get({page:'home'})}>
              <a>
                <div className="logo-container">
                  {this.state.logoImageUrl && <img className="logo" src={this.state.logoImageUrl} alt="logo" /> }
                </div>
              </a>
            </Link>
          </div>
          {
            categoriesTree && categoriesTree.length > 0 &&
            <CategoriesNavbar categoriesTree={categoriesTree}/>
          }
          <Search />
          <div className="right-icons">
		  	<Company />
            {culturesViewModel && culturesViewModel.length > 0 &&
            <Switcher
              className="culture"
              items={culturesViewModel}
              selected={currentCulture && culturesViewModel.find((element)=>{return currentCulture.ID === element.ID})}
              label={t('Header.Language')}
              onSelected={cultureSelected}/>
            }
            {currenciesViewModel && currenciesViewModel.length > 0 &&
            <Switcher
              className="currency"
              items={currenciesViewModel}
              selected={currentCurrency && currenciesViewModel.find((element)=>{return currentCurrency.ID === element.ID})}
              label={t('Header.Currency')}
              onSelected={currencySelected}/>
            }
			{currentUser && <Profile currentUser={currentUser} userOrdersSummary={userOrdersSummary} /> }
            <Cart />
          </div>
          <div className="drawer-wrapper">
            {currenciesViewModel && currenciesViewModel.length > 0 &&
            <Switcher
              className="currency"
              items={currenciesViewModel}
              selected={currentCurrency && currenciesViewModel.find((element)=>{return currentCurrency.ID === element.ID})}
              label={t('Header.Currency')}
              onSelected={currencySelected}/>
            }
            {culturesViewModel && culturesViewModel.length > 0 &&
            <Switcher
              className="culture"
              items={culturesViewModel}
              selected={currentCulture && culturesViewModel.find((element)=>{return currentCulture.ID === element.ID})}
              label={t('Header.Language')}
              onSelected={cultureSelected}/>
            }
            {
              categoriesTree && categoriesTree.length > 0 &&
              <CategoriesSidebar categoriesTree={categoriesTree} onRedirect={sidebarRedirect}/>
            }
            {currentUser && <SignOut currentUser={currentUser}/>}
          </div>
          <Overlay isActive={this.state.overlayActive} overlayClicked={this.overlayClicked.bind(this)}/>
        </div>
      </div>

    )
  }
}

export default Header
