import React, { useContext } from 'react';
import { Redirect, Route, RouteComponentProps } from 'react-router-dom';
import { authContext } from './context/auth-context';

export const PrivateRoute: React.FC<{
	component: React.FC<RouteComponentProps<{ page: string }>>;
	path: string;
	exact?: boolean;
}> = props => {
	const { user } = useContext(authContext);
	const redirect = () => <Redirect to="/sign-in" />;

	return user ? (
		<Route path={props.path} exact={!!props.exact} component={props.component} />
	) : (
		<Route path={props.path} exact={!!props.exact} component={redirect} />
	);
};
