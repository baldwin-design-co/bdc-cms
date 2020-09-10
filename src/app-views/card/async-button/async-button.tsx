import React, { useState } from 'react';
import './async-button.css';

interface AsyncButtonProps {
	name: string;
	subAction?: boolean;
	action: () => Promise<void> | void;
	errorAction: (errorMessage: string) => void;
}

export const AsyncButton: React.FC<AsyncButtonProps> = ({ name, subAction, action, errorAction }) => {
	const [ loading, setLoadingState ] = useState(false);

	const buttonContent = loading ? <div className="button-loader" /> : subAction ? null : name;
	const buttonClass = subAction && loading ? 'card-sub' : subAction ? `card-sub ${name}` : 'card-action';

	return (
		<button
			className={buttonClass}
			onClick={async () => {
				try {
					setLoadingState(true);
					await action();
				} catch (error) {
					setLoadingState(false);
					errorAction(error.message);
				}
			}}
		>
			{buttonContent}
		</button>
	);
};
