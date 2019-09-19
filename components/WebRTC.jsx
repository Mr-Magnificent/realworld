/* eslint-disable no-console */
import React from 'react';
import 'http://cdn.temasys.io/adapterjs/0.15.x/adapter.min.js';

class WebRTC extends React.Component {
	remoteVideo = React.createRef();

	localStream;
	pc1;
	pc2;

	offerOptions = {
		offerToReceiveAudio: 1,
		offerToReceiveVideo: 1
	}

	gotStream = (stream) => {
		this.remoteVideo.srcObject = stream;
		this.localStream = stream;
	}

	getName = (pc) => {
		return (pc === this.pc1) ? 'pc1' : 'pc2';
	}

	componentDidMount() {
		this.start();
	}

	start = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				audio: true,
				video: true
			});

			this.gotStream(stream);
		} catch (err) {
			console.log('getUserMedia() error', err.name);
		}
	}

	call = () => {
		let videoTrack = this.localStream.getVideoTrack();
		let audioTrack = this.localStream.getAudioTrack();

		let servers = null;

		this.pc1 = new RTCPeerConnection(servers);
		this.pc1.onicecandidate = function (e) {
			this.onIceCandidate(this.pc1, e);
		};

		this.pc2 = new RTCPeerConnection(servers);
		this.pc2.onicecandidate = function (e) {
			this.onIceCandidate(this.pc2, e);
		};

		this.pc1.oniceconnectionstatechange = function (e) {
			this.onIceStateChange(this.pc1, e);
		};
		this.pc2.oniceconnectionstatechange = function (e) {
			this.onIceStateChange(this.pc2, e);
		};
		this.pc2.onaddstream = this.gotRemoteStream;

		this.pc1.addStream(this.localStream);

		this.pc1.createOffer(
			this.offerOptions
		).then(
			this.onCreateOfferSuccess,
			this.onCreateSessionDescriptionError
		);

	}


	onCreateSessionDescriptionError = (error) => {
		console.log('Failed to create session description: ' + error.toString());
	}

	onCreateOfferSuccess = (desc) => {
		this.pc1.setLocalDescription(desc).then(
			function () {
				this.onSetLocalSuccess(this.pc1);
			},
			this.onSetSessionDescriptionError
		);
		console.log('pc2 setRemoteDescription start');
		this.pc2.setRemoteDescription(desc).then(
			function () {
				this.onSetRemoteSuccess(this.pc2);
			},
			this.onSetSessionDescriptionError
		);
		console.log('pc2 createAnswer start');
		// Since the 'remote' side has no media stream we need
		// to pass in the right constraints in order for it to
		// accept the incoming offer of audio and video.
		this.pc2.createAnswer().then(
			this.onCreateAnswerSuccess,
			this.onCreateSessionDescriptionError
		);
	}

	onSetLocalSuccess = (pc) => {
		console.log(this.getName(pc) + ' setLocalDescription complete');
	}

	onSetRemoteSuccess = (pc) => {
		console.log(this.getName(pc) + ' setRemoteDescription complete');
	}

	onCreateAnswerSuccess(desc) {
		console.log('Answer from pc2:\n' + desc.sdp);
		console.log('pc2 setLocalDescription start');
		this.pc2.setLocalDescription(desc).then(
			function () {
				this.onSetLocalSuccess(this.pc2);
			},
			this.onSetSessionDescriptionError
		);
		console.log('pc1 setRemoteDescription start');
		this.pc1.setRemoteDescription(desc).then(
			function () {
				this.onSetRemoteSuccess(this.pc1);
			},
			this.onSetSessionDescriptionError
		);
	}

	onSetSessionDescriptionError = (error) => {
		console.log('Failed to set session description: ' + error.toString());
	}

	onSetLocalSuccess = (pc) => {
		console.log(this.getName(pc) + ' setLocalDescription complete');
	}

	onSetRemoteSuccess = (pc) => {
		console.log(this.getName(pc) + ' setRemoteDescription complete');
	}


	gotRemoteStream = (e) => {
		this.remoteVideo.srcObject = e.stream;
	}

	onCreateAnswerSuccess = (desc) => {
		console.log('Answer from pc2:\n' + desc.sdp);
		console.log('pc2 setLocalDescription start');
		this.pc2.setLocalDescription(desc).then(
			function () {
				this.onSetLocalSuccess(this.pc2);
			},
			this.onSetSessionDescriptionError
		);
		console.log('pc1 setRemoteDescription start');
		this.pc1.setRemoteDescription(desc).then(
			function () {
				this.onSetRemoteSuccess(this.pc1);
			},
			this.onSetSessionDescriptionError
		);
	}

	getOtherPc = (pc) => {
		return (pc === this.pc1) ? this.pc2 : this.pc1;
	}

	onIceCandidate = (pc, event) => {
		this.getOtherPc(pc).addIceCandidate(event.candidate)
			.then(
				function () {
					this.onAddIceCandidateSuccess(pc);
				},
				function (err) {
					this.onAddIceCandidateError(pc, err);
				}
			);
	}

	onAddIceCandidateSuccess = (pc) => {
		console.log(this.getName(pc) + ' addIceCandidate success');
	}

	onAddIceCandidateError = (pc, error) => {
		console.log(this.getName(pc) + ' failed to add ICE Candidate: ' + error.toString());
	}

	onIceStateChange = (pc, event) => {
		if (pc) {
			console.log(this.getName(pc) + ' ICE state: ' + pc.iceConnectionState);
			console.log('ICE state change event: ', event);
		}
	}


	hangup = () => {
		console.log('Ending call');
		this.pc1.close();
		this.pc2.close();
		this.pc1 = null;
		this.pc2 = null;
	}

	render() {
		return (
			<div>
				<video ref={this.remoteVideo} autoPlay playsInline></video>
			</div>
		);
	}
}

WebRTC.propTypes = {

};

export default WebRTC;
