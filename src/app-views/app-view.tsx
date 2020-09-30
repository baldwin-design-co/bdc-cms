import React, { useContext } from 'react';
import { SideBar } from './sidebar/sidebar';
import { feedbackContext } from '../context/feedback-context';
import './app-views.css';
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

export const AppView: React.FC = ({ children }) => {
	const { open, message, severity, setFeedback } = useContext(feedbackContext);

	return (
		<section className="app">
			<SideBar />
			<div className="container">{children}</div>

			<Snackbar open={open} autoHideDuration={6000} onClose={() => setFeedback(false)}>
				<Alert
					onClose={() => setFeedback(false)}
					severity={severity}
					elevation={4}
					variant="filled"
				>
					{message}
				</Alert>
			</Snackbar>
		</section>
	);
};
