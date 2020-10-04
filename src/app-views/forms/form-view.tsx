import { DataTable, Modal, PageHeader } from 'bdc-components';
import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { authContext } from '../../context/auth-context';
import { feedbackContext } from '../../context/feedback-context';
import firebase from '../../firebase';
import { FormDoc, SubmissionSummary, SubmissionSummaryData } from '../../firestore';
import { AppView } from '../app-view';

export const FormView: React.FC<RouteComponentProps<{ page: string }>> = props => {
	const { site } = useContext(authContext);
	const { setFeedback } = useContext(feedbackContext)
	
	const [ form, setForm ] = useState<FormDoc | undefined>();
	const [ currentSubmission, setCurrentSubmission ] = useState<Submission | undefined>()

	const formName = props.match.params.page

	useEffect(() => (
		firebase.firestore()
			.collection(`sites/${site}/forms`)
			.doc(formName)
			.onSnapshot(docSnap => {
				setForm(docSnap.data() as FormDoc)
			}
	)), [ site, formName ]);

	class Submission implements SubmissionSummary {
		id: string
		submittedOn: firebase.firestore.Timestamp
		data: SubmissionSummaryData

		constructor (submission: SubmissionSummary) {
			this.id = submission.id
			this.submittedOn = submission.submittedOn
			this.data = submission.data
		}

		delete = async () => {
			try {
				await firebase.firestore()
					.collection(`sites/${site}/forms/${formName}/submissions`)
					.doc(this.id)
					.delete()

				setCurrentSubmission(undefined)
				setFeedback(true, 'Submission deleted', 'success')
			} catch {
				setFeedback(true, 'Something went wrong deleting the submission', 'error')
			}
		}

		Modal = () => {
			const fields = form?.fieldOrder || []
			const submissionData = fields.map((field, i) => (
				<p key={i}>
					<b>{field}: </b>
					{this.data[field]}
					<br/><br/>
				</p>
			))

			return (
				<Modal
					title={`${form?.name} submission`}
					onClose={() => setCurrentSubmission(undefined)}
					actions={[ { action: this.delete, label: 'delete' }]}
				>
					{submissionData}
				</Modal>
			)
		}
	}

	const submissions = form?.submissions.map(submissionSummary => new Submission(submissionSummary)) || []

	return (
		<AppView>
			<PageHeader title={formName} />

			<DataTable
				items={submissions}
				fieldMap={form?.fields || {}}
				fieldOrder={form?.fieldOrder || []}
				itemClickHandler={setCurrentSubmission}
				loading={!form}
			/>

			{currentSubmission && <currentSubmission.Modal />}
		</AppView>
	);
};
