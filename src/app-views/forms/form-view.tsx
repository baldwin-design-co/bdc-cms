import { DataTable, PageHeader, Modal } from 'bdc-components';
import React, { useContext, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { SubmissionSummary, FormDoc, SubmissionSummaryData } from '../../firestore';
import { authContext } from '../../context/auth-context';
import { feedbackContext } from '../../context/feedback-context';
import firebase from '../../firebase';
import { AppView } from '../app-view';
import { useFirestoreDocData } from 'reactfire'

export const FormView: React.FC<RouteComponentProps<{ page: string }>> = props => {
	const { site } = useContext(authContext);
	const { setFeedback } = useContext(feedbackContext)

	const formRef = firebase.firestore().collection(`sites/${site}/forms`).doc(props.match.params.page)
	const form = useFirestoreDocData<FormDoc | undefined>(formRef, { startWithValue: undefined })

	const [ currentSubmission, setCurrentSubmission ] = useState<Submission | undefined>()

	class Submission implements SubmissionSummary {
		id: string
		submittedOn: firebase.firestore.Timestamp
		data: SubmissionSummaryData
		docRef: firebase.firestore.DocumentReference

		constructor (submission: SubmissionSummary) {
			this.id = submission.id
			this.submittedOn = submission.submittedOn
			this.data = submission.data
			this.docRef = firebase.firestore().collection('sites')
				.doc(site)
				.collection('forms')
				.doc(props.match.params.page)
				.collection('submissions')
				.doc(submission.id)
		}

		delete = async () => {
			try {
				await this.docRef.delete()
				setCurrentSubmission(undefined)
				setFeedback(true, 'Submission deleted', 'success')
			} catch {
				setFeedback(true, 'Something went wrong deleting the submission', 'error')
			}
		}

		Modal = () => {
			const fields = form?.fieldOrder || []

			return (
				<Modal
					title={`${form?.name} submission`}
					onClose={() => setCurrentSubmission(undefined)}
					actions={[ { action: this.delete, label: 'delete' }]}
				>
					{fields.map((field, i) => (
						<p key={i}>
							<b>{field}: </b>
							{this.data[field]}
							<br/><br/>
						</p>
					))}
				</Modal>
			)
		}
	}

	const submissions = form?.submissions.map(submissionSummary => new Submission(submissionSummary)) || []

	return (
		<AppView>
			<PageHeader title={props.match.params.page} />

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
