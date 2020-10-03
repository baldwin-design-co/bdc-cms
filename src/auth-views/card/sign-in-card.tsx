import React, { useState } from 'react';
import { Button } from 'bdc-components';
import './card.css';
import { useAuth } from 'reactfire';

export const SignInCard = () => {
	const [ credentials, setCredentials ] = useState({ email: '', password: '' });
	const [ error, setError ] = useState('');

	const auth = useAuth();

	const signIn = async (credentials: { email: string; password: string }) => {
		try {
			const { email, password } = credentials;
			await auth.signInWithEmailAndPassword(email, password);
		} catch (error) {
			setError(error.message);
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
