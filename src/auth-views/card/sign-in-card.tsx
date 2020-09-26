import React, { useContext, useState } from 'react';
import { authContext } from '../../context/auth-context';
import { AsyncButton } from './async-button/async-button';

export const SignInCard = () => {
	const { signIn } = useContext(authContext);
	const [ credentials, setCredentials ] = useState({ email: '', password: '' });
	const [ error, setError ] = useState('');

	return (
		<div className="sign-in-card">
			<h2>Sign In</h2>

			<b>Email</b>
			<input type="text" onChange={e => setCredentials({ ...credentials, email: e.target.value })} />
			<b>Password</b>
			<input type="password" onChange={e => setCredentials({ ...credentials, password: e.target.value })} />

			<AsyncButton name="Sign In" action={() => signIn(credentials)} errorAction={setError} />

			{error ? <span className="error-message">{error}</span> : null}
		</div>
	);
};
