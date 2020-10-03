import React, { useContext, useState } from 'react';
import { authContext } from '../../context/auth-context';
import { Button } from 'bdc-components';
import { TextField, useTheme } from '@material-ui/core';
import './card.css';

export const SignInCard = () => {
	const { signIn: authenticate } = useContext(authContext);
	const [ credentials, setCredentials ] = useState({ email: '', password: '' });
	const [ error, setError ] = useState('');
	const theme = useTheme()

	const signIn = async (credentials: { email: string; password: string }) => {
		try {
			await authenticate(credentials);
		} catch (error) {
			setError(error.message);
		}
	};

	return (
		<>
			<div className="sign-in-card">
				<h2>Sign In</h2>

				<TextField
					label='Email'
					size='small'
					fullWidth={true}
					variant='outlined'
					style={{ margin: '16px 0 16px' }}
					onChange={e => {
						setCredentials({ ...credentials, email: e.target.value })
					}}
				/>

				<TextField
					label='Password'
					size='small'
					fullWidth={true}
					variant='outlined'
					style={{ margin: '0 0 16px' }}
					onChange={e => {
						setCredentials({ ...credentials, password: e.target.value })
					}}
				/>

				<Button action={() => signIn(credentials)}>Sign In</Button>
			</div>

			{error ? <span className="error-message" style={{ color: theme.palette.error.main }}>{error}</span> : null}
		</>
	);
};
