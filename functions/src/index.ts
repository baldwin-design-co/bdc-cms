import * as admin from 'firebase-admin';
admin.initializeApp();

exports.collections = require('./collections');
exports.forms = require('./forms');
exports.auth = require('./auth')

export type EditorRole = string //'viewer' | 'editor' | 'admin' | 'owner';

export type EditorDoc = {
	name: string;
	email: string;
	role: EditorRole;
};

export type SubmissionDoc<T extends FieldMap = FieldMap> = { [k in keyof T]: string };

export type SubmissionSummaryData<T extends FieldMap = FieldMap> = { [k in keyof T]: string };

export type SubmissionSummary<T extends FieldMap = FieldMap> = {
	id: string;
	submittedOn: admin.firestore.Timestamp;
	data: SubmissionSummaryData<T>;
};

export type FieldMap = {
	[key: string]: { label: string; columnTemplate: number };
};

export type FormDoc<T extends FieldMap = FieldMap> = {
	name: string;
	url: string;
	fields: T;
	fieldOrder: string[];
	submissions: SubmissionSummary<T>[];
};

export type ItemDataValue <T extends FieldStructure = FieldStructure> =
	  T extends TextFieldStructure ? string
	: T extends DateFieldStructure & { required: true } ? admin.firestore.Timestamp | Date
	: T extends DateFieldStructure ? admin.firestore.Timestamp | Date | null
	// : T extends OptionFieldStructure & { multi: true } ? string[]
	: T extends OptionFieldStructure & { required: true } ? string | string[]
	: T extends OptionFieldStructure ? string | string[] | null
	: T extends FileFieldStructure & { required: true } ? string | File
	: T extends FileFieldStructure ? string | File | null
	: string | string[] | File | Date | admin.firestore.Timestamp | null

export type ItemData<T extends FieldStructures = FieldStructures> = {
	[k in keyof T]: ItemDataValue<T[k]>
};

export type ItemStatus = 'published' | 'archived';

export type ItemDoc = {
	name: string;
	data: ItemData;
	status: ItemStatus;
};

export type Field = {
	type: 'text' | 'option' | 'date' | 'file';
	label?: string;
	helpText?: string;
	required?: boolean;
};

export type TextFieldStructure = Field & {
	type: 'text';
	multiline?: boolean;
};

export type OptionFieldStructure = Field & {
	type: 'option';
	options: string[];
	multi?: boolean;
};

export type DateFieldStructure = Field & {
	type: 'date';
};

export type FileFieldStructure = Field & {
	type: 'file';
	fileTypes?: string[];
};

export type FieldStructure =
	| TextFieldStructure
	| OptionFieldStructure
	| DateFieldStructure
	| FileFieldStructure;

export type FieldStructures = {
	[key: string]: FieldStructure;
};

export type ItemSummary<T extends FieldStructures = FieldStructures> = {
	id: string;
	data: ItemData<T>;
	name: string;
	status: ItemStatus;
	modified: admin.firestore.Timestamp;
};

export type CollectionDoc<T extends FieldStructures = FieldStructures> = {
	name: string;
	fieldStructures: T;
	fieldOrder: string[];
	items: ItemSummary<T>[];
	url: string;
};

export type CollectionSummary = {
	name: string;
	url: string;
	modified: admin.firestore.Timestamp;
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
	role: EditorRole;
	uid: string;
	emailVerified: boolean;
};

export type SiteDoc = {
	name: string;
	collections: CollectionSummary[];
	forms: FormSummary[];
	editors: EditorSummary[];
};

