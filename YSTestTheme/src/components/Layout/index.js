import React from 'react'
import Header from './Header'
import Footer from './Footer'
import './Layout.scss'

/**
 * The main page wrapper - contains the Header and Footer and gets children as the main content
 *
 * @param {object} state - state of store
 * @param {component} children - React components to be presented between header and footer
 * @param {string} [className] - class name to append to the container div
 */
const Layout = ({state, children, className}) => {
	return (
		<div>
			<div className={`layout ${className ? className : ''}`}>
        <Header {...state} />
				<div className="main-content">
					{children}
				</div>
        <Footer />
			</div>
		</div>
	)
}

export default Layout
