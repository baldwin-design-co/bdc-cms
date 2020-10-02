import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { SubmissionSummary, FormSummary, SubmissionDoc } from './index';

exports.AggregateSubmissions = functions.firestore
	.document('sites/{site}/forms/{form}/submissions/{id}')
	.onWrite(async (change, context) => {
		const { site, form, id } = context.params;
		const siteRef = admin.firestore().collection('sites').doc(site);
		const formRef = admin
			.firestore()
			.collection('sites')
			.doc(site)
			.collection('forms')
			.doc(form);

		if (change.after.exists && !change.before.exists) {
			//create trigger// √
			return admin.firestore().runTransaction(async transaction => {
				const siteDoc = await transaction.get(siteRef);

				const data: SubmissionDoc = change.after.data()!;
				const submittedOn = change.after.createTime!;
				const submissionSummary: SubmissionSummary = { id, submittedOn, data };

				const formSummaryArray: FormSummary[] = siteDoc.data()!.forms;
				const formSummaryIndex = formSummaryArray.findIndex(
					formSummary => formSummary.name === form
				);

				formSummaryArray[formSummaryIndex].submissionCount++;

				transaction.update(formRef, {
					submissions: admin.firestore.FieldValue.arrayUnion(submissionSummary)
				});
				transaction.update(siteRef, { forms: formSummaryArray });
			});
		} else if (change.before.exists && !change.after.exists) {
			//delete trigger// √
			return admin.firestore().runTransaction(async transaction => {
				const siteDocRequest = transaction.get(siteRef);
				const formDocRequest = transaction.get(formRef);

				const [ siteDoc, formDoc ] = await Promise.all([
					siteDocRequest,
					formDocRequest
				]);

				const submissionsArray: SubmissionSummary[] = formDoc.data()!.submissions;
				const submissionSummary = submissionsArray.find(
					submission => submission.id === id
				);

				const formsArray: FormSummary[] = siteDoc.data()!.forms;
				const formIndex = formsArray.findIndex(
					formSummary => formSummary.name === form
				);

				formsArray[formIndex].submissionCount--;

				transaction.update(formRef, {
					submissions: admin.firestore.FieldValue.arrayRemove(submissionSummary)
				});
				transaction.update(siteRef, { forms: formsArray });
			});
		}
	});

exports.AggregateFormCreate = functions.firestore
	.document('sites/{site}/forms/{form}')
	.onCreate((docSnap, context) => {
		const { site } = context.params;
		const siteRef = admin.firestore().collection('sites').doc(site);

		const { name, url, submissions } = docSnap.data()!;
		const formSummary: FormSummary = { name, url, submissionCount: submissions.length };

		return siteRef.update({ forms: admin.firestore.FieldValue.arrayUnion(formSummary) });
	});

exports.AggregateFormDelete = functions.firestore
	.document('sites/{site}/forms/{form}')
	.onDelete((docSnap, context) => {
		const { site } = context.params;
		const siteRef = admin.firestore().collection('sites').doc(site);

		const { name, url, submissions } = docSnap.data()!;
		const formSummary: FormSummary = { name, url, submissionCount: submissions.length };

		return siteRef.update({ forms: admin.firestore.FieldValue.arrayRemove(formSummary) });
	});
