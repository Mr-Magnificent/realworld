/* eslint-disable no-console */
import React from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import qs from 'querystring';
import Cookies from 'js-cookie';
import { string } from 'prop-types';
import RandomString from 'randomstring';
import 'react-chat-elements/dist/main.css';
import { MessageBox, SideBar } from 'react-chat-elements';

function chatBox(props, recv) {
	let alignProp = 'flex-end';
	let borderRadius = '30px 15px 5px 30px';
	let backgroundColour = '#a0cbfc';
	let textAlign = 'end';

	if (recv === true) {
		alignProp = 'flex-start';
		borderRadius = '15px 30px 30px 5px';
		backgroundColour = 'grey';
		textAlign = 'start';
	}

	return (
		<div style={{
			alignSelf: alignProp,
			backgroundColor: backgroundColour,
			minWidth: '500px',
			maxWidth: '700px',
			margin: '20px',
			borderRadius: borderRadius
		}}>
			<div style={{ padding: '15px 20px', textAlign }}>
				<span style={{
					fontWeight: '800',
					fontSize: '18px',
				}}>
					{props.name}
				</span>
			</div>
			<div style={{
				padding: '15px 20px',
				textAlign
			}}>
				{props.message}
			</div>
		</div>
	);
}

function chatMessage(props, recv) {
	// settings for my messages
	let position = 'right';


	// if the message is others
	if (recv == true) {
		position = 'left';
	}
	return (
		<MessageBox
			position={position}
			titleColor='red'
			title={props.name}
			data={RandomString.generate(10)}
			text={RandomString.generate(10)}
		/>
	);
}

chatMessage.propTypes = {
	name: string,
	message: string
};


class ChatConsole extends React.Component {
	state = {
		endpoint: '',
		chats: []
	}

	async componentDidMount() {
		try {
			const { data } = await axios.get('/ipaddr');
			console.log(data);

			this.setState({
				endpoint: data
			});
		} catch (err) {
			console.log(err);
		}
		for (let i = 0; i < 10; i++) {
			let datas = {
				chatId: i,
				name: RandomString.generate(10),
				message: 'this is a message'
			};

			let toggle = false;
			if (i % 2 == 0) {
				toggle = true;
			}
			const boxs = chatMessage(datas, toggle);
			console.log(boxs);
			this.setState({
				chats: [...this.state.chats, boxs]
			});
		}
		await this.connectSocket();
	}

	connectSocket = async () => {
		const token = Cookies.get('token');
		const socket = io(`http://${this.state.endpoint}?${qs.stringify({ token })}`, { secure: true });

		socket.on('connect', () => {
			console.log(`Socket Connected: ${socket.connected}`);

    		/**
             * TODO: send message
             * TODO: recv message
             * TODO: add sentiment
             */
			socket.emit();
			socket.on('chat', (data) => {
				const box = chatMessage(data, true);
				this.setState({
					chats: [...this.state.chats, box]
				});
			});
			socket.on();
		});
	}

	render() {
		return (
			<div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
				{/* <div style={{
					overflowX: 'scroll',
					display: 'flex',
					width: '100%',
					maxHeight: '33rem',
					flexDirection: 'column'
				}}>
					{chatArr}
				</div>
				<div>
					<div></div>
					<div></div>
				</div> */}
				{this.state.chats}
			</div>
		);
	}
}

export default ChatConsole;
