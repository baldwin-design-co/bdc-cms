import React, { useContext, useState } from 'react';
import { authContext } from '../context/auth-context';
import { summariesContext } from '../context/summaries-context';
import firebase from '../firebase';
import './app-views.css';
import { Header } from './header/header';
import { SideBar } from './sidebar/sidebar';
import { Table } from './table/table';
import { FormModal } from 'bdc-components';

interface Editor {
	name: string;
	email: string;
	role: string | null;
	uid?: string;
}

export const Editors: React.FC = () => {
	const { site } = useContext(authContext);
	const { editors } = useContext(summariesContext);

	const [ searchTerm, setSearchTerm ] = useState('');
	const [ currentEditor, setCurrentEditor ] = useState<Editor | null>(null);

	const saveEditor = (editor: Editor) => {
		if (editor.uid) {
			return firebase.firestore().collection(`sites/${site}/editors`).doc(editor.uid).update(editor);
		} else {
			return firebase.firestore().collection(`sites/${site}/editors`).add(editor);
		}
	};

	return (
		<section className="app">
			<SideBar />
			<div className="container">
				<Header
					title="Editors"
					actionName="editors"
					action={() => {
						setCurrentEditor({
							name: '',
							email: '',
							role: null
						});
					}}
					search={setSearchTerm}
				/>

				<Table
					type="editors"
					fieldMap={[ 'name', 'email', 'role' ]}
					items={editors}
					itemClickHandler={setCurrentEditor}
					included={editor => editor.name.toLowerCase().includes(searchTerm.toLowerCase())}
				/>

				{currentEditor ? (
					<FormModal
						name={currentEditor.name || 'New Editor'}
						fieldStructures={{
							name: { type: 'text', required: true },
							email: { type: 'text', required: true },
							role: { type: 'option', options: [ 'viewer', 'editor', 'admin', 'owner' ], required: true }
						}}
						handleSubmit={async values => {
							if (currentEditor.uid) await saveEditor({ ...values, uid: currentEditor.uid });
							if (!currentEditor.uid) await saveEditor(values);
							setCurrentEditor(null);
						}}
						initialValues={{
							name: currentEditor.name,
							email: currentEditor.email,
							role: currentEditor.role!
						}}
						handleClose={() => setCurrentEditor(null)}
					/>
				) : null}
			</div>
		</section>
	);
};
