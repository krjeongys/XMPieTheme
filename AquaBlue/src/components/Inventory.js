/**
 * A component to display inventory information of a product
 *
 * @param {object} model - ProductInventoryModel containing data regarding inventory of the product
 * @param {number} minQuantity - the minimum quantity of units that can be ordered from the product
 */

import {t} from '$themelocalization'
import './Inventory.scss'

const Inventory = (props) => {
  const {model, minQuantity} = props

  return (
    <span className="inventory">
      {
        (model && model.Quantity < minQuantity) ?
          (
            model.AllowOutOfStockPurchase ?
              <div className='warning'>{t('Inventory.Out_of_stock_Delivery_delayed')}</div>
              :
              <div className='error'>{t('Inventory.Out_of_stock')}</div>
          ) : null
      }
    </span>
  )
}

export default Inventory
