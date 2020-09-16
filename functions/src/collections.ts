import { formatDate } from './index';
import { ItemSummary, CollectionSummary, DocKey } from '../../firestore';
import { db } from './index';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

exports.AggregateItems = functions.firestore
	.document('sites/{site}/collections/{collectionName}/items/{id}')
	.onWrite(async (change, context) => {
		const { site, collectionName, id } = context.params;
		const collectionRef = db
			.collection('sites')
			.doc(site as DocKey)
			.collection('collections')
			.doc(collectionName as DocKey);
		const siteRef = db.collection('sites').doc(site as DocKey);

		if (change.before.exists && change.after.exists) {
			//update trigger// √
			return db.runTransaction(async transaction => {
				const [ collectionDoc, siteDoc ] = await Promise.all([
					transaction.get(collectionRef),
					transaction.get(siteRef)
				]);

				const { status, data } = change.after.data()!;
				const modified = formatDate(change.after.updateTime!.toDate());

				const itemsArray: ItemSummary[] = collectionDoc.data()!.items;
				const itemIndex = itemsArray.findIndex(itemSummary => itemSummary.id === id);
				const itemSummary: ItemSummary = {
					name: data.name,
					id,
					status,
					modified,
					data
				};

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
			//create trigger// √
			return db.runTransaction(async transaction => {
				const siteDoc = await transaction.get(siteRef);

				const { status, data } = change.after.data()!;
				const modified = formatDate(change.after.createTime!.toDate());
				const itemSummary: ItemSummary = {
					name: data.name,
					id,
					status,
					modified,
					data
				};

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
			//delete trigger// √
			return db.runTransaction(async transaction => {
				const siteDoc = await transaction.get(siteRef);

				const { status, data } = change.before.data()!;
				const modified = formatDate(change.before.updateTime!.toDate());
				const itemSummary: ItemSummary = {
					name: data.name,
					id,
					status,
					modified,
					data
				};

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
		//checked// √
		const { site } = context.params;
		const siteRef = db.collection('sites').doc(site);

		const { name, url, items } = docSnap.data()!;
		const dateCreated = formatDate(docSnap.createTime.toDate());
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
		//checked// √
		const { site } = context.params;
		const siteRef = db.collection('sites').doc(site);

		const { name, url, items } = docSnap.data()!;
		const dateModified = formatDate(docSnap.updateTime.toDate());
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
