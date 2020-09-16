import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { SubmissionSummary, FormSummary, DocKey } from '../../firestore';
import { db } from './index';
import { formatDate } from './index';

exports.AggregateSubmissions = functions.firestore
	.document('sites/{site}/forms/{form}/submissions/{id}')
	.onWrite(async (change, context) => {
		const { site, form, id } = context.params;
		const siteRef = db.collection('sites').doc(site as DocKey);
		const formRef = db
			.collection('sites')
			.doc(site as DocKey)
			.collection('forms')
			.doc(form as DocKey);

		if (change.after.exists && !change.before.exists) {
			//create trigger// √
			return db.runTransaction(async transaction => {
				const siteDoc = await transaction.get(siteRef);

				const data = change.after.data()!;
				const submittedOn = formatDate(change.after.createTime!.toDate());
				const submissionSummary: SubmissionSummary = { id, submittedOn, data };

				const formsArray: FormSummary[] = siteDoc.data()!.forms;
				const formIndex = formsArray.findIndex(
					formSummary => formSummary.name === form
				);

				formsArray[formIndex].submissionCount++;

				transaction.update(formRef, {
					submissions: admin.firestore.FieldValue.arrayUnion(submissionSummary)
				});
				transaction.update(siteRef, { forms: formsArray });
			});
		} else if (change.before.exists && !change.after.exists) {
			//delete trigger// √
			return db.runTransaction(async transaction => {
				const siteDoc = await transaction.get(siteRef);

				const data = change.before.data()!;
				const submittedOn = formatDate(change.before.createTime!.toDate());
				const submissionSummary: SubmissionSummary = { id, submittedOn, data };

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
		//checked// √
		const { site } = context.params;
		const siteRef = db.collection('sites').doc(site);

		const { name, url, submissions } = docSnap.data()!;
		const formSummary: FormSummary = { name, url, submissionCount: submissions.length };
		return siteRef.update({ forms: admin.firestore.FieldValue.arrayUnion(formSummary) });
	});

exports.AggregateFormDelete = functions.firestore
	.document('sites/{site}/forms/{form}')
	.onDelete((docSnap, context) => {
		//checked// √
		const { site } = context.params;
		const siteRef = db.collection('sites').doc(site);

		const { name, url, submissions } = docSnap.data()!;
		const formSummary: FormSummary = { name, url, submissionCount: submissions.length };

		return siteRef.update({ forms: admin.firestore.FieldValue.arrayRemove(formSummary) });
	});
