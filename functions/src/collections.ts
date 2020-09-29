import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { ItemSummary, CollectionSummary, ItemDoc } from '../../firestore';

exports.AggregateItems = functions.firestore
	.document('sites/{site}/collections/{collectionName}/items/{id}')
	.onWrite(async (change, context) => {
		const { site, collectionName, id } = context.params;
		const siteRef = admin.firestore().collection('sites').doc(site);
		const collectionRef = admin
			.firestore()
			.collection(`sites/${site}/collections`)
			.doc(collectionName);

		if (change.before.exists && change.after.exists) {
			//update trigger
			return admin.firestore().runTransaction(async transaction => {
				const [ collectionDoc, siteDoc ] = await Promise.all([
					transaction.get(collectionRef),
					transaction.get(siteRef)
				]);

				const { name, status, data } = change.after.data()! as ItemDoc;
				const modified = change.after.updateTime!;

				const itemsArray: ItemSummary[] = collectionDoc.data()!.items;
				const itemIndex = itemsArray.findIndex(itemSummary => itemSummary.id === id);
				const itemSummary: ItemSummary = { name, id, status, modified, data };

				const collectionsArray: CollectionSummary[] = siteDoc.data()!.collections;
				const collectionIndex = collectionsArray.findIndex(
					collection => collection.name === collectionName
				);
				const collectionSummary: CollectionSummary = {
					...collectionsArray[collectionIndex],
					modified
				};

				itemsArray.splice(itemIndex, 1, itemSummary);
				collectionsArray.splice(collectionIndex, 1, collectionSummary);
				transaction.update(collectionRef, { items: itemsArray });
				transaction.update(siteRef, { collections: collectionsArray });
			});
		} else if (change.after.exists) {
			//create trigger
			return admin.firestore().runTransaction(async transaction => {
				const siteDoc = await transaction.get(siteRef);

				const { name, status, data } = change.after.data()! as ItemDoc;
				const modified = change.after.createTime!;
				const itemSummary: ItemSummary = { name, id, status, modified, data };

				const collectionsArray: CollectionSummary[] = siteDoc.data()!.collections;
				const collectionIndex = collectionsArray.findIndex(
					collection => collection.name === collectionName
				);
				const itemCount = collectionsArray[collectionIndex].itemCount + 1;
				const collectionSummary: CollectionSummary = {
					...collectionsArray[collectionIndex],
					modified,
					itemCount
				};

				collectionsArray.splice(collectionIndex, 1, collectionSummary);
				transaction.update(collectionRef, {
					items: admin.firestore.FieldValue.arrayUnion(itemSummary)
				});
				transaction.update(siteRef, { collections: collectionsArray });
			});
		} else {
			//delete trigger
			return admin.firestore().runTransaction(async transaction => {
				const siteDoc = await transaction.get(siteRef);

				const { name, status, data } = change.before.data()! as ItemDoc;
				const modified = change.before.updateTime || change.before.createTime!;
				const itemSummary: ItemSummary = { name, id, status, modified, data };

				const collectionsArray: CollectionSummary[] = siteDoc.data()!.collections;
				const collectionIndex = collectionsArray.findIndex(
					collection => collection.name === collectionName
				);
				const itemCount = collectionsArray[collectionIndex].itemCount - 1;
				const collectionSummary: CollectionSummary = {
					...collectionsArray[collectionIndex],
					modified,
					itemCount
				};

				collectionsArray.splice(collectionIndex, 1, collectionSummary);
				transaction.update(collectionRef, {
					items: admin.firestore.FieldValue.arrayRemove(itemSummary)
				});
				transaction.update(siteRef, { collections: collectionsArray });
			});
		}
	});

exports.AggregateCollectionsCreate = functions.firestore
	.document('sites/{site}/collections/{collection}')
	.onCreate((docSnap, context) => {
		const { site } = context.params;
		const siteRef = admin.firestore().collection('sites').doc(site);

		const { name, url, items } = docSnap.data()!;
		const dateCreated = docSnap.createTime;
		const collectionSummary: CollectionSummary = {
			name,
			url,
			itemCount: items.length,
			modified: dateCreated
		};

		return siteRef.update({
			collections: admin.firestore.FieldValue.arrayUnion(collectionSummary)
		});
	});

exports.AggregateCollectionsDelete = functions.firestore
	.document('sites/{site}/collections/{collection}')
	.onDelete((docSnap, context) => {
		const { site } = context.params;
		const siteRef = admin.firestore().collection('sites').doc(site);

		const { name, url, items } = docSnap.data()!;
		const dateModified = docSnap.updateTime;
		const collectionSummary: CollectionSummary = {
			name,
			url,
			itemCount: items.length,
			modified: dateModified
		};

		return siteRef.update({
			collections: admin.firestore.FieldValue.arrayRemove(collectionSummary)
		});
	});
