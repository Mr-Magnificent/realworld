/* eslint-disable no-console */
import React from 'react';
import { Layout, message, Spin } from 'antd';
import axios from 'axios';
import Cookies from 'js-cookie';

import Menu from '../components/Menu';
import ChatConsole from '../components/ChatConsole';
import Router from 'next/router';

const { Header, Content } = Layout;


export default class Index extends React.Component {
	state = {
		user: undefined,
		isLoading: true
	}

	checkLogin = () => {
		let token = Cookies.get('token');
		console.log(token);
		if (!token) {
			Router.push('/login');
			return;
		}

		if (this.state.isLoading) {
			this.setState({
				isLoading: false
			});
		}
	}

	async componentDidMount() {
		this.checkLogin();
		await this.fetchUserDetails();
	}

	fetchUserDetails = async () => {
		try {
			const { data } = await axios.get('/me');
			this.setState({
				user: data.username
			});
		} catch (err) {
			message.error('Something went wrong');
		}
	}

	render() {
		if (this.state.isLoading) {
			return (
				<div style={{ display: 'flex', justifyContent: 'center'}}>
					<Spin />
				</div>
			);
		}
		return (
			<Layout style={{ height: '100%' }}>
				<Header>
					<Menu user={this.state.user} />
				</Header>
				<Content style={{ padding: '50px', height: '100%' }}>
					<ChatConsole />
				</Content>
			</Layout>
		);
	}
}
