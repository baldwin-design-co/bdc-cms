import { Snackbar } from '@material-ui/core';
import { DataTable, PageHeader, Modal } from 'bdc-components';
import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { SubmissionSummary, FormDoc, DocKey, SubmissionSummaryData } from '../../firestore';
import { authContext } from '../context/auth-context';
import { db } from '../firebase';
import { AppView } from './app-view';

interface Form {
	name: string;
	fields: string[];
	submissions: SubmissionSummary[];
}

export const Form: React.FC<RouteComponentProps<{ page: string }>> = props => {
	const { site } = useContext(authContext);
	
	const [ form, setForm ] = useState<FormDoc | undefined>();
	const [ currentSubmission, setCurrentSubmission ] = useState<SubmissionSummary | undefined>()
	const [ snackbarVisible, setSnackbarVisibility ] = useState(false)

	useEffect(() => (
		db.collection('sites')
			.doc(site as DocKey)
			.collection('forms')
			.doc(props.match.params.page as DocKey)
			.onSnapshot(docSnap => {
				setForm(docSnap.data())
			}
		)), [ site, props.match.params.page ]);

	const deleteCurrentSubmission = async () => {
		if (currentSubmission && form) {
			await db.collection('sites')
				.doc(site as DocKey)
				.collection('forms')
				.doc(props.match.params.page as DocKey)
				.collection('submissions')
				.doc(currentSubmission.id as DocKey)
				.delete()
			
			const submissions = form.submissions.filter(submission => submission.id !== currentSubmission.id)
			setForm({ ...form, submissions })

			setSnackbarVisibility(true)

			setCurrentSubmission(undefined)
		}
	}

	const formatSubmissionData = (data: SubmissionSummaryData) => {
		const fields = form?.fieldOrder || []
		
		return fields.map((field, i) => (
			<p key={i}>
				<b>{field}: </b>
				{data[field]}
				<br/><br/>
			</p>
		))
	}

	return (
		<AppView>
			<PageHeader title={props.match.params.page} />

			<DataTable
				items={form?.submissions || []}
				fieldMap={form?.fields || {}}
				fieldOrder={form?.fieldOrder || []}
				itemClickHandler={setCurrentSubmission}
				loading={!form}
			/>

			{currentSubmission && (
				<Modal
					title={`${form?.name} submission`}
					onClose={() => setCurrentSubmission(undefined)}
					actions={[ { action: deleteCurrentSubmission, label: 'delete' }]}
				>
					{formatSubmissionData(currentSubmission.data)}
				</Modal>
			)}

			<Snackbar
				anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
				autoHideDuration={4000}
				message='Submission deleted.'
				open={snackbarVisible}
				onClose={() => setSnackbarVisibility(false)}
			/>
		</AppView>
	);
};
