import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

exports.linkUserToSite = functions.auth.user().onCreate(async user => {
	const { email } = user;
	const sites = await admin
		.firestore()
		.collection('sites')
		.where('editors', 'array-contains', email)
		.get();

	if (!sites.empty) {
		const siteDoc = sites.docs[0];
		const site = siteDoc.id;
		console.log(`${site}: ${email}`);
		admin.auth().setCustomUserClaims(user.uid, { site });
	} else {
		console.log(`${email} rejected`);
		admin.auth().deleteUser(user.uid);
	}
});
