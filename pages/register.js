import React from 'react';
import {
	Form,
	Input,
	Tooltip,
	Icon,
	Button,
	Typography
} from 'antd';
import Router from 'next/router';

const Title = Typography.Title;

class RegistrationForm extends React.Component {
	state = {
		confirmDirty: false,
		autoCompleteResult: [],
		validUsername: undefined
	};

	handleSubmit = e => {
		e.preventDefault();
		this.props.form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				console.log('Received values of form: ', values);
			}
		});
	};

	handleConfirmBlur = e => {
		const { value } = e.target;
		this.setState({ confirmDirty: this.state.confirmDirty || !!value });
	};

	compareToFirstPassword = (rule, value, callback) => {
		const { form } = this.props;
		if (value && value !== form.getFieldValue('password')) {
			callback('Two passwords that you enter is inconsistent!');
		} else {
			callback();
		}
	};

	validateToNextPassword = (rule, value, callback) => {
		const { form } = this.props;
		if (value && this.state.confirmDirty) {
			form.validateFields(['confirm'], { force: true });
		}
		callback();
	};

	showFeedback = () => {
		if (this.state.validUsername === undefined) {
			return '';
		}
		else if (this.state.validUsername === true) {
			return 'success';
		}
		return 'error';
	}

	render() {
		const { getFieldDecorator } = this.props.form;

		const formItemLayout = {
			labelCol: {
				xs: { span: 24 },
				sm: { span: 6 },
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 11 },
			},
		};
		const tailFormItemLayout = {
			wrapperCol: {
				xs: {
					span: 24,
					offset: 0,
				},
				sm: {
					span: 24,
					offset: 10,
				},
			},
		};

		return (
			<div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', width: '100%', marginTop: '2%' }}>
				<Title>Chat App Demo</Title>
				<Form {...formItemLayout} style={{ width: '60%' }} onSubmit={this.handleSubmit}>
					<Form.Item label="Name">
						{getFieldDecorator('name')(<Input />)}
					</Form.Item>
					<Form.Item label="E-mail">
						{getFieldDecorator('email', {
							rules: [
								{
									type: 'email',
									message: 'The input is not valid E-mail!',
								},
								{
									required: true,
									message: 'Please input your E-mail!',
								},
							],
						})(<Input />)}
					</Form.Item>
					<Form.Item label="Password" hasFeedback>
						{getFieldDecorator('password', {
							rules: [
								{
									required: true,
									message: 'Please input your password!',
								},
								{
									validator: this.validateToNextPassword,
								},
							],
						})(<Input.Password />)}
					</Form.Item>
					<Form.Item label="Confirm Password" hasFeedback>
						{getFieldDecorator('confirm', {
							rules: [
								{
									required: true,
									message: 'Please confirm your password!',
								},
								{
									validator: this.compareToFirstPassword,
								},
							],
						})(<Input.Password onBlur={this.handleConfirmBlur} />)}
					</Form.Item>
					<Form.Item
						label={
							<span>
								Username&nbsp;
								<Tooltip title="What do you want others to call you?">
									<Icon type="question-circle-o" />
								</Tooltip>
							</span>
						}
						hasFeedback={true}
						validateStatus={this.showFeedback()}
					>
						{getFieldDecorator('username', {
							rules: [{ required: true, message: 'Please choose unique username!', whitespace: true }],
						})(<Input />)}
					</Form.Item>
					<Form.Item {...tailFormItemLayout}>
						<Button type="primary" htmlType="submit">
							Register
						</Button>
					</Form.Item>
				</Form>
			</div>
		);
	}
}

const WrappedRegistrationForm = Form.create({ name: 'register' })(RegistrationForm);
export default WrappedRegistrationForm;
