import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { authContext } from '../../context/auth-context';
import { db } from '../../firebase';
import { FormModal, DataTable, InitialValues, PageHeader } from 'bdc-components';
import { AppView } from '../app-view';
import { formatDate } from './format-date';
import { CollectionDoc, DocKey, FieldStructure, FieldStructures, ItemData, ItemStatus, ItemSummary } from '../../../firestore';
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

	const getTableItems = (items: ItemSummary[]) => {
		const includedItems = items.filter(included)

		return includedItems.map(item => ({
			data: {
				name: item.name,
				status: item.status,
				modified: formatDate(item.modified)
			},
			id: item.id
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
				action={() => {
					setCurrentItem({
						data: defaultItem(collection?.fieldStructures || {}),
						status: 'published'
					})
				}}
				actionLabel={<NewItemIcon fontSize='small' />}
				search={setSearchTerm}
			/>

			<DataTable
				items={getTableItems(collection?.items || [])}
				fieldMap={{
					name: { columnTemplate: 3 },
					status: { columnTemplate: 1 },
					modified: { columnTemplate: 2 }
				}}
				loading={loading}
				identifyingField='name'
				itemClickHandler={tableItem => {
					const items = collection?.items || []
					const item = items.find(item => item.id === tableItem.id)
					setCurrentItem(item)
				}}
			/>

			{currentItem ? (
				<FormModal
					name={currentItem.name || 'New Item'}
					fieldStructures={collection?.fieldStructures || {}}
					fieldOrder={collection?.fieldOrder}
					initialValues={currentItem.data as InitialValues<{}>}
					onClose={() => setCurrentItem(undefined)}
					actions={[ { label: 'Submit', validate: true, action: console.log } ]}
				/>
			) : null}
		</AppView>
	);
};
