import 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { db, CollectionSummary, EditorSummary, FormSummary, DocKey } from '../firebase';
import { authContext } from './auth-context';

interface SummariesState {
	loaded: boolean;
	collections?: CollectionSummary[];
	forms?: FormSummary[];
	editors?: EditorSummary[];
}

const defaultSummariesState: SummariesState = { loaded: false };

export const summariesContext = createContext(defaultSummariesState);

export const SummariesProvider: React.FC = ({ children }) => {
	const { site } = useContext(authContext);

	const [ summariesState, setSummariesState ] = useState(defaultSummariesState);

	useEffect(
		() => {
			if (site) {
				return db.collection('sites').doc(site as DocKey).onSnapshot(docSnap => {
					if (docSnap.exists) {
						const { collections, forms, editors } = docSnap.data()!;
						setSummariesState({ loaded: true, collections, forms, editors });
					}
				});
			}
		},
		[ site ]
	);

	return (
		<summariesContext.Provider value={summariesState}>{children}</summariesContext.Provider>
	);
};
