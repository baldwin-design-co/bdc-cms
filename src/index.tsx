import { bdcTheme, ThemeProvider } from 'bdc-components';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import { Collection } from './app-views/collections/collection-view';
import { Collections } from './app-views/collections/collections-view';
import { Form } from './app-views/forms/form-view';
import { Forms } from './app-views/forms/forms-view';
import { SignIn } from './auth-views/sign-in-view';
import { AuthProvider } from './context/auth-context';
import { SummariesProvider } from './context/summaries-context';
import { PrivateRoute } from './private-route';

const App = () => (
	<AuthProvider>
		<BrowserRouter>
			<ThemeProvider theme={bdcTheme}>
				<Route path="/sign-in" component={SignIn} />
				<SummariesProvider>
					<PrivateRoute exact path="/collections" component={Collections} />
					<PrivateRoute exact path="/collections/:page" component={Collection} />
					<PrivateRoute exact path="/forms" component={Forms} />
					<PrivateRoute exact path="/forms/:page" component={Form} />
				</SummariesProvider>
			</ThemeProvider>
		</BrowserRouter>
	</AuthProvider>
);

ReactDOM.render(<App />, document.querySelector('#root'));
