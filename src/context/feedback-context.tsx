import React, { createContext, useState } from 'react';

type Severity = 'error' | 'warning' | 'info' | 'success';

interface FeedbackState {
	open: boolean;
	message?: string;
	severity?: Severity;
	setFeedback: (open: boolean, message?: string, severity?: Severity) => void;
}

const defaultFeedbackState: FeedbackState = { open: false, setFeedback: () => {} };

export const feedbackContext = createContext(defaultFeedbackState);

export const FeedbackProvider: React.FC = ({ children }) => {
	const [ feedbackState, setFeedbackState ] = useState(defaultFeedbackState);

	const setFeedback = (open: boolean, message?: string, severity?: Severity) => {
		setFeedbackState({ ...feedbackState, open, message, severity });
	};

	return (
		<feedbackContext.Provider value={{ ...feedbackState, setFeedback }}>
			{children}
		</feedbackContext.Provider>
	);
};
