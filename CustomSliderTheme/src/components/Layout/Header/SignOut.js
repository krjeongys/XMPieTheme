import './SignOut.scss'
import themeContext from '$ustoreinternal/services/themeContext'
import {deleteCookie} from '$ustoreinternal/services/utils'
import {t} from '$themelocalization'

/**
 * This component represents the signout icon in the header
 * When clicking - the store redirects to the login page
 *
 * @param {object} currentUser - the current user connected to the store
 */
const SignOut = (props) => {

  if(!props.currentUser) {
    return null
  }

  const {currentUser: {FirstName}} = props

  const {securityToken, storeID, classicUrl} = themeContext.get()
  const deleteCookies = () => ['_token', '_storeID' , '_language'].forEach(cn => deleteCookie(cn))
  
  return (
    <div className="signout">
      <div className="info">
        <div className="title">{t('Profile.My_Account')}</div>
        <div className="greeting truncate">{t('SignOut.Hello_Message', {FirstName})}</div>
      </div>
      <div className="btn-container d-flex align-items-center">
        <a onClick={ deleteCookies} href={`${classicUrl}/logout.aspx?SecurityToken=${securityToken}&StoreGuid=${storeID}`} className="button-secondary">{t('SignOut.SignOut')}</a>
      </div>
    </div>
  )
}
export default SignOut
