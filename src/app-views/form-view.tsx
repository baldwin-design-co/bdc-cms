import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { authContext } from '../context/auth-context';
import firebase from '../firebase';
import { SubmissionSummary } from '../types';
import { SubmissionCard } from './card/submission-card';
import { Header } from './header/header';
import { SideBar } from './sidebar/sidebar';
import { Table } from './table/table';

interface FormViewState {
	formName: string;
	fields?: string[];
	submissions?: SubmissionSummary[];
	currentSubmission?: SubmissionSummary;
}

export const Form: React.FC<RouteComponentProps<{ page: string }>> = props => {
	const [ state, setState ] = useState<FormViewState>({ formName: props.match.params.page });
	const { site } = useContext(authContext);

	useEffect(() => {
		return firebase.firestore().collection(`sites/${site}/forms`).doc(state.formName).onSnapshot(docSnap => {
			if (!docSnap.exists) throw Error('form does not exist');
			const { fields, submissions } = docSnap.data()!;
			setState({ ...state, fields, submissions });
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const setCurrentSubmission = (submission: SubmissionSummary) => {
		setState({ ...state, currentSubmission: submission });
	};

	const closeCurrentSubmission = () => setState({ ...state, currentSubmission: undefined });

	const deleteCurrentSubmission = async () => {
		if (state.currentSubmission) {
			await firebase
				.firestore()
				.collection(`sites/${site}/forms/${state.formName}/submissions`)
				.doc(state.currentSubmission.id)
				.delete();
			closeCurrentSubmission();
		}
	};

	return (
		<section className="app">
			<SideBar />
			<div className="container">
				<Header title={state.formName} back="/forms" />

				<Table
					type="form"
					fieldMap={state.fields}
					items={state.submissions}
					itemClickHandler={setCurrentSubmission}
					included={(item: any) => true}
				/>

				{state.currentSubmission ? (
					<SubmissionCard
						formName={state.formName}
						submission={state.currentSubmission}
						closeCard={closeCurrentSubmission}
						deleteSubmission={deleteCurrentSubmission}
					/>
				) : null}
			</div>
		</section>
	);
};
