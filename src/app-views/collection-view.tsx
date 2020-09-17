import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { authContext } from '../context/auth-context';
import { db } from '../firebase';
import { FormModal, DataTable, InitialValues, PageHeader } from 'bdc-components';
import { AppView } from './app-view';
import { formatDate } from '../format-date';
import { CollectionDoc, DocKey, FieldStructure, FieldStructures, ItemData, ItemStatus, ItemSummary } from '../../firestore';
import { NoteAddOutlined as NewItemIcon } from '@material-ui/icons'

interface CurrentItem {
	id?: string
	name?: string
	data: ItemData
	status: ItemStatus
	modified?: firebase.firestore.Timestamp
}

export const Collection: React.FC<RouteComponentProps<{ page: string }>> = props => {
	const { site } = useContext(authContext);

	const [ loading, setLoading ] = useState(true)
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
				setLoading(false)
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

	const defaultItem = <T extends FieldStructures>(fieldStructures: T) => {
		const defaultValue = (field: FieldStructure): string | string[] | null => {
			if (field.type === 'text') return '';
			if (field.type === 'option' && !field.multi) return null;
			if (field.type === 'option' && field.multi) return [];
			if (field.type === 'date') return null;
			if (field.type === 'file') return null;
			return null;
		};

		const fields = Object.keys(fieldStructures);
		
		return fields.reduce((acc: ItemData, field) => {
			acc[field] = defaultValue(fieldStructures[field])
			return acc
		}, {})
	};

	return (
		<AppView>
			<PageHeader
				title={collection?.name || props.match.params.page}
				returnLink="/collections"
				action={() => {
					setCurrentItem({
						data: defaultItem(collection?.fieldStructures || {}),
						status: 'published'
					})
				}}
				actionLabel={<NewItemIcon />}
				search={setSearchTerm}
			/>

			<DataTable
				items={stringifyItemData(collection?.items || [])}
				fieldMap={{
					name: { columnTemplate: 3 },
					status: { columnTemplate: 1 },
					modified: { columnTemplate: 2 }
				}}
				loading={loading}
				identifyingField='name'
				itemClickHandler={v => {}}
			/>

			{currentItem ? (
				<FormModal
					name={currentItem.name || 'New Item'}
					fieldStructures={collection?.fieldStructures || {}}
					initialValues={currentItem.data as InitialValues<{}>}
					onSubmit={console.log}
					onClose={() => setCurrentItem(undefined)}
				/>
			) : null}
		</AppView>
	);
};
