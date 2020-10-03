import React, { createContext, useState } from 'react';
import { useAuth, useUser } from 'reactfire';
import firebase from '../firebase';

interface AuthState {
	user: firebase.User | null;
	site?: string;
}

export const authContext = createContext<AuthState>({ user: null });

export const AuthProvider: React.FC = props => {
	const user = useUser(undefined, { startWithValue: null });
	const [ site, setSite ] = useState<string | undefined>(undefined);

	useAuth().onAuthStateChanged(async user => {
		if (user) {
			const idTokenResult = await user.getIdTokenResult();
			const { site } = idTokenResult.claims as { site: string };
			setSite(site);
		} else {
			setSite(undefined);
		}
	});

	return <authContext.Provider value={{ user, site }}>{props.children}</authContext.Provider>;
};
