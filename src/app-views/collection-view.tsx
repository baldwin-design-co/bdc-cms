/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { authContext } from '../context/auth-context';
import firebase from '../firebase';
import { FieldStructure, FieldStructures } from 'bdc-components'
import { Header } from './header/header';
import { SideBar } from './sidebar/sidebar';
import { Table } from './table/table';
import { FormModal } from 'bdc-components';

export type ItemDataValue <T extends FieldStructure = FieldStructure> =
	T extends { type: 'text' } ? string
	: T extends { type: 'date', required: true } ? Date
	: T extends { type: 'date' } ? Date | null
	: T extends { type: 'option', required: true } ? string | string[]
	: T extends { type: 'option' } ? string | string[] | null
	: T extends { type: 'file', required: true } ? string
	: T extends { type: 'file' } ? string | null
	: string | string[] | Date | File | null

type g = ItemDataValue

export type ItemData <T extends FieldStructures = FieldStructures> =
	{ [k in keyof T]: ItemDataValue<T[k]> }

export interface ItemDoc <T extends FieldStructures = FieldStructures> {
	status: 'published' | 'archived';
	data: { [k in keyof T]: ItemDataValue<T[k]> };
}

export interface ItemSummary <T extends FieldStructures = FieldStructures> {
	name: string;
	modified: string;
	status: 'published' | 'archived';
	data: ItemData<T>;
	id: string;
}

export const Collection: React.FC<RouteComponentProps<{ page: string }>> = props => {
	const { site } = useContext(authContext);

	const [ searchTerm, search ] = useState('')
	const [ currentItem, setCurrentItem ] = useState<ItemData | null>(null)
	const [ collection, setCollection ] = useState<{
		name: string,
		fieldStructures?: FieldStructures,
		items?: ItemSummary[]
	}>({
		name: props.match.params.page,
		fieldStructures: undefined,
		items: undefined
	})

	useEffect(
		() => (
			firebase.firestore().collection(`sites/${site}/collections`).doc(collection.name).onSnapshot(docSnap => {
				if (docSnap.exists) {
					const { fieldStructures, items } = docSnap.data()!;
					setCollection({ ...collection, fieldStructures, items });
				}
			})
		),
		[ site, collection.name ]
	);

	const defaultItem = (fieldStructures?: FieldStructures) => {
		const fields = Object.keys(fieldStructures)
		const item: ItemData = {}

		const defaultValueOf = (field: FieldStructure): string | string[] | null => {
			if (field.type === 'text') return '';
			if (field.type === 'option' && !field.multi) return null;
			if (field.type === 'option' && field.multi) return [];
			if (field.type === 'date') return null;
			if (field.type === 'file') return null;
			return null;
		};

		fields.forEach(field => {
			item[field] = defaultValueOf(fieldStructures[field]);
		})

		return item
	}

	return (
		<section className="app">
			<SideBar />
			<div className="container">
				<Header
					title={collection.name}
					back="/collections"
					actionName="collection"
					action={() => setCurrentItem(defaultItem(collection.fieldStructures))}
					search={search}
				/>

				<Table
					type="collection"
					fieldMap={[ 'name', 'status', 'modified' ]}
					items={collection.items}
					itemClickHandler={setCurrentItem}
					included={item => item.name.toLowerCase().includes(searchTerm.toLowerCase())}
				/>

				{currentItem && collection.fieldStructures ? (
					<FormModal
						name={currentItem.data.name || 'New Item'}
						fieldStructures={collection.fieldStructures}
						handleSubmit={console.log}
						handleClose={() => setCurrentItem(null)}
					/>
				) : null}
			</div>
		</section>
	);
};
