import React, { useContext, useState } from 'react';
import { summariesContext } from '../context/summaries-context';
import { DataTable } from 'bdc-components';
import { CollectionSummary } from '../firebase';
import { AppView } from './app-view';
import { Header } from './header/header';
import { LayersOutlined as CollectionsIcon } from '@material-ui/icons';
import { formatDate } from '../format-date';

export const Collections = () => {
	const { collections } = useContext(summariesContext);
	const [ searchTerm, setSearchTerm ] = useState('');

	const included = (collection: CollectionSummary) =>
		collection.name.toLowerCase().includes(searchTerm.toLowerCase());

	const stringifyCollectionData = (collections: CollectionSummary[]) => {
		const includedCollections = collections.filter(included);

		return includedCollections.map(collection => ({
			...collection,
			modified: formatDate(collection.modified),
			itemCount: collection.itemCount.toString()
		}));
	};

	return (
		<AppView>
			<Header title="Collections" search={setSearchTerm} />

			<DataTable
				items={stringifyCollectionData(collections || [])}
				fieldMap={{
					name: { label: 'Name', columnTemplate: 2 },
					url: { label: 'Url', columnTemplate: 4 },
					itemCount: { label: 'Items' },
					modified: { label: 'Modified', columnTemplate: 2 }
				}}
				identifyingField="name"
				itemIcon={<CollectionsIcon />}
				itemClickHandler={() => {}}
			/>
		</AppView>
	);
};
