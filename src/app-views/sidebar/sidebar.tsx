import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { HelpMenu } from './help-menu/help-menu';
import './sidebar.css';

export const SideBar = () => {
	const [ helpVisible, setHelpVisibility ] = useState(false);

	return (
		<nav className="side-bar">
			{/* <NavLink className="navlink dashboard" exact to="/dashboard" /> */}
			<NavLink className="navlink collections" to="/collections" />
			<NavLink className="navlink forms" to="/forms" />
			<NavLink className="navlink editors" to="/editors" />
			<div className="help" onClick={() => setHelpVisibility(!helpVisible)} />
			{helpVisible ? <HelpMenu setHelpVisibility={setHelpVisibility} /> : null}
		</nav>
	);
};
