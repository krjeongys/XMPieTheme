/**
 * @function Company - Dropdown for company
 *
 * @param {object} currentUser - should contains at least FirstName
 * @param {object} [userOrdersSummary] - data regarding the rejected/pending orders of the user in an approval process of the store
 */

import React, {Component} from 'react'
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from 'reactstrap'
import urlGenerator from '$ustoreinternal/services/urlGenerator'
import './Profile.scss'
import {Link} from '$routes'
import {t} from '$themelocalization'
import Icon from '$core-components/Icon'

class Company extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isDropdownOpen: false
    };
  }

  toggle() {
    this.setState(prevState => ({
      isDropdownOpen: !prevState.isDropdownOpen
    }));
  }

  render() {

    return (
      <Dropdown
        isOpen={this.state.isDropdownOpen}
        toggle={this.toggle}
        className="profile"
      >
        <DropdownToggle
          tag='div'
          data-toggle='dropdown'
        >
          {/*<i className="fas fa-user fa-lg"></i>*/}
          <div className="profile-icon-container">
            <span>고객센터</span>{/* <Icon name="company.svg" width="20px" height="20px" className="profile-icon" /> */}
          </div>
        </DropdownToggle>
        <DropdownMenu right>
          <div className="dd-body">
		  	<Link to={urlGenerator.get({page:'notice-item-list'})}>
              <DropdownItem tag="a" style={ { display : 'none' } }>{t('notice-item-list')}</DropdownItem>
            </Link>
            <Link to={urlGenerator.get({page:'CompanyProfile'})}>
              <DropdownItem tag="a">{t('company-profile')}</DropdownItem>
            </Link>
			<Link to={urlGenerator.get({page:'CompanyHistory'})}>
              <DropdownItem tag="a">{t('company-history')}</DropdownItem>
            </Link>
			<Link to={urlGenerator.get({page:'product-enquiry-board'})}>
              <DropdownItem tag="a">{t('product-enquiry-board')}</DropdownItem>
            </Link>
          </div>
        </DropdownMenu>
      </Dropdown>
    )
  }
}

export default Company
