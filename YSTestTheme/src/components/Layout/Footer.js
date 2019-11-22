import './Footer.scss'

/**
 * This component represents the footer in the store
 */
const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-bar">
        <span>회사소개</span><span className='gnb_bar'></span>
        <span>고객센터</span><span className='gnb_bar'></span>
        <span>이용약관</span><span className='gnb_bar'></span>
        <span>개인정보처리방침</span>
      </div>
      <div className="footer-divider"></div>
      <div className="footer-info-wrap">

      </div>
    </div>
  )
}

export default Footer
