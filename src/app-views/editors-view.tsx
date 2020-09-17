import React, { useContext, useState } from 'react';
import { authContext } from '../context/auth-context';
import { summariesContext } from '../context/summaries-context';
import { db } from '../firebase';
import './app-views.css';
import { DataTable, FormModal, PageHeader } from 'bdc-components';
import { AccountCircleOutlined as EditorIcon } from '@material-ui/icons';
import { PersonAdd as NewEditorIcon } from '@material-ui/icons'
import { AppView } from './app-view';
import { EditorRole, DocKey, EditorSummary } from '../../firestore';

interface CurrentEditor {
	name: string;
	email: string;
	role: EditorRole | null;
	uid?: string;
}

export const Editors: React.FC = () => {
	const { site } = useContext(authContext);
	const { editors } = useContext(summariesContext);

	const [ searchTerm, setSearchTerm ] = useState('');
	const [ currentEditor, setCurrentEditor ] = useState<CurrentEditor | undefined>();

	const saveEditor = () => {
		const editor = currentEditor
			? { ...currentEditor, role: currentEditor.role || 'viewer' }
			: undefined;

		if (editor && editor.uid) {
			return db
				.collection('sites')
				.doc(site as DocKey)
				.collection('editors')
				.doc(editor.uid as DocKey)
				.update(editor);
		} else if (editor) {
			return db.collection('sites').doc(site as DocKey).collection('editors').add(editor);
		}
	};

	const included = (editor: EditorSummary) =>
		editor.name.toLowerCase().includes(searchTerm.toLowerCase())

	return (
		<AppView>
			<PageHeader
				title="Editors"
				action={() => setCurrentEditor({ name: '', email: '', role: null })}
				actionLabel={<NewEditorIcon />}
				search={setSearchTerm}
			/>

			<DataTable
				items={editors?.filter(included) || []}
				fieldMap={{
					name: { label: 'Name', columnTemplate: 2 },
					email: { label: 'Email', columnTemplate: 3 },
					role: { label: 'Role' }
				}}
				identifyingField="name"
				itemIcon={<EditorIcon />}
				itemClickHandler={() => {}}
			/>

			{currentEditor ? (
				<FormModal
					name={currentEditor.name || 'New Editor'}
					fieldStructures={{
						name: { type: 'text', required: true },
						email: { type: 'text', required: true },
						role: {
							type: 'option',
							options: [ 'viewer', 'editor', 'admin', 'owner' ],
							required: true
						}
					}}
					initialValues={{
						name: currentEditor.name,
						email: currentEditor.email,
						role: currentEditor.role
					}}
					onSubmit={async values => {
						await saveEditor();
						setCurrentEditor(undefined);
					}}
					onClose={() => setCurrentEditor(undefined)}
				/>
			) : null}
		</AppView>
	);
};
