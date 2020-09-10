import React, { useContext, useState } from 'react';
import { authContext } from '../../context/auth-context';
import './card.css';

export const SignUpCard = () => {
	const { signUp, signIn } = useContext(authContext);
	const [ credentials, setCredentials ] = useState({ email: '', password: '' });
	const [ error, setError ] = useState('');
	const [ loading, setLoading ] = useState(false);

	const buttonContent = loading ? <div className="button-loader" /> : 'Sign Up';
	const errorMessage = error ? <span className="error-message">{error}</span> : null;

	const action = async () => {
		try {
			setLoading(true);
			await signUp(credentials);
			await signIn(credentials);
		} catch (error) {
			setLoading(false);
			setError(error.message);
			console.error(error);
		}
	};

	return (
		<div className="sign-in-card">
			<h2>Sign Up</h2>

			<b>Email</b>
			<input type="text" onChange={e => setCredentials({ ...credentials, email: e.target.value })} />
			<b>Choose Password</b>
			<input type="password" onChange={e => setCredentials({ ...credentials, password: e.target.value })} />

			<button className="card-sign-in-action" onClick={action}>
				{buttonContent}
			</button>

			{errorMessage}
		</div>
	);
};
