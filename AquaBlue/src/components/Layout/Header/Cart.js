import Icon from '$core-components/Icon'
import './Cart.scss'
import urlGenerator from '$ustoreinternal/services/urlGenerator'
import {Link} from '$routes'

/**
 * This component represents the cart icon.
 * When clicking on it - the store redirects to the 'Cart' page
 */
const Cart = () => {
	return(
	  <div className="cart">
      <Link to={urlGenerator.get({page:'cart'})}>
        <a>
          <div className="cart-icon-container"><Icon name="cart.svg" className="cart-icon" width="23px" height="21px"/></div>
        </a>
      </Link>
    </div>
	)
}
export default Cart
