import React from 'react';
import { PageHeader } from 'bdc-components';
import { SideBar } from './sidebar/sidebar';

export const Dashboard = () => {
	return (
		<section className="app">
			<SideBar />
			<div className="container">
				<PageHeader title="Dashboard" />
				<div className="dashboard-grid" />
			</div>
		</section>
	);
};
