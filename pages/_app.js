import React from 'react';
import App from 'next/app';
import 'antd/dist/antd.css';
import axios from 'axios';

axios.defaults.baseURL = '/api/';

class Layout extends React.Component {
	render () {
		const { children } = this.props;
		return <div className='layout'>{children}</div>;
	}
}
  
export default class MyApp extends App {
	render () {
		const { Component, pageProps } = this.props;
		return (
			<Layout>
				<Component {...pageProps} />
			</Layout>
		);
	}
}  
