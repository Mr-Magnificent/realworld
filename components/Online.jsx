import React from 'react';
import { Card, Icon } from 'antd';
import { string } from 'prop-types';

function OnlineList(props) {
	let cards = [];
	console.log(JSON.stringify(props.online));
	props.online.map((onlineUser) => {
		cards.push(
			<Card
				size='small'
				style={{ width: '95%', margin: '5px' }}
			>
				<p>{onlineUser.username}</p>
				{onlineUser.is_live ? (
					<div>
						<Icon type="video-camera" theme="twoTone" twoToneColor="#52c41a" />
						<span>User Live</span>
					</div>
				) : (<></>)}
			</Card>
		);
	});

	return (
		<div style={{ width: '100%', height: '30em', overflowY: 'scroll' }}>
			<h3>Online Users</h3>
			{cards}
		</div>
	);
}

OnlineList.propTypes = {
	online: string.isRequired
};

export default OnlineList;