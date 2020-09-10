import 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';
import firebase from '../firebase';
import { authContext } from './auth-context';

export interface CollectionSummary {
	name: string;
	url: string;
	itemCount: number;
	modified: string;
}

export interface FormSummary {
	name: string;
	url: string;
	submissionCount: number;
}

export interface EditorSummary {
	name: string;
	email: string;
	role: string;
	uid: string;
	emailVerified: boolean;
}

interface SummariesState {
	loaded: boolean;
	collections?: CollectionSummary[];
	forms?: FormSummary[];
	editors?: EditorSummary[];
}

const defaultSummariesState: SummariesState = { loaded: false };

export const summariesContext = createContext(defaultSummariesState);

export const SummariesProvider: React.FC = ({ children }) => {
	const [ summariesState, setSummariesState ] = useState(defaultSummariesState);
	const { site } = useContext(authContext);

	useEffect(
		() => {
			if (site) {
				return firebase.firestore().collection('sites').doc(site).onSnapshot(docSnap => {
					const { collections, forms, editors } = docSnap.data()!;
					setSummariesState({ loaded: true, collections, forms, editors });
				});
			}
		},
		[ site ]
	);

	return <summariesContext.Provider value={{ ...summariesState }}>{children}</summariesContext.Provider>;
};
