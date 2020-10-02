import React, { createContext, useContext, useEffect, useState } from 'react';
import { CollectionSummary, FormSummary, EditorSummary } from '../firestore';
import { authContext } from './auth-context';
import firebase from '../firebase';

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
				return firebase
					.firestore()
					.collection('sites')
					.doc(site)
					.onSnapshot(docSnap => {
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
