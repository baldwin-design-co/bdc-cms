import 'firebase/auth';
import 'firebase/functions';
import React, { createContext, useEffect, useState } from 'react';
import firebase from '../firebase';

interface AuthState {
	user: firebase.User | null;
	site?: string;
	roleIndex: number;
	signIn: (credentials: { email: string; password: string }) => Promise<void> | void;
	signUp: (credentials: { email: string; password: string }) => Promise<void> | void;
	signOut: () => void;
}

const defaultAuthState: AuthState = {
	roleIndex: 0,
	user: firebase.auth().currentUser,
	signIn: () => {},
	signUp: () => {},
	signOut: () => {}
};

export const authContext = createContext(defaultAuthState);

export const AuthProvider: React.FC<{}> = props => {
	const [ authState, setAuthState ] = useState(defaultAuthState);

	useEffect(() => {
		return firebase.auth().onAuthStateChanged(async user => {
			if (user) {
				const { role, site } = (await user.getIdTokenResult()).claims;
				const roleIndex = [ 'viewer', 'editor', 'admin', 'owner' ].indexOf(role);
				setAuthState({ ...authState, user, roleIndex, site });
			} else {
				setAuthState({ ...authState, user, roleIndex: 0, site: undefined });
			}
		});
		// eslint-disable-next-line
	}, []);

	const signIn = async (credentials: { email: string; password: string }) => {
		const { email, password } = credentials;
		await firebase.auth().signInWithEmailAndPassword(email, password);
	};

	const signUp = async (credentials: { email: string; password: string }) => {
		const acceptInvitation = firebase.functions().httpsCallable('editors-AcceptInvitation');
		await acceptInvitation(credentials);
	};

	const signOut = () => firebase.auth().signOut();

	return (
		<authContext.Provider value={{ ...authState, signIn, signUp, signOut }}>
			{props.children}
		</authContext.Provider>
	);
};
