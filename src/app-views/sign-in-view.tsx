import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { authContext } from '../context/auth-context';
import { SignInCard } from './card/sign-in-card';

export const SignIn = () => {
	const { user } = useContext(authContext);
	if (user) return <Redirect to="/collections" />;
	return (
		<section className="sign-in">
			<SignInCard />
		</section>
	);
};
