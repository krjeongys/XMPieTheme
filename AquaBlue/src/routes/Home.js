/**
 * This is the Homepage
 * URL : http://<store-domain>/{language-code}/home/
 *
 * @param {object} state - the state of the store
 */
import { UStoreProvider } from '@ustore/core'
import Layout from '../components/Layout'
import Slider from '$core-components/Slider'
import PromotionItem from '../components/PromotionItem'
import { Router } from '$routes'
import Gallery from '$core-components/Gallery'
import CategoryItem from '../components/CategoryItem'
import ProductItem from '../components/ProductItem'
import urlGenerator from '$ustoreinternal/services/urlGenerator'
import { t } from '$themelocalization'
import './Home.scss'
import { Component } from 'react'
import { getVariableValue } from '$ustoreinternal/services/cssVariables'
import theme from '$styles/_theme.scss'
import {throttle} from 'throttle-debounce'

class Home extends Component {

  constructor (props) {
    super(props)

    this.state = {
      isMobile: false,
      promotionItemImageUrl: '',
      promotionItemTitle: '',
      promotionItemSubtitle: '',
      promotionItemButtonText: '',
      promotionItemButtonUrl: ''
    }

  }

  componentDidMount () {
    //NOTE: this is not supported in SSR
    this.setState({promotionItemImageUrl: getVariableValue('--homepage-carousel-slide-1-image', require(`$assets/images/banner_image.png`), true)})
    this.setState({promotionItemTitle: getVariableValue('--homepage-carousel-slide-1-main-text', t('PromotionItem.Title'))})
    this.setState({promotionItemSubtitle: getVariableValue('--homepage-carousel-slide-1-sub-text', t('PromotionItem.Subtitle'))})
    this.setState({promotionItemButtonText: getVariableValue('--homepage-carousel-slide-1-button-text', t('PromotionItem.Button_Text'))})

    window.addEventListener('resize', this.onResize.bind(this));
    throttle(250, this.onResize);					// Call this function once in 250ms only

    this.onResize()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize)
  }

  onResize(){
    this.setState({isMobile: document.body.clientWidth < parseInt(theme.md.replace('px', ''))})
  }

  static getDerivedStateFromProps (props, state) {
    if(!(props.state && props.state.customState)) {
      return null
    }

    const {categories} = props.state.customState
    //NOTE: this is not supported in SSR
    if (categories && categories.length && !state.promotionItemButtonUrl.length) {
      const {FriendlyID} = categories[0]
      const defaultURL = urlGenerator.get({page: 'category', id: FriendlyID})
      return {promotionItemButtonUrl: getVariableValue('--homepage-carousel-slide-1-button-url', defaultURL, false, true)}
    }
    return null
  }

  render () {
    if (!this.props.state) {
      return null
    }

    const { customState: {categories, homeFeaturedProducts, homeFeaturedCategory}} = this.props

    return (
      <Layout {...this.props} className="home">
        <div className="promotion-wrapper">
          <Slider>
            <PromotionItem
              imageUrl={this.state.promotionItemImageUrl}
              title={this.state.promotionItemTitle}
              subTitle={this.state.promotionItemSubtitle}
              buttonText={this.state.promotionItemButtonText}
              url={this.state.promotionItemButtonUrl}
            />
          </Slider>
        </div>

        <div className="middle-section">
          {categories && categories.length > 0 &&
          <div className="categories-wrapper">
            <Slider multi>
              {
                categories.map((model) => {
                    return <CategoryItem key={model.ID} model={model}
                                         url={urlGenerator.get({page: 'category', id: model.FriendlyID})}/>
                  }
                )
              }
            </Slider>
          </div>
          }

          <div className="divider"/>
          {homeFeaturedCategory && homeFeaturedProducts &&
          <div className="featured-products-wrapper">
            <Gallery title={homeFeaturedCategory.Name}
                     seeAllUrl={urlGenerator.get({page: 'category', id: homeFeaturedCategory.FriendlyID})}
                     gridRows="2">
              {
                homeFeaturedProducts.map((model) => {
                  const hideProduct =
                    this.state.isMobile &&
                    model.Attributes &&
                    model.Attributes.find(attr => attr.Name === 'UEditEnabled' && attr.Value === 'true') !== undefined

                  return !hideProduct &&
                    <ProductItem
                      key={model.ID}
                      model={model}
                      productNameLines="2"
                      descriptionLines="4"
                      url={urlGenerator.get({page: 'product', id: `${model.FriendlyID}`})}
                    />
                })
              }
            </Gallery>
          </div>
          }
        </div>
      </Layout>
    )
  }
}

Home.getInitialProps = async function (ctx) {
  if (!!UStoreProvider.state.get().customState.homeFeaturedCategory && !!UStoreProvider.state.get().customState.homeFeaturedProducts) {
    return
  }

  const maxInPage = 200
  const {Count} = await UStoreProvider.api.categories.getTopCategories(1, maxInPage)
  if(Count === 0){
    return {homeFeaturedProducts: null, homeFeaturedCategory: null}
  }

  const page = Math.ceil(Count / maxInPage)
  const {Categories} = await UStoreProvider.api.categories.getTopCategories(page, maxInPage)

  if(Categories.length === 0){
    return {homeFeaturedProducts: null, homeFeaturedCategory: null}
  }

  const homeFeaturedCategory = Categories[Count-1]
  const {Products:homeFeaturedProducts} = await UStoreProvider.api.products.getProducts(homeFeaturedCategory.ID, 1)
  return {homeFeaturedProducts, homeFeaturedCategory }
}

export default Home
