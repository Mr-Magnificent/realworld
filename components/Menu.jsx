import React from 'react';
import Cookies from 'js-cookie';
import { string } from 'prop-types';
import { Menu, Icon, Dropdown } from 'antd';

function menuOptions() {
	function logout() {
		Cookies.remove('token');
		this.forceUpdate();
	}

	return (
		<Menu>
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
			<div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
				<Dropdown overlay={menuOptions}>
					<a>
						{this.props.user} <Icon type="down" />
					</a>
				</Dropdown>
			</div>
		);
	}
}

AppMenu.propTypes = {
	user: string
};

export default AppMenu;
