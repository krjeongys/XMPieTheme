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
import { throttle } from 'throttle-debounce'
import { getIsNGProduct } from '../services/utils'
import AnimatedSlider from '../core-components/AnimatedSlider'

class Home extends Component {

	constructor(props) {
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

	componentDidMount() {
		//NOTE: this is not supported in SSR
		this.setState({ promotionItemImageUrl: getVariableValue('--homepage-carousel-slide-1-image', require(`$assets/images/banner_image.png`), true) })
		this.setState({ promotionItemTitle: getVariableValue('--homepage-carousel-slide-1-main-text', t('PromotionItem.Title')) })
		this.setState({ promotionItemSubtitle: getVariableValue('--homepage-carousel-slide-1-sub-text', t('PromotionItem.Subtitle')) })
		this.setState({ promotionItemButtonText: getVariableValue('--homepage-carousel-slide-1-button-text', t('PromotionItem.Button_Text')) })

		window.addEventListener('resize', this.onResize.bind(this));
		throttle(250, this.onResize);					// Call this function once in 250ms only

		this.onResize()
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.onResize)
		this.clearCustomState()
	}

	clearCustomState() {
		UStoreProvider.state.customState.delete('homeFeaturedProducts')
		UStoreProvider.state.customState.delete('homeFeaturedCategory')
	}

	onResize() {
		this.setState({ isMobile: document.body.clientWidth < parseInt(theme.md.replace('px', '')) })
	}

	static getDerivedStateFromProps(props, state) {
		if (!(props.state && props.state.customState)) {
			return null
		}

		const { categories } = props.state.customState
		//NOTE: this is not supported in SSR
		if (categories && categories.length && !state.promotionItemButtonUrl.length) {
			const { FriendlyID } = categories[0]
			const defaultURL = urlGenerator.get({ page: 'category', id: FriendlyID })
			return { promotionItemButtonUrl: getVariableValue('--homepage-carousel-slide-1-button-url', defaultURL, false, true) }
		}
		return null
	}



	render() {
		if (!this.props.state) {
			return null
		}

		const { customState: { categories, homeFeaturedProducts, homeFeaturedCategory, newProducts, newProductCategory } } = this.props

		debugger;

		let randomProductArr = null;
		
		if ( homeFeaturedProducts && homeFeaturedProducts.length >= 6 )//전체 상품에 6개 이상 있어야 보여짐
		{
			const randomProductIndexArr = [0, 2, 3, 5]; //배열 번호에 있는 상품만 나옴
			randomProductArr = [];
			randomProductIndexArr.forEach(index => {
				randomProductArr.push(homeFeaturedProducts[index]);
			});
		}

		return (
			<Layout {...this.props} className="home">
				<AnimatedSlider />

				<div className="middle-section">
					{categories && categories.length > 0 &&
						<div className="categories-wrapper">
							<Slider multi>
								{
									categories.map((model) => {
										return <CategoryItem key={model.ID} model={model}
											url={urlGenerator.get({ page: 'category', id: model.FriendlyID })} />
									}
									)
								}
							</Slider>
						</div>
					}

					<div className="divider" />
					{homeFeaturedCategory && homeFeaturedProducts &&
						<div className="featured-products-wrapper">
							<Gallery title={homeFeaturedCategory.Name}
								description={homeFeaturedCategory.Description}
								seeAllUrl={urlGenerator.get({ page: 'category', id: homeFeaturedCategory.FriendlyID })}
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
												url={getIsNGProduct(model.Type) ? urlGenerator.get({ page: 'products', id: model.FriendlyID }) : urlGenerator.get({ page: 'product', id: model.FriendlyID })}
											/>
									})
								}
							</Gallery>
						</div>
					}
					<div className="divider" />
					{randomProductArr && randomProductArr.length > 0 &&
						<div className="featured-products-wrapper">
							<Gallery title="Random Product"
								description="Random Product description"
								seeAllUrl={urlGenerator.get({ page: 'category', id: homeFeaturedCategory.FriendlyID })}
								gridRows="2">
								{
									randomProductArr.map((model) => {
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
												url={getIsNGProduct(model.Type) ? urlGenerator.get({ page: 'products', id: model.FriendlyID }) : urlGenerator.get({ page: 'product', id: model.FriendlyID })}
											/>
									})
								}
							</Gallery>
						</div>
					}
					<div className="divider" />
					{newProducts && newProducts.length > 0 &&
						<div className="featured-products-wrapper">
							<Gallery title={newProductCategory.Name}
								description={newProductCategory.Description}
								seeAllUrl={urlGenerator.get({ page: 'category', id: newProductCategory.FriendlyID })}
								gridRows="1">
								{
									newProducts.map((model) => {
										const hideProduct =
											this.state.isMobile &&
											model.Attributes &&
											model.Attributes.find(attr => attr.Name === 'UEditEnabled' && attr.Value === 'true') !== undefined

										return !hideProduct &&
											<ProductItem
												key={model.ID}
												model={model}
												detailed={ model.ShortDescription }
												productNameLines="2"
												descriptionLines="4"
												url={getIsNGProduct(model.Type) ? urlGenerator.get({ page: 'products', id: model.FriendlyID }) : urlGenerator.get({ page: 'product', id: model.FriendlyID })}
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
	const maxInPage = 200
	const { Count } = await UStoreProvider.api.categories.getTopCategories(1, maxInPage)
	if (Count === 0) {
		return { homeFeaturedProducts: null, homeFeaturedCategory: null }
	}

	const page = Math.ceil(Count / maxInPage)
	const { Categories } = await UStoreProvider.api.categories.getTopCategories(page, maxInPage)

	if (Categories.length === 0) {
		debugger;
		return { homeFeaturedProducts: null, homeFeaturedCategory: null }
	}

	const allProductCategory = Categories[Count - 2]
	const newProductCategory = Categories[Count - 1];

	const homeFeaturedCategory = allProductCategory;

	//   const { Products: homeFeaturedProducts } = await UStoreProvider.api.products.getProducts(homeFeaturedCategory.ID, 1)
	const { Products: homeFeaturedProducts } = await UStoreProvider.api.products.getProducts(allProductCategory.ID, 1)
	const { Products: newProducts } = await UStoreProvider.api.products.getProducts(newProductCategory.ID, 1)

	debugger;
	return { homeFeaturedProducts, homeFeaturedCategory, newProducts, newProductCategory }
}

export default Home
