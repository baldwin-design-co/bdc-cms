import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { CollectionDoc, FieldStructure, FieldStructures, ItemData, ItemStatus, ItemSummary } from '../../../firestore';
import { DataTable, FormModal, PageHeader } from 'bdc-components';
import { NoteAddOutlined as NewItemIcon } from '@material-ui/icons';
import { authContext } from '../../context/auth-context';
import firebase from '../../firebase';
import { AppView } from '../app-view';
import { formatDate } from './format-date';

export const CollectionView: React.FC<RouteComponentProps<{ page: string }>> = props => {
	const { site } = useContext(authContext);

	const [ loading, setLoading ] = useState(true)
	const [ searchTerm, setSearchTerm ] = useState('')
	const [ currentItem, setCurrentItem ] = useState<Item | NewItem | undefined>()
	const [ collection, setCollection ] = useState<CollectionDoc | undefined>()

	useEffect(() => (
		firebase.firestore().collection('sites')
			.doc(site)
			.collection('collections')
			.doc(props.match.params.page)
			.onSnapshot(docSnap => {
				setCollection(docSnap.data() as CollectionDoc);
				setLoading(false)
			}
		)),
		[ site, props.match.params.page ]
	);

	class Item implements ItemSummary {
		id: string;
		data: ItemData;
		name: string;
		status: ItemStatus;
		modified: firebase.firestore.Timestamp;

		constructor (itemSummary: ItemSummary) {
			this.id = itemSummary.id
			this.data = itemSummary.data
			this.name = itemSummary.name
			this.status = itemSummary.status
			this.modified = itemSummary.modified
		}

		save = () => {}

		Modal = () => null
	}

	class NewItem {
		data: ItemData
		status = 'published'

		constructor (fieldStructures: FieldStructures) {
			const defaultValue = (field: FieldStructure): string | string[] | null => {
				if (field.type === 'text') return '';
				if (field.type === 'option' && !field.multi) return null;
				if (field.type === 'option' && field.multi) return [];
				if (field.type === 'date') return null;
				if (field.type === 'file') return null;
				return null;
			};
	
			const fields = Object.keys(fieldStructures);
			
			this.data = fields.reduce((acc: ItemData, field) => {
				acc[field] = defaultValue(fieldStructures[field])
				return acc
			}, {})
		}

		publish = () => {}

		Modal = () => (
			<FormModal
				name='New Item'
				fieldStructures={collection?.fieldStructures || {}}
				fieldOrder={collection?.fieldOrder}
				onClose={() => setCurrentItem(undefined)}
				actions={[ { label: 'Publish', action: this.publish, validate: true } ]}
			/>
		)
	}

	const included = (item: Item) => 
		item.name.toLowerCase().includes(searchTerm.toLowerCase())

	const getTableItems = (items: Item[]) => {
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

	const items = collection?.items.map(item => new Item(item)) || []

	return (
		<AppView>
			<PageHeader
				title={collection?.name || props.match.params.page}
				action={() => setCurrentItem(new NewItem(collection?.fieldStructures || {}))}
				actionLabel={<NewItemIcon fontSize='small' />}
				search={setSearchTerm}
			/>

			<DataTable
				items={getTableItems(items)}
				fieldMap={{
					name: { columnTemplate: 3 },
					status: { columnTemplate: 1 },
					modified: { columnTemplate: 2 }
				}}
				loading={loading}
				identifyingField='name'
				itemClickHandler={tableItem => {
					const item = items.find(item => item.id === tableItem.id)
					setCurrentItem(item)
				}}
			/>

			{currentItem && <currentItem.Modal />}
		</AppView>
	);
};
