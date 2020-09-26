import React, { useContext } from 'react';
import { authContext } from '../../../context/auth-context';
import { ClickAwayListener } from '@material-ui/core';
import { ExitToApp as LogoutIcon } from '@material-ui/icons';
import './help-menu.css';

interface HelpMenuProps {
	setHelpVisibility: (visible: boolean) => void;
}

export const HelpMenu: React.FC<HelpMenuProps> = ({ setHelpVisibility }) => {
	const { signOut } = useContext(authContext);

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
