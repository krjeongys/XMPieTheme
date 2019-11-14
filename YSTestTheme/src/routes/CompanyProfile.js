import { Component } from "react";
import Layout from "../components/Layout";

class CompanyProfile extends Component {
	render() {
		return (
			<Layout {...this.props}>
				<div>
					<h3>Company Name</h3>
					<div>
						Company Discription
					</div>
				</div>
			</Layout>
		)
	}
}

export default CompanyProfile;