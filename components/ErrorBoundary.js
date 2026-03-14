"use client";

import React from "react";

export default class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	componentDidCatch(error, info) {
		if (typeof window === 'undefined') {
			// server-side: log minimal info
			// eslint-disable-next-line no-console
			console.error('ErrorBoundary caught (server):', error?.message || error, info);
		} else {
			// client-side: log full error
			// eslint-disable-next-line no-console
			console.error('ErrorBoundary caught:', error, info);
		}
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className="p-6">
					<p className="text-red-600">Something went wrong.</p>
				</div>
			);
		}
		return this.props.children;
	}
}

