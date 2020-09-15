import React, { useContext } from 'react';
import { authContext } from '../../../context/auth-context';
import './help-menu.css';

export const HelpMenu = (props: { setHelpVisibility: (visible: boolean) => void }) => {
	const { signOut } = useContext(authContext);

	return (
		<ul className="help-menu" onMouseLeave={() => props.setHelpVisibility(false)}>
			{/* <li className="help-item user-guides">User Guides</li> */
			/* <li className="help-item feature-request">Feature Request</li>
			<li className="help-item bug-report">Bug Report</li> */}
			<li className="help-item sign-out" onClick={signOut}>
				Log Out
			</li>
		</ul>
	);
};
