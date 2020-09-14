import firebase from 'firebase/app';
import 'firebase/firestore';
import * as typedFirestore from 'typed-firestore';

firebase.initializeApp({
	apiKey: 'AIzaSyBHshsyQaYO3-2iiO2JqOu7Hg8LkWvUb3E',
	authDomain: 'content-management-system-dev.firebaseapp.com',
	databaseURL: 'https://content-management-system-dev.firebaseio.com',
	projectId: 'content-management-system-dev',
	storageBucket: 'content-management-system-dev.appspot.com',
	messagingSenderId: '499203573769',
	appId: '1:499203573769:web:fdc4fbbb969942e09c10d8'
});

export type EditorDoc = {
	name: string;
	uid: string;
	email: string;
	emailVerified: boolean;
	role: 'viewer' | 'editor' | 'admin' | 'owner';
};

export type SubmissionDoc = {
	[key: string]: string;
};

export type SubmissionSummaryData = {
	[key: string]: string;
};

export type SubmissionSummary = {
	id: string;
	submittedOn: firebase.firestore.Timestamp;
	data: SubmissionSummaryData;
};

export type FormDoc = {
	name: string;
	url: string;
	fields: string[];
	submissions: SubmissionSummary[];
};

export type ItemData = {
	[key: string]: null | string | string[] | firebase.firestore.Timestamp;
};

export type ItemDoc = {
	data: ItemData;
	status: 'published' | 'archived';
};

export type Field = {
	type: 'text' | 'option' | 'date' | 'file';
	label: string | null;
	helpText: string | null;
	required: boolean | null;
};

export type TextFieldStructure = Field & {
	type: 'text';
	multiline: boolean;
};

export type OptionFieldStructure = Field & {
	type: 'option';
	options: string[];
	multi: boolean;
};

export type DateFieldStructure = Field & {
	type: 'date';
};

export type FileFieldStructure = Field & {
	type: 'file';
	fileTypes: string[] | null;
};

export type FieldStructure =
	| TextFieldStructure
	| OptionFieldStructure
	| DateFieldStructure
	| FileFieldStructure;

export type ItemSummary = {
	data: { [key: string]: FieldStructure };
	name: string;
	status: string;
	modified: firebase.firestore.Timestamp;
};

export type CollectionDoc = {
	fieldStructures: { [key: string]: {} | number };
	items: { [key: string]: ItemSummary };
	url: string;
};

export type CollectionSummary = {
	name: string;
	url: string;
	modified: firebase.firestore.Timestamp;
	itemCount: number;
};

export type FormSummary = {
	name: string;
	url: string;
	submissionCount: number;
};

export type EditorSummary = {
	name: string;
	email: string;
	role: string;
	uid: string;
	emailVerified: boolean;
};

export type SiteDoc = {
	collections: CollectionSummary[];
	forms: FormSummary[];
	editors: EditorSummary[];
};

const firestoreInstance = (firebase.firestore() as unknown) as typedFirestore.Firestore<{
	sites: {
		key: string & { _siteId: never };
		value: SiteDoc;
		subCollections: {
			collections: {
				key: string & { _collectionId: never };
				value: CollectionDoc;
				subCollections: {
					items: {
						key: string & { _itemId: never };
						value: ItemDoc;
						subCollections: {};
					};
				};
			};
			forms: {
				key: string & { _stringId: never };
				value: FormDoc;
				subCollections: {
					submissions: {
						key: string & { _submissionId: never };
						value: SubmissionDoc;
						subCollections: {};
					};
				};
			};
			editors: {
				key: string & { _editorId: never };
				value: EditorDoc;
				subCollections: {};
			};
		};
	};
}>;

export default firestoreInstance;
