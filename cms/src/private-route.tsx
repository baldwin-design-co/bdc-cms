import React, { useContext } from 'react';
import { Redirect, Route, RouteComponentProps } from 'react-router-dom';
import { authContext } from './context/auth-context';

interface PrivateRouteProps {
	component: React.FC<RouteComponentProps<{ page: string }>>;
	path: string;
	exact?: boolean;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ component, path, exact }) => {
	const { user } = useContext(authContext);

	const redirect = () => <Redirect to="/sign-in" />;

	return user ? (
		<Route path={path} exact={!!exact} component={component} />
	) : (
		<Route path={path} exact={!!exact} component={redirect} />
	);
};
