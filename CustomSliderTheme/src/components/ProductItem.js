/**
 * A component to display a product's photo, title and more info
 *
 * @param {object} model - ProductModel containing data of the product
 * @param {number} productNameLines - max lines of product name (default is 2)
 * @param {number} descriptionLines - max lines of short description (default is 4)
 * @param {boolean} detailed - controls the display - if true the description of the product should show, otherwise hide
 * @param {string} url - the url to redirect to when clicking the product
 * @param {string} [className] - a class name to place on the product element
 */

import React from 'react'
import './ProductItem.scss'
import { Router } from '$routes'
import Price from './Price'
import UnitsOfMeasure from "./UnitsOfMeasure"
import Inventory from "./Inventory"
import LinesEllipsis from 'react-lines-ellipsis'
import { isServer } from '$ustoreinternal/services/utils'
import responsiveHOC from 'react-lines-ellipsis/lib/responsiveHOC'
import ImageLoader from '$core-components/ImageLoader'

// using this ResponsiveEllipsis will handle responsive changes to the lineEllipsis component.
const ResponsiveEllipsis = responsiveHOC()(LinesEllipsis)

const onClick = (url) => {

  if (typeof url === "string") {
    Router.pushRoute(url)
  }
}

const ProductItem = (props) => {
  let { descriptionLines, productNameLines } = props

  productNameLines = productNameLines ? productNameLines : 2
  descriptionLines = descriptionLines ? descriptionLines : 4

  const { model, url, detailed, className } = props
  const imageUrl = (model && model.ImageUrl) ? model.ImageUrl : require(`$assets/images/default.png`)

  if (!model) {
    return null
  }

  const productNameAndCatalog = model.CatalogNumber && model.CatalogNumber.trim().length > 0 ? `${model.Name} / ${model.CatalogNumber}` : model.Name



  return (
    <div onClick={() => onClick(url)} className={`product-item ${className ? className : ''}`}>
      <div className="image-wrapper">
        <ImageLoader className="image" src={imageUrl} />
      </div>
      <div className="product-name" style={{ maxHeight: `${productNameLines * 1.5}em` }}>
        <ResponsiveEllipsis text={productNameAndCatalog} maxLine={productNameLines} basedOn='words' />
      </div>
      {
        (model.MinimumPrice) ?
          (
            <div>
              <div className="product-price">
                <Price model={model.MinimumPrice} isMinimumPrice={true} />
              </div>
              <div className="product-units">
                <UnitsOfMeasure minQuantity={model.MinimumQuantity} model={model.Unit} />
              </div>
            </div>
          ) : ''
      }
      <Inventory model={model.Inventory} minQuantity={model.MinimumQuantity} />
      {
        detailed &&
        <div className="product-description" style={{ maxHeight: `${descriptionLines * 1.5}em` }}>
          <ResponsiveEllipsis text={model.ShortDescription} maxLine={descriptionLines} basedOn='words' />
        </div>
      }
    </div>
  )
}
export default ProductItem
