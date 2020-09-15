import { bdcTheme, ThemeProvider } from 'bdc-components';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import { Collection } from './app-views/collection-view';
import { Collections } from './app-views/collections-view';
import { Editors } from './app-views/editors-view';
import { Form } from './app-views/form-view';
import { Forms } from './app-views/forms-view';
import { SignIn } from './app-views/sign-in-view';
import { SignUp } from './app-views/sign-up-view';
import { AuthProvider } from './context/auth-context';
import { SummariesProvider } from './context/summaries-context';
import { PrivateRoute } from './private-route';

const App = () => (
	<AuthProvider>
		<BrowserRouter>
			<ThemeProvider theme={bdcTheme}>
				<Route path="/sign-in" component={SignIn} />
				<Route path="/sign-up" component={SignUp} />
				<SummariesProvider>
					{/* <PrivateRoute exact path="/dashboard" component={Dashboard} /> */}
					<PrivateRoute exact path="/collections" component={Collections} />
					<PrivateRoute exact path="/collections/:page" component={Collection} />
					<PrivateRoute exact path="/forms" component={Forms} />
					<PrivateRoute exact path="/forms/:page" component={Form} />
					<PrivateRoute exact path="/editors" component={Editors} />
				</SummariesProvider>
			</ThemeProvider>
		</BrowserRouter>
	</AuthProvider>
);

ReactDOM.render(<App />, document.querySelector('#root'));
