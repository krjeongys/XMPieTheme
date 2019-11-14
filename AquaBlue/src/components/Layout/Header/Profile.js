/**
 * @function Profile - Dropdown for profile settings and actions
 *
 * @param {object} currentUser - should contains at least FirstName
 * @param {object} [userOrdersSummary] - data regarding the rejected/pending orders of the user in an approval process of the store
 */

import React, {Component} from 'react'
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from 'reactstrap'
import SignOut from './SignOut'
import Icon from '$core-components/Icon'
import urlGenerator from '$ustoreinternal/services/urlGenerator'
import './Profile.scss'
import {Link} from '$routes'
import {t} from '$themelocalization'

class Profile extends Component {
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
    const {currentUser, userOrdersSummary} = this.props

    if (!currentUser){
      return null
    }

    const rejectedOrderCount = (userOrdersSummary) ? userOrdersSummary.RejectedOrderCount : null
    const pendingApprovalOrderCount = (userOrdersSummary) ? userOrdersSummary.PendingApprovalOrderCount : null

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
            <Icon name="user.svg" className="profile-icon" width="20px" height="20px" />
            {pendingApprovalOrderCount > 0 && <div className="notification-icon" ><Icon name="profile-notification.svg" className="profile-icon" width="20px" height="20px" /></div>}
          </div>
        </DropdownToggle>
        <DropdownMenu right>
          <SignOut currentUser={currentUser}/>
          <div className="dd-body">
            <Link to={urlGenerator.get({page:'order-history'})+ `?filter=0`}>
              <DropdownItem tag="a">{t('Profile.My_orders')}</DropdownItem>
            </Link>
            {userOrdersSummary && currentUser.Roles.Shopper &&
            <Link to={urlGenerator.get({page:'order-history'})+ `?filter=2`}>
              <DropdownItem tag="a">{t('Profile.Rejected_orders', {rejectedOrderCount})}</DropdownItem>
            </Link>
            }
            {userOrdersSummary && currentUser.Roles.Approver &&
            <Link to={urlGenerator.get({page:'order-approval-list'})}>
              <DropdownItem tag="a" className={(pendingApprovalOrderCount > 0) ? "bold" : ""}>{t('Profile.Orders_to_approve', {pendingApprovalOrderCount})}</DropdownItem>
            </Link>
            }
            <Link to={urlGenerator.get({page:'drafts'})}>
              <DropdownItem tag="a" className="drafts">{t('Profile.Draft_orders')}</DropdownItem>
            </Link>
            <Link to={urlGenerator.get({page:'my-recipient-lists'})}>
              <DropdownItem tag="a">{t('Profile.Recipient_lists')}</DropdownItem>
            </Link>
            <Link to={urlGenerator.get({page:'addresses'})}>
              <DropdownItem tag="a">{t('Profile.Addresses')}</DropdownItem>
            </Link>
            <Link to={urlGenerator.get({page:'personal-information'})}>
              <DropdownItem tag="a">{t('Profile.Personal_information')}</DropdownItem>
            </Link>
          </div>
        </DropdownMenu>
      </Dropdown>
    )
  }
}

export default Profile
