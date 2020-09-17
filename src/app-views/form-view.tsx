import { PageHeader } from 'bdc-components';
import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { SubmissionSummary, FormDoc, DocKey } from '../../firestore';
import { authContext } from '../context/auth-context';
import { db } from '../firebase';
import { AppView } from './app-view';
import { SubmissionCard } from './card/submission-card';

interface Form {
	name: string;
	fields: string[];
	submissions: SubmissionSummary[];
}

export const Form: React.FC<RouteComponentProps<{ page: string }>> = props => {
	const { site } = useContext(authContext);
	
	const [ form, setForm ] = useState<FormDoc| undefined>();
	const [ currentSubmission, setCurrentSubmission ] = useState<SubmissionSummary | undefined>()

	useEffect(() => (
		db.collection('sites')
			.doc(site as DocKey)
			.collection('forms')
			.doc(props.match.params.page as DocKey)
			.onSnapshot(docSnap => {
				setForm(docSnap.data())
			}
		)), [ site, props.match.params.page ]);

	return (
		<AppView>
			{form ? 
				<>
					<PageHeader title={form.name} returnLink="/forms" />

					{/* <DataTable
						items={form.submissions}
						fieldMap={form.fields}
						itemClickHandler={setCurrentSubmission}
					/> */}

					{currentSubmission ? (
						<SubmissionCard
							formName={form.name}
							submission={currentSubmission}
							closeCard={() => setCurrentSubmission(undefined)}
							deleteSubmission={() => console.log('delete submission')}
						/>
					) : null}
				</>
			: null}
		</AppView>
	);
};
