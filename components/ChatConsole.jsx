/* eslint-disable no-console */
import React from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import qs from 'querystring';
import Cookies from 'js-cookie';
import { string } from 'prop-types';

import RandomString from 'randomstring';
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
		onlineUsers: []
	}

	searchbox = React.createRef();
	messageBox = React.createRef();

	_socket;

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
			socket.on('message', (data) => {
				console.log('message', data);
				const box = chatMessage(data, true);
				this.setState({
					chats: [...this.state.chats, box]
				});
			});

			socket.on('sentiment', (data) => {
				console.log(data);
			});

			socket.on('online', (data) => {
				console.log(data);
			});
		});

		this._socket = socket;
	}

	addEmoji = (emoji) => {
		console.log(emoji);
		console.log(this.searchbox.current.value);
		this.searchbox.current.value += emoji.native;
	}

	componentDidUpdate() {
		this.scrollDiv();
	}

	sendMessage = (event) => {
		if (event.keyCode == 13 || event.which == 13) {

			const textInput = this.searchbox.current.value;

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
		return true;
	}

	scrollDiv = () => {
		this.messageBox.current.scrollTop = this.messageBox.current.scrollHeight;
	}

	render() {
		return (
			<div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
				<div style={{
					overflowY: 'scroll',
					height: '30em'
				}} ref={this.messageBox}
				>
					{this.state.chats}
				</div>
				<div>
					<div>
						<input ref={this.searchbox} onKeyUp={this.sendMessage} autoFocus></input>
					</div>
					<div style={{ zIndex: 1 }}><Picker onSelect={this.addEmoji} /></div>
				</div>
			</div>
		);
	}
}

export default ChatConsole;
