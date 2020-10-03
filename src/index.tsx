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
import { devConfig, prodConfig } from './firebase';
import { FirebaseAppProvider, SuspenseWithPerf } from 'reactfire';

const App = () => (
	<FirebaseAppProvider
		firebaseConfig={window.location.hostname === 'localhost' ? devConfig : prodConfig}
	>
		<BrowserRouter basename="/cms">
			<SuspenseWithPerf fallback="loading..." traceId="app">
				<AuthProvider>
					<ThemeProvider theme={bdcTheme}>
						<Route exact path="/sign-in" component={SignInView} />
						<SummariesProvider>
							<FeedbackProvider>
								<PrivateRoute
									exact
									path="/collections"
									component={CollectionsView}
								/>
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
			</SuspenseWithPerf>
		</BrowserRouter>
	</FirebaseAppProvider>
);

ReactDOM.render(<App />, document.querySelector('#root'));
