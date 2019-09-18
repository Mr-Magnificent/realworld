/* eslint-disable no-console */
import React from 'react';
import { Form, Icon, Input, Button, Typography, message } from 'antd';
import Link from 'next/link';
import axios from 'axios';
import Cookies from 'js-cookie';

import Router from 'next/router';

const { Title } = Typography;

class Login extends React.Component {
	handleSubmit = e => {
		e.preventDefault();
		this.props.form.validateFields(async (err, values) => {
			if (!err) {
				let alert;
				try {
					alert = message.loading('Sign in');
					const { data } = await axios.post('/login', {
						email: values.email,
						password: values.password
					});
					Cookies.set('token', data.token);
					alert.then(() => message.success('Successfully Signed in'));
					Router.push('/');
					
				} catch (err) {
					alert.then(() => message.error('Something went wrong'));
					console.log(err);
				}
			}
		});
	};

	render() {
		const { getFieldDecorator } = this.props.form;
		return (
			<div style={{ display: 'inline-flex', alignItems: 'center', width: '100%', flexDirection: 'column', marginTop: '2%' }}>
				<Title>Chat App Demo</Title>
				<Form onSubmit={this.handleSubmit} style={{ minWidth: '300px', maxWidth: '400px' }}>
					<Form.Item>
						{getFieldDecorator('email', {
							rules: [{ required: true, message: 'Please input your email!' }],
						})(
							<Input
								prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
								placeholder="Email"
							/>,
						)}
					</Form.Item>
					<Form.Item>
						{getFieldDecorator('password', {
							rules: [{ required: true, message: 'Please input your Password!' }],
						})(
							<Input
								prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
								type="password"
								placeholder="Password"
							/>,
						)}
					</Form.Item>
					<Form.Item>
						<div style={{ display: 'inline-flex', justifyContent: 'space-between', width: '100%' }}>
							<Button type="primary" htmlType="submit" style={{ width: '30%' }}>
								Log in
							</Button>
							<span>Or <Link href='/register'><a title='register'>register now!</a></Link></span>
						</div>
					</Form.Item>
				</Form>
			</div>
		);
	}
}

const LoginForm = Form.create()(Login);
export default LoginForm;
