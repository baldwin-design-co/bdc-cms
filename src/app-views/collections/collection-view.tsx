import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { CollectionDoc, FieldStructure, FieldStructures, ItemData, ItemDoc, ItemStatus, ItemSummary } from '../../../firestore';
import { DataTable, FormErrors, FormModal, FormValues, PageHeader } from 'bdc-components';
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

	const uploadFile = (storageRef: firebase.storage.Reference, file: File) => {
		return new Promise((resolve, reject) => {
			const uploadTask = storageRef.put(file);
	
			const onSnapshot = (snap: firebase.storage.UploadTaskSnapshot) => {};
			const onError = (error: Error) => reject(error);
			const onSuccess = async () => {
				const downloadUrl = await uploadTask.snapshot.ref.getDownloadURL();
				resolve(downloadUrl as string);
			};
	
			uploadTask.on('state_changed', onSnapshot, onError, onSuccess);
		});
	};

	const structureData = async (values: FormValues) => {
		const fieldStructures = collection?.fieldStructures || {}
		const fields = Object.keys(fieldStructures)
		const item: ItemDoc = {
			name: values.name as string,
			status: 'published',
			data: {}
		}

		for (const field of fields) {
			const fieldStructure = fieldStructures[field]
			const value = values[field]

			if (fieldStructure.type === 'file' && value instanceof File) {
				const storageRef = firebase.storage().ref().child(`${site}/${collection?.name}/${values.name}`);
				const url = await uploadFile(storageRef, value)
				
				item.data[field] = url as string
			} else if (fieldStructure.type === 'date' && value instanceof Date) {
				item.data[field] = firebase.firestore.Timestamp.fromDate(value)
			} else {
				item.data[field] = value as string | string[] | null
			}
		}

		return item
	}
	
	const validateFileSize = (values: FormValues) => {
		const fieldStructures = collection?.fieldStructures || {}
		const validation: FormErrors = {
			valid: true,
			errors: {}
		}

		Object.keys(fieldStructures).forEach(field => {
			const fieldStructure = fieldStructures[field]
			const value = values[field] 

			if (fieldStructure.type === 'file' && value instanceof File) {
				if (value.size > 2000000) validation.errors[field] = 'The max file size is 2MB'
			}
		})

		return validation
	}

	class NewItem {
		data: ItemData
		status: ItemStatus = 'published'

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

		publish = async (values: FormValues) => {
			const itemDoc = await structureData(values)
			
			await firebase.firestore()
				.collection('sites')
				.doc(site)
				.collection('collections')
				.doc(props.match.params.page)
				.collection('items')
				.add(itemDoc)
			
			setCurrentItem(undefined)
		}

		Modal = () => (
			<FormModal
				name='New Item'
				fieldStructures={collection?.fieldStructures || {}}
				fieldOrder={collection?.fieldOrder}
				onClose={() => setCurrentItem(undefined)}
				actions={[ { label: 'Publish', action: this.publish, validate: true } ]}
				validate={validateFileSize}
			/>
		)
	}

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
