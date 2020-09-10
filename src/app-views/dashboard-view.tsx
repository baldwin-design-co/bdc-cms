import React from 'react';
import { Header } from './header/header';
import { SideBar } from './sidebar/sidebar';

export const Dashboard = () => {
	return (
		<section className="app">
			<SideBar />
			<div className="container">
				<Header title="Dashboard" />
				<div className="dashboard-grid" />
			</div>
		</section>
	);
};
