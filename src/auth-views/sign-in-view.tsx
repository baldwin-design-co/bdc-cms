import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { authContext } from '../context/auth-context';
import { SignInCard } from './card/sign-in-card';
import './sign-in-view.css';

export const SignInView = () => {
	const { user } = useContext(authContext);

	if (user) return <Redirect to={`${process.env.PUBLIC_URL}/collections`} />;

	return (
		<section className="sign-in">
			<SignInCard />
		</section>
	);
};
