import React, { useContext, useState } from 'react';
import { summariesContext } from '../../context/summaries-context';
import { DataTable, PageHeader } from 'bdc-components';
import { AppView } from '../app-view';
import { LayersOutlined as CollectionsIcon } from '@material-ui/icons';
import { formatDate } from './format-date';
import { authContext } from '../../context/auth-context';
import { CollectionSummary } from '../../firestore';
import { useHistory } from 'react-router-dom';

export const CollectionsView = () => {
	const { site } = useContext(authContext);
	const { collections } = useContext(summariesContext);

	const [ searchTerm, setSearchTerm ] = useState('');
	const history = useHistory();

	const included = (collection: CollectionSummary) =>
		collection.name.toLowerCase().includes(searchTerm.toLowerCase());

	const getTableItems = (collections: CollectionSummary[]) => {
		const includedCollections = collections.filter(included);

		return includedCollections.map(collection => ({
			id: collection.name,
			data: {
				name: collection.name,
				url: site + collection.url,
				itemCount: collection.itemCount.toString(),
				modified: formatDate(collection.modified)
			}
		}));
	};

	return (
		<AppView>
			<PageHeader title="Collections" search={setSearchTerm} />

			<DataTable
				items={getTableItems(collections || [])}
				fieldMap={{
					name: { label: 'Name', columnTemplate: 2 },
					url: { label: 'Url', columnTemplate: 4 },
					itemCount: { label: 'Items' },
					modified: { label: 'Modified', columnTemplate: 2 }
				}}
				loading={!collections}
				identifyingField="name"
				itemIcon={<CollectionsIcon />}
				itemClickHandler={collection => history.push(`/collections/${collection.id}`)}
			/>
		</AppView>
	);
};
