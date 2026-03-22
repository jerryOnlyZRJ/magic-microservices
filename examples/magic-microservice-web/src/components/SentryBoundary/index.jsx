import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Empty, Button } from '@byte-design/ui';
import { ForerunnerBlank } from '@byte-design/illustration';


const btnStyles = {
	textAlign: 'center',
	marginTop: 40,
};

export default class SentryBoundary extends Component {
	static propTypes = {
		children: PropTypes.any,
	}

	constructor(props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	handleReload = () => {
		location.reload();
	}

	handleBack = () => {
		location.replace(location.origin);
	}


	


	render() {
		if (this.state.hasError) {
			// render fallback UI
			return (
				<>
					<Empty
						icon={<ForerunnerBlank style={{ width: '200px' }} hue={[215]} />}
						content="抱歉，服务器这会儿不在状态。。。"
					/>
					<div style={btnStyles}>
						<Button onClick={this.handleBack}>返回首页</Button>
						<Button type="primary" style={{ marginLeft: 30 }} onClick={this.handleReload}>
							刷新页面
						</Button>
					</div>
				</>
			);
		} else {
			// when there's not an error, render children untouched
			return this.props.children;
		}
	}
}
