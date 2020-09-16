import * as admin from 'firebase-admin';
import * as typedAdminFirestore from 'typed-admin-firestore';
import {
	CollectionDoc,
	DocKey,
	EditorDoc,
	FormDoc,
	ItemDoc,
	SiteDoc,
	SubmissionDoc
} from '../../firestore';

const app = admin.initializeApp();
export const db = (app.firestore() as unknown) as typedAdminFirestore.Firestore<{
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

exports.collections = require('./collections');
exports.forms = require('./forms');
exports.editors = require('./editors');

export const formatDate = (timestamp: Date) => {
	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];
	return `${months[timestamp.getMonth()]} ${timestamp.getDate()}, ${timestamp.getFullYear()}`;
};
