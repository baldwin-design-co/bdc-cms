import React, { createContext, useContext } from 'react';
import { CollectionSummary, FormSummary, SiteDoc } from '../firestore';
import { authContext } from './auth-context';
import { useFirestore, useFirestoreDocData } from 'reactfire';

interface SummariesState {
	collections?: CollectionSummary[];
	forms?: FormSummary[];
}

export const summariesContext = createContext<SummariesState>({});

export const SummariesProvider: React.FC = ({ children }) => {
	const firestore = useFirestore();

	const { site } = useContext(authContext);
	const siteRef = firestore.collection('sites').doc(site);

	const { collections, forms } = useFirestoreDocData<SiteDoc>(siteRef);

	if (window.location.hostname === 'localhost') {
		firestore.settings({
			host: 'localhost:8080',
			ssl: false
		});
	}

	return (
		<summariesContext.Provider value={{ collections, forms }}>
			{children}
		</summariesContext.Provider>
	);
};
