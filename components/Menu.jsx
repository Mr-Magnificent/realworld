import React from 'react';
import { Menu, Icon, Dropdown } from 'antd';
import Cookies from 'js-cookie';
import { string } from 'prop-types';

function menuOptions() {
	function logout() {
		Cookies.remove('token');
	}
	return (
		<Menu style={{display: 'flex', flexDirection: 'row-reverse'}}>
			<Menu.Item>
				<div onClick={logout}>Logout <Icon type="logout" /></div>
			</Menu.Item>
		</Menu>
	);
}

class AppMenu extends React.Component {
	handleClick = e => {
		this.setState({
			current: e.key,
		});
	};

	render() {
		return (
			<React.Fragment>
				<Dropdown overlay={menuOptions}>
					<a>
						{this.props.user} <Icon type="down" />
					</a>
				</Dropdown>
			</React.Fragment>
		);
	}
}

AppMenu.propTypes = {
	user: string
};

export default AppMenu;
