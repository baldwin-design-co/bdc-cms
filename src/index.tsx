import React from 'react';
import ReactDOM from 'react-dom';
import { bdcTheme, ThemeProvider } from 'bdc-components';
import { BrowserRouter, Route } from 'react-router-dom';
import { CollectionView } from './app-views/collections/collection-view';
import { CollectionsView } from './app-views/collections/collections-view';
import { FormView } from './app-views/forms/form-view';
import { FormsView } from './app-views/forms/forms-view';
import { SignInView } from './auth-views/sign-in-view';
import { AuthProvider } from './context/auth-context';
import { SummariesProvider } from './context/summaries-context';
import { PrivateRoute } from './private-route';
import { FeedbackProvider } from './context/feedback-context';

const App = () => (
	<BrowserRouter basename="/cms">
		<AuthProvider>
			<ThemeProvider theme={bdcTheme}>
				<Route
					exact
					path={`${process.env.PUBLIC_URL}/sign-in`}
					component={SignInView}
				/>
				<SummariesProvider>
					<FeedbackProvider>
						<PrivateRoute
							exact
							path={`${process.env.PUBLIC_URL}/collections`}
							component={CollectionsView}
						/>
						<PrivateRoute
							exact
							path={`${process.env.PUBLIC_URL}/collections/:page`}
							component={CollectionView}
						/>
						<PrivateRoute
							exact
							path={`${process.env.PUBLIC_URL}/forms`}
							component={FormsView}
						/>
						<PrivateRoute
							exact
							path={`${process.env.PUBLIC_URL}/forms/:page`}
							component={FormView}
						/>
					</FeedbackProvider>
				</SummariesProvider>
			</ThemeProvider>
		</AuthProvider>
	</BrowserRouter>
);

ReactDOM.render(<App />, document.querySelector('#root'));
