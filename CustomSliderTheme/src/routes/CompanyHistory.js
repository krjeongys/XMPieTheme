import { Component } from "react";
import Layout from "../components/Layout";

class CompanyHistory extends Component {
	render() {
		return (
			<Layout {...this.props}>
				<div>
					<h3>Company History</h3>
					<p>
						Company build up
					</p>
					<p>
						Company Develop
					</p>
				</div>
			</Layout>
		)
	}
}

export default CompanyHistory;