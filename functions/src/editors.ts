import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { DocKey, EditorSummary } from '../../firestore';
import { db } from './index';

exports.AggregateEditors = functions.firestore
	.document('sites/{site}/editors/{uid}')
	.onWrite(async (change, context) => {
		const { site, uid } = context.params;
		const siteRef = db.collection('sites').doc(site as DocKey);

		if (change.before.exists && change.after.exists) {
			//update trigger// √
			return db.runTransaction(async transaction => {
				const siteDoc = await transaction.get(siteRef);

				const { name, email, role, emailVerified } = change.after.data()!;
				const editor: EditorSummary = {
					name,
					email,
					role,
					uid,
					emailVerified: emailVerified || false
				};

				const editorsArray: EditorSummary[] = siteDoc.data()!.editors;
				const editorIndex = editorsArray.findIndex(
					editorSummary => editorSummary.uid === uid
				);

				editorsArray.splice(editorIndex, 1, editor);
				transaction.update(siteRef, { editors: editorsArray });
			});
		} else if (change.after.exists && !change.before.exists) {
			//create trigger// √
			const { name, email, role } = change.after.data()!;
			const editor: EditorSummary = { name, email, role, uid, emailVerified: false };

			return siteRef.update({ editors: admin.firestore.FieldValue.arrayUnion(editor) });
		} else {
			//delete trigger// √
			const { name, email, role, emailVerified } = change.before.data()!;
			const editor: EditorSummary = {
				name,
				email,
				role,
				uid,
				emailVerified: emailVerified || false
			};

			return siteRef.update({ editors: admin.firestore.FieldValue.arrayRemove(editor) });
		}
	});

exports.acceptCollaborationInvitation = functions.https.onCall(async (data, context) => {
	return db.runTransaction(async transaction => {});
});

exports.declineCollaborationInvite = functions.https.onCall(async (data, context) => {
	return db.runTransaction(async transaction => {});
});
