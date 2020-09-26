import { AccountCircleOutlined as EditorIcon, DeleteOutline as DeleteIcon, PersonAdd as NewEditorIcon } from '@material-ui/icons';
import { DataTable, FormModal, PageHeader } from 'bdc-components';
import React, { useContext, useState } from 'react';
import { DocumentReference } from 'typed-firestore';
import { DocKey, EditorDoc, EditorRole } from '../../firestore';
import { authContext } from '../context/auth-context';
import { summariesContext } from '../context/summaries-context';
import { db } from '../firebase';
import { AppView } from './app-view';
import 'firebase/firestore'
import './app-views.css';

export const Editors: React.FC = () => {
	const { site } = useContext(authContext);
	const { editors: editorData, loaded } = useContext(summariesContext);

	const [ searchTerm, setSearchTerm ] = useState('');
	const [ currentEditor, setCurrentEditor ] = useState<Editor | NewEditor | undefined>();

	class Editor {
		name: string
		email: string
		role: EditorRole
		readonly uid: string
		docRef: DocumentReference<{ key: DocKey, value: EditorDoc, subCollections: {} }>

		constructor (data: { name: string, email: string, role: EditorRole, uid: string }) {
			this.name = data.name
			this.email = data.email
			this.role = data.role
			this.uid = data.uid
			this.docRef = db
				.collection('sites')
				.doc(site as DocKey)
				.collection('editors')
				.doc(data.uid as DocKey)
		}

		save = async (data: { name: string, email: string, role: string }) => {
			const { name, email, role } = data

			this.name = name
			this.email = email
			this.role = role

			await this.docRef.update({ name, email, role });
			setCurrentEditor(undefined)
		}

		delete = async () => {
			await this.docRef.delete()
			setCurrentEditor(undefined)
		}

		FormModal = () => (
			<FormModal
				name={this.name}
				fieldStructures={{
					name: { type: 'text', label: 'Name', required: true },
					email: { type: 'text', label: 'Email', required: true },
					role: {
						type: 'option',
						label: 'Role',
						options: ['viewer', 'editor', 'admin', 'owner'],
						required: true
					}
				}}
				initialValues={{
					name: this.name,
					email: this.email,
					role: this.role
				}}
				actions={[
					{ label: <DeleteIcon fontSize="small" />, action: this.delete },
					{ label: 'Save', validate: true, action: this.save }
				]}
				onClose={() => setCurrentEditor(undefined)}
			/>
		)
	}

	class NewEditor {
		name: string = ''
		email: string = ''
		role: EditorRole | null = null

		save = async (data: { name: string, email: string, role: string }) => {
			const { name, email, role } = data

			this.name = name
			this.email = email
			this.role = role

			await db
				.collection('sites')
				.doc(site as DocKey)
				.collection('editors')
				.add({ name, email, role })

			setCurrentEditor(undefined)
		}

		FormModal = () => (
			<FormModal
				name='New Editor'
				fieldStructures={{
					name: { type: 'text', label: 'Name', required: true },
					email: { type: 'text', label: 'Email', required: true },
					role: {
						type: 'option',
						label: 'Role',
						options: ['viewer', 'editor', 'admin', 'owner'],
						required: true
					}
				}}
				actions={[ { label: 'Save', validate: true, action: this.save } ]}
				onClose={() => setCurrentEditor(undefined)}
			/>
		)
	}

	const editors = editorData?.map(editor => new Editor(editor)) || []
	const visibleEditors = editors.filter(editor => editor.name.toLowerCase().includes(searchTerm.toLowerCase()));

	const tableItems = visibleEditors.map(editor => ({
		id: editor.uid,
		data: {
			name: editor.name,
			email: editor.email,
			role: editor.role
		}
	}))

	return (
		<AppView>
			<PageHeader
				title="Editors"
				action={() => { setCurrentEditor(new NewEditor())}}
				actionLabel={<NewEditorIcon fontSize="small" />}
				search={setSearchTerm}
			/>

			<DataTable
				items={tableItems}
				fieldMap={{
					name: { label: 'Name', columnTemplate: 2 },
					email: { label: 'Email', columnTemplate: 3 },
					role: { label: 'Role' }
				}}
				identifyingField="name"
				itemIcon={<EditorIcon />}
				loading={!loaded}
				itemClickHandler={item => {
					const editor = editors.find(editor => (editor.uid === item.id))
					setCurrentEditor(editor)
				}}
			/>

			{currentEditor && <currentEditor.FormModal />}
		</AppView>
	);
};
