import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { authContext } from '../context/auth-context';
import { SignUpCard } from './card/sign-up-card';

export const SignUp = () => {
	const { user } = useContext(authContext);
	if (user) return <Redirect to="/collections" />;
	return (
		<section className="sign-in">
			<SignUpCard />
		</section>
	);
};
