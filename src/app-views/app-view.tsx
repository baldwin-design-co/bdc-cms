import React from 'react';
import { SideBar } from './sidebar/sidebar';

export const AppView: React.FC = ({ children }) => (
	<section className="app">
		<SideBar />
		<div className="container">{children}</div>
	</section>
);
