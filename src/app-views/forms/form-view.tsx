import { DataTable, PageHeader, Modal } from 'bdc-components';
import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { DocumentReference } from 'typed-firestore';
import { SubmissionSummary, FormDoc, DocKey, SubmissionSummaryData, FieldMap, SubmissionDoc } from '../../../firestore';
import { authContext } from '../../context/auth-context';
import { db } from '../../firebase';
import { AppView } from '../app-view';

interface Form {
	name: string;
	fields: string[];
	submissions: SubmissionSummary[];
}

export const Form: React.FC<RouteComponentProps<{ page: string }>> = props => {
	const { site } = useContext(authContext);
	
	const [ form, setForm ] = useState<FormDoc | undefined>();
	const [ currentSubmission, setCurrentSubmission ] = useState<Submission | undefined>()

	useEffect(() => (
		db.collection('sites')
			.doc(site as DocKey)
			.collection('forms')
			.doc(props.match.params.page as DocKey)
			.onSnapshot(docSnap => {
				setForm(docSnap.data())
			}
	)), [ site, props.match.params.page ]);

	class Submission implements SubmissionSummary {
		id: string
		submittedOn: firebase.firestore.Timestamp
		data: SubmissionSummaryData
		docRef: DocumentReference<{
			key: DocKey;
			value: SubmissionDoc<FieldMap>;
			subCollections: {};
		}>

		constructor (submission: SubmissionSummary) {
			this.id = submission.id
			this.submittedOn = submission.submittedOn
			this.data = submission.data
			this.docRef = db.collection('sites')
				.doc(site as DocKey)
				.collection('forms')
				.doc(props.match.params.page as DocKey)
				.collection('submissions')
				.doc(submission.id as DocKey)
		}

		delete = async () => {
			await this.docRef.delete()
			setCurrentSubmission(undefined)
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
