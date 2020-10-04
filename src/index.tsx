import { bdcTheme, ThemeProvider } from 'bdc-components';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import { CollectionView } from './app-views/collections/collection-view';
import { CollectionsView } from './app-views/collections/collections-view';
import { FormView } from './app-views/forms/form-view';
import { FormsView } from './app-views/forms/forms-view';
import { SignInView } from './auth-views/sign-in-view';
import { SignUpView } from './auth-views/sign-up-view';
import { AuthProvider } from './context/auth-context';
import { FeedbackProvider } from './context/feedback-context';
import { SummariesProvider } from './context/summaries-context';
import { PrivateRoute } from './private-route';

const App = () => (
	<BrowserRouter>
		<AuthProvider>
			<ThemeProvider theme={bdcTheme}>
				<PrivateRoute exact path="/" component={CollectionsView} />
				<Route exact path="/sign-in" component={SignInView} />
				<Route exact path="/sign-up" component={SignUpView} />
				<SummariesProvider>
					<FeedbackProvider>
						<PrivateRoute exact path="/collections" component={CollectionsView} />
						<PrivateRoute
							exact
							path="/collections/:page"
							component={CollectionView}
						/>
						<PrivateRoute exact path="/forms" component={FormsView} />
						<PrivateRoute exact path="/forms/:page" component={FormView} />
					</FeedbackProvider>
				</SummariesProvider>
			</ThemeProvider>
		</AuthProvider>
	</BrowserRouter>
);

ReactDOM.render(<App />, document.querySelector('#root'));
