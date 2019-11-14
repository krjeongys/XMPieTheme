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
import {Link} from '$routes'
import Price from './Price'
import UnitsOfMeasure from "./UnitsOfMeasure"
import Inventory from "./Inventory"
import {t} from '$themelocalization'
import LinesEllipsis from 'react-lines-ellipsis'
import {isServer} from '$ustoreinternal/services/utils'
import responsiveHOC from 'react-lines-ellipsis/lib/responsiveHOC'

// using this ResponsiveEllipsis will handle responsive changes to the lineEllipsis component.
const ResponsiveEllipsis = responsiveHOC()(LinesEllipsis)

const imageOnLoad = (el) => {
  if (!isServer()) {
    const imageElem = el.target
    imageElem.parentNode.classList.remove('loading')
    imageElem.parentNode.classList.add('loaded')
    imageElem.classList.remove('hidden')
  }
}
const imageOnError = (el) => {
  if (!isServer()) {
    const imageElem = el.target
    imageElem.parentNode.classList.remove('loading')
    imageElem.parentNode.classList.add('loaded')
    imageElem.src = require(`$assets/images/default.png`)
    imageElem.classList.remove('hidden')
  }
}

const ProductItem = (props) => {
  let {descriptionLines, productNameLines} = props

  productNameLines = productNameLines ? productNameLines : 2
  descriptionLines = descriptionLines ? descriptionLines : 4

  const {model, url, detailed, className} = props
  const imageUrl = (model && model.ImageUrl) ? model.ImageUrl : require(`$assets/images/default.png`)

  if (!model) {
    return null
  }

  const productNameAndCatalog = model.CatalogNumber && model.CatalogNumber.trim().length > 0 ? `${model.Name} / ${model.CatalogNumber}` : model.Name

  return (
    <Link to={url}>
      <a className={`product-item ${className ? className : ''}`}>
        <div className="image-wrapper loading">
          <img src={imageUrl} className='hidden' onLoad={imageOnLoad} onError={imageOnError} />
        </div>
        <div className="product-name" style={{maxHeight: `${productNameLines * 1.5}em`}}>
          <ResponsiveEllipsis text={productNameAndCatalog} maxLine={productNameLines} basedOn='words'/>
        </div>
        {
          (model.MinimumPrice) ?
            (
              <div>
                <div className="product-price">{t('ProductItem.From_Price')}&nbsp;
                  <Price model={model.MinimumPrice}/>
                </div>
                <div className="product-units">
                  <UnitsOfMeasure minQuantity={model.MinimumQuantity} model={model.Unit}/>
                </div>
              </div>
            ) : ''
        }
        <Inventory model={model.Inventory} minQuantity={model.MinimumQuantity}/>
        {
          detailed &&
          <div className="product-description" style={{maxHeight: `${descriptionLines * 1.5}em`}}>
            <ResponsiveEllipsis text={model.ShortDescription} maxLine={descriptionLines} basedOn='words'/>
          </div>
        }
      </a>
    </Link>
  )
}
export default ProductItem
