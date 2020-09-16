import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { authContext } from '../context/auth-context';
import { db } from '../firebase';
import { Header } from './header/header';
import { FormModal, FieldStructures as BDCFieldStructures, DataTable } from 'bdc-components';
import { AppView } from './app-view';
import { formatDate } from '../format-date';
import { CollectionDoc, DocKey, FieldStructures, ItemData, ItemStatus, ItemSummary } from '../../firestore';

interface CurrentItem {
	id?: string
	name?: string
	data: ItemData
	status: ItemStatus
	modified?: firebase.firestore.Timestamp
}

export const Collection: React.FC<RouteComponentProps<{ page: string }>> = props => {
	const { site } = useContext(authContext);

	const [ searchTerm, setSearchTerm ] = useState('')
	const [ currentItem, setCurrentItem ] = useState<CurrentItem | undefined>()
	const [ collection, setCollection ] = useState<CollectionDoc | undefined>()

	useEffect(() => (
		db.collection('sites')
			.doc(site as DocKey)
			.collection('collections')
			.doc(props.match.params.page as DocKey)
			.onSnapshot(docSnap => {
				setCollection(docSnap.data());
			}
		)),
		[ site, props.match.params.page ]
	);

	const included = (item: ItemSummary) => 
		item.name.toLowerCase().includes(searchTerm.toLowerCase())

	const stringifyItemData = (items: ItemSummary[]) => {
		const includedItems = items.filter(included)

		return includedItems.map(item => ({
			...item,
			modified: formatDate(item.modified)
		}))
	}

	const defaultItemOf = (fieldStructures: FieldStructures) => {
		const fields = Object.keys(fieldStructures)
		const item: ItemData = {}

		fields.forEach(field => {
			const fieldStructure = fieldStructures[field]
			let defaultValue: string | string[] | null = null

			if (fieldStructure.type === 'text') defaultValue = '';
			if (fieldStructure.type === 'option' && !fieldStructure.multi) defaultValue = null;
			if (fieldStructure.type === 'option' && fieldStructure.multi) defaultValue = [];
			if (fieldStructure.type === 'date') defaultValue = null;
			if (fieldStructure.type === 'file') defaultValue = null;

			item[field] = defaultValue
		})

		return item
	}

	return (
		<AppView>
			{collection ? 
				<>
					<Header
						title={collection.name}
						returnLink="/collections"
						actionName="collection"
						action={() => {
							setCurrentItem({
								data: defaultItemOf(collection.fieldStructures),
								status: 'published'
							})
						}}
						search={setSearchTerm}
					/>

					<DataTable
						items={stringifyItemData(collection.items)}
						fieldMap={{ name: { columnTemplate: 3 }, status: { columnTemplate: 1 }, modified: { columnTemplate: 2 } }}
						identifyingField='name'
						itemClickHandler={() => {}}
					/>

					{currentItem ? (
						<FormModal
							name={currentItem.name || 'New Item'}
							fieldStructures={collection.fieldStructures as BDCFieldStructures}
							onSubmit={console.log}
							onClose={() => setCurrentItem(undefined)}
						/>
					) : null}
				</>
			: null}
		</AppView>
	);
};
