import * as firebase from 'firebase/app';
import * as typedFirestore from 'typed-firestore';
import 'firebase/firestore';
import 'firebase/auth';

import {
	CollectionDoc,
	DocKey,
	EditorDoc,
	FormDoc,
	ItemDoc,
	SiteDoc,
	SubmissionDoc
} from '../firestore';

firebase.initializeApp({
	apiKey: 'AIzaSyBHshsyQaYO3-2iiO2JqOu7Hg8LkWvUb3E',
	authDomain: 'content-management-system-dev.firebaseapp.com',
	databaseURL: 'https://content-management-system-dev.firebaseio.com',
	projectId: 'content-management-system-dev',
	storageBucket: 'content-management-system-dev.appspot.com',
	messagingSenderId: '499203573769',
	appId: '1:499203573769:web:fdc4fbbb969942e09c10d8'
});

export const db = (firebase.firestore() as unknown) as typedFirestore.Firestore<{
	sites: {
		key: DocKey;
		value: SiteDoc;
		subCollections: {
			collections: {
				key: DocKey;
				value: CollectionDoc;
				subCollections: {
					items: {
						key: DocKey;
						value: ItemDoc;
						subCollections: {};
					};
				};
			};
			forms: {
				key: DocKey;
				value: FormDoc;
				subCollections: {
					submissions: {
						key: DocKey;
						value: SubmissionDoc;
						subCollections: {};
					};
				};
			};
			editors: {
				key: DocKey;
				value: EditorDoc;
				subCollections: {};
			};
		};
	};
}>;
export default firebase;
