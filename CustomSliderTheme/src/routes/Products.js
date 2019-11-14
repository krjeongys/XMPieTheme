import { UStoreProvider } from '@ustore/core'
import KitProduct from '../components/KitProduct'
import { Component } from "react"
import React from "react";
import Layout from '../components/Layout'
import './Products.scss'
import LoadingDots from '$core-components/LoadingDots'
import { productTypes } from '../services/utils'

class Products extends Component {

    constructor(props) {
        super(props)


    }

    renderLoader() {
        return <div className={'product-loading'}>
            <LoadingDots />
            <div>Loading Product Details</div>
            <div>please wait.</div>
        </div>
    }

    render() {
        if (!this.props.state || !this.props.customState) {
            return this.renderLoader()
        }

        const { customState: { currentProduct } } = this.props

        if (!currentProduct) {
            return this.renderLoader()
        }

        // check type of prodocut to decide which component to render.
        switch (currentProduct.Type) {
            case productTypes.KIT:
                return <Layout {...this.props}>
                    <KitProduct key={currentProduct.ID} {...this.props} />
                </Layout>
            default:
                return null
        }

    }

}

Products.getInitialProps = async function (ctx) {
    const { query: { id, OrderItemId: orderItemID } } = ctx

    const productID = await UStoreProvider.api.products.getProductIDByFriendlyID(id)
    const productDetails = await UStoreProvider.api.products.getProductsByIDs([productID])

    if (productDetails && productDetails.length === 1) {
        return { currentProduct: productDetails[0], currentOrderItemId: orderItemID }
    }

    return null

}




export default Products
