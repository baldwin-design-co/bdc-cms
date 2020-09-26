import { IconButton, Tooltip } from '@material-ui/core';
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { HelpMenu } from './help-menu/help-menu';
import {
	Menu as MenuIcon,
	LibraryBooksOutlined as FormsIcon,
	LayersOutlined as CollectionsIcon
} from '@material-ui/icons';
import './sidebar.css';

export const SideBar = () => {
	const [ helpVisible, setHelpVisibility ] = useState(false);

	return (
		<nav className="side-bar">
			{/* <NavLink className="navlink dashboard" exact to="/dashboard" /> */}

			<Tooltip
				title="Collections"
				placement="right"
				enterDelay={800}
				enterNextDelay={100}
				leaveDelay={100}
			>
				<NavLink className="navlink" to="/collections">
					<CollectionsIcon style={{ width: 36, height: 36 }} />
				</NavLink>
			</Tooltip>

			<Tooltip
				title="Forms"
				placement="right"
				enterDelay={800}
				enterNextDelay={100}
				leaveDelay={100}
			>
				<NavLink className="navlink" to="/forms">
					<FormsIcon style={{ width: 36, height: 36 }} />
				</NavLink>
			</Tooltip>

			{/* <NavLink className="navlink editors" to="/editors" /> */}
			<IconButton
				onClick={() => setHelpVisibility(!helpVisible)}
				style={{ position: 'absolute', bottom: 20, color: '#000' }}
			>
				<MenuIcon />
			</IconButton>
			{helpVisible ? <HelpMenu setHelpVisibility={setHelpVisibility} /> : null}
		</nav>
	);
};
