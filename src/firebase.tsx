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

export type EditorRole = 'viewer' | 'editor' | 'admin' | 'owner';

export type EditorDoc = {
	name: string;
	email: string;
	role: EditorRole;
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

export type FieldMap = {
	[key: string]: { label: string; columnTemplate: number };
};

export type FormDoc = {
	name: string;
	url: string;
	fields: FieldMap;
	submissions: SubmissionSummary[];
};

export type ItemData = {
	[key: string]: null | string | string[] | firebase.firestore.Timestamp;
};

export type ItemStatus = 'published' | 'archived';

export type ItemDoc = {
	name: string;
	data: ItemData;
	status: ItemStatus;
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

export type FieldStructures = {
	[key: string]: FieldStructure;
};

export type ItemSummary = {
	id: string;
	data: ItemData;
	name: string;
	status: ItemStatus;
	modified: firebase.firestore.Timestamp;
};

export type CollectionDoc = {
	name: string;
	fieldStructures: FieldStructures;
	items: ItemSummary[];
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
	name: string;
	collections: CollectionSummary[];
	forms: FormSummary[];
	editors: EditorSummary[];
};

export type DocKey = string & { _docId: never };

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
