import React, { useContext, useState } from 'react';
import { summariesContext } from '../context/summaries-context';
import { CollectionSummary } from '../types';
import { Header } from './header/header';
import { SideBar } from './sidebar/sidebar';
import { Table } from './table/table';

interface CollectionsViewState {
	collections?: CollectionSummary[];
	searchTerm: string;
}

export const Collections = () => {
	const { collections } = useContext(summariesContext);
	const [ state, setState ] = useState<CollectionsViewState>({ collections, searchTerm: '' });

	const search = (searchTerm: string) => setState({ ...state, searchTerm });
	const included = (collection: CollectionSummary) =>
		collection.name.toLowerCase().includes(state.searchTerm.toLowerCase());

	return (
		<section className="app">
			<SideBar />
			<div className="container">
				<Header title="Collections" search={search} />

				<Table
					type="collections"
					fieldMap={[ 'name', 'url', { items: 'itemCount' }, 'modified' ]}
					items={collections}
					itemClickHandler="name"
					included={included}
				/>
			</div>
		</section>
	);
};
