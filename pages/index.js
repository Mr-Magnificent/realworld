import React from 'react';
import { Layout } from 'antd';
import axios from 'axios';

import Menu from '../components/Menu';
import ChatConsole from '../components/ChatConsole';
import { hidden } from 'ansi-colors';

const { Header, Content } = Layout;



export default class Index extends React.Component {

	state = {
		user: undefined
	}

	fetchUserDetails = async () => {
		let data;
		try {
			data = await axios.get('/me');
			this.setState({
				user: data.data.username
			});
		} catch(err) {
			console.log(err.message);
		}

		console.log(this.state.user);
	}

	async componentDidMount() {
		await this.fetchUserDetails();
	}

	render() {
		return (
			<Layout style={{height: '100%'}}>
				<Header>
					<Menu user={this.state.user} />
				</Header>
				<Content style={{padding: '50px', height: '100%'}}>
					<ChatConsole />
				</Content>
			</Layout>
		);
	}
}
