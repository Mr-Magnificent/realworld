/* eslint-disable no-console */
import React from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import qs from 'querystring';
import Cookies from 'js-cookie';
import { string } from 'prop-types';
import RandomString from 'randomstring';

import Online from './Online';
// import WebRTC from './WebRTC';

import { Button } from 'antd';
import { MessageBox } from 'react-chat-elements';
import { Picker } from 'emoji-mart';
import 'react-chat-elements/dist/main.css';
import 'emoji-mart/css/emoji-mart.css';

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
			text={props.message}
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
		chats: [],
		onlineUsers: [],
		emojiVisible: false,
		videoChat: false
	}

	searchbox = React.createRef();
	messageBox = React.createRef();

	_socket;

	async componentDidMount() {
		await this.connectSocket();
	}

	componentDidUpdate() {
		this.scrollDiv();
	}

	connectSocket = async () => {
		const token = Cookies.get('token');
		const HOST = location.origin;
		const socket = io(`${HOST}?${qs.stringify({ token })}`, { secure: true });

		socket.on('connect', () => {
			console.log(`Socket Connected: ${socket.connected}`);

			// socket events
			socket.on('message', (data) => {
				console.log('message', data);
				const box = chatMessage(data, true);
				this.setState({
					chats: [...this.state.chats, box]
				});
			});

			socket.on('online', (data) => {
				console.log('online', data);
				this.setState({
					onlineUsers: data
				});
			});
		});

		this._socket = socket;
	}

	// Add selected emoji to inputbox
	addEmoji = (emoji) => {
		console.log(this.searchbox.current.value);
		this.searchbox.current.value += emoji.native;
	}


	sendMessageEnter = (event) => {
		if (event.keyCode == 13 || event.which == 13) {
			this.sendMessage(event);
		}
		return true;
	}

	sendMessage = () => {
		const textInput = this.searchbox.current.value;
		if (textInput === '') {
			return false;
		}

		let socket = this._socket;
		console.log('socket', socket);
		socket.emit('message', textInput);

		let data = {
			name: 'me',
			message: textInput
		};

		const box = chatMessage(data, false);
		this.setState({
			chats: [...this.state.chats, box]
		});

		this.searchbox.current.value = '';
		return false;
	}

	ToggleEmojiPicker = () => {
		this.setState({
			emojiVisible: !this.state.emojiVisible
		});
	}

	ToggleVideo = () => {
		this.setState({
			videoChat: !this.state.videoChat
		});
	}

	scrollDiv = () => {
		this.messageBox.current.scrollTop = this.messageBox.current.scrollHeight;
	}

	render() {
		return (
			<div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
				{/* <div>
					{this.state.videoChat ? (<WebRTC />) : (<></>)}
				</div> */}
				<div style={{ display: 'flex', flexWrap: 'no-wrap' }}>
					<div style={{
						overflowY: 'scroll',
						height: '30em',
						flexBasis: '75%'
					}} ref={this.messageBox}
					>
						{this.state.chats}
					</div>
					<div style={{ flexBasis: '25%' }}>
						<Online online={this.state.onlineUsers} />
					</div>
				</div>
				<div style={{ display: 'flex', flexWrap: 'wrap' }}>
					<div style={{ width: '60%' }}>
						<input
							style={{ width: '100%' }}
							ref={this.searchbox}
							placeholder='Enter your message'
							onKeyUp={this.sendMessageEnter}
							autoFocus
						>
						</input>
					</div>
					&nbsp;
					<Button type="primary" icon="caret-right" onClick={this.sendMessage} style={{ width: '5%', minWidth: '50px' }} />
					&nbsp;
					<Button type="secondary" icon="smile" onClick={this.ToggleEmojiPicker} style={{ width: '5%', minWidth: '50px' }} />
					{/* &nbsp;
					<Button type="secondary" icon="video-camera" onClick={this.ToggleVideo} style={{ width: '5%', minWidth: '50px' }} /> */}
					<div>
						{this.state.emojiVisible ? (<Picker onSelect={this.addEmoji} />) : (<></>)}
					</div>

				</div>
			</div>
		);
	}
}

export default ChatConsole;
