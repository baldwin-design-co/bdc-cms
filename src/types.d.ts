type FieldType = 'text' | 'number' | 'email' | 'phone' | 'url' | 'date' | 'option' | 'reference' | 'image' | 'attatchment';
interface TableItems { [key: string]: string | number | boolean }

export type FieldStructure <T extends FieldType> =
	T extends 'text' ? { type: 'text'; name: string; multiline: boolean }
	: T extends 'date' ? { type: T; name: string; time: boolean }
	: T extends 'option' ? { type: T; name: string; options: string[]; multi: boolean }
	: T extends 'reference' ? { type: T; name: string; collection: string; multi: boolean }
	: T extends 'image' | 'attatchment' ? { type: T; name: string; fileTypes: string[] }
	: { type: T; name: string }

export type FieldValue <T extends FieldStructure<FieldType>> =
	T extends { type: 'text' | 'email' | 'phone' | 'url' | 'date' } ? string | undefined
	: T extends { type: 'option' | 'reference', multi: false } ? string | undefined
	: T extends { type: 'option' | 'reference', multi: true } ? string[] | undefined
	: T extends { type: 'image' | 'attatchment' } ? { name: string; url: string } | undefined
	: never

export type GenericFieldValue = string | string[] | { name: string; url: string } | undefined

export interface ItemDoc {
	status: 'published' | 'archived';
	data: { [key: string]: GenericFieldValue };
}

export interface ItemSummary extends  TableItems {
	name: string;
	modified: string;
	status: 'published' | 'archived';
	data: { [key: string]: GenericFieldValue };
	id: string;
}

export interface Collection {
	name: string;
	url: string;
	fieldStructures: FieldStructure<FieldType>[];
	items: ItemSummary<FieldStructure<FieldType>>[];
}

export interface CollectionSummary extends TableItems {
	name: string;
	url: string;
	itemCount: number;
	modified: string;
}

export interface SubmissionSummary {
	data: { [key: string]: string };
	id: string;
	submittedOn: string;
}

export interface Form {
	name: string;
	url: string;
	fields: string[];
	submissions: SubmissionSummary[];
}

export interface FormSummary extends TableItems {
	name: string;
	url: string;
	submissionCount: number;
}

export interface EditorDoc {
	name: string;
	email: string;
	role: string
	emailVerified: boolean;
}

export interface EditorSummary extends TableItems {
	name: string;
	email: string;
	role: string
	uid: string;
	emailVerified: boolean
}

export interface CurrentEditor {
    name?: string
    email?: string
    role?: string
    uid?: string
}
