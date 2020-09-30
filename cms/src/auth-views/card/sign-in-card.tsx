import React, { useContext, useState } from 'react';
import { authContext } from '../../context/auth-context';
import { Button } from 'bdc-components';
import './card.css';

export const SignInCard = () => {
	const { signIn: authenticate } = useContext(authContext);
	const [ credentials, setCredentials ] = useState({ email: '', password: '' });
	const [ error, setError ] = useState('');

	const signIn = async (credentials: { email: string; password: string }) => {
		try {
			await authenticate(credentials);
		} catch (error) {
			setError(error);
		}
	};

	return (
		<div className="sign-in-card">
			<h2>Sign In</h2>

			<b>Email</b>
			<input
				type="text"
				onChange={e => setCredentials({ ...credentials, email: e.target.value })}
			/>
			<b>Password</b>
			<input
				type="password"
				onChange={e => setCredentials({ ...credentials, password: e.target.value })}
			/>

			<Button action={() => signIn(credentials)}>Sign In</Button>

			{error ? <span className="error-message">{error}</span> : null}
		</div>
	);
};
