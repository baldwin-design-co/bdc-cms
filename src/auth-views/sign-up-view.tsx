import { TextField, useTheme } from '@material-ui/core';
import { Button } from 'bdc-components';
import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { authContext } from '../context/auth-context';

export const SignUpView = () => {
	const { user, signUp: addUser, signIn } = useContext(authContext);
	const [ credentials, setCredentials ] = useState({ email: '', password: '' });
	const [ error, setError ] = useState('');
	const theme = useTheme();

	const signUp = async (credentials: { email: string; password: string }) => {
		try {
			setError('');
			await addUser(credentials);
			await signIn(credentials);
		} catch (error) {
			setError(error.message);
		}
	};

	if (user) return <Redirect to="/collections" />;

	return (
		<section className="sign-in">
			<div className="sign-in-card">
				<h2>Sign Up</h2>

				<TextField
					label="Email"
					size="small"
					fullWidth={true}
					variant="outlined"
					style={{ margin: '16px 0 16px' }}
					onChange={e => {
						setCredentials({ ...credentials, email: e.target.value });
					}}
				/>

				<TextField
					label="Password"
					size="small"
					type="password"
					fullWidth={true}
					variant="outlined"
					style={{ margin: '0 0 16px' }}
					onChange={e => {
						setCredentials({ ...credentials, password: e.target.value });
					}}
				/>

				<Button action={() => signUp(credentials)}>Sign Up</Button>
			</div>

			{error ? (
				<span className="error-message" style={{ color: theme.palette.error.main }}>
					{error}
				</span>
			) : null}
		</section>
	);
};
