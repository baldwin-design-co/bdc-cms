import React from 'react';
import { ClickAwayListener } from '@material-ui/core';
import { ExitToApp as LogoutIcon } from '@material-ui/icons';
import { useAuth } from 'reactfire';
import './help-menu.css';

interface HelpMenuProps {
	setHelpVisibility: (visible: boolean) => void;
}

export const HelpMenu: React.FC<HelpMenuProps> = ({ setHelpVisibility }) => {
	const signOut = useAuth().signOut;

	return (
		<ClickAwayListener onClickAway={() => setHelpVisibility(false)}>
			<ul className="help-menu">
				<li className="help-item sign-out" onClick={signOut}>
					<LogoutIcon style={{ marginRight: 16 }} />
					Log Out
				</li>
			</ul>
		</ClickAwayListener>
	);
};
