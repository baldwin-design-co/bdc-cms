import React, { useContext, useState } from 'react';
import { summariesContext } from '../context/summaries-context';
import { FormSummary } from '../types';
import { Header } from './header/header';
import { SideBar } from './sidebar/sidebar';
import { Table } from './table/table';

interface FormsViewState {
	searchTerm: string;
	forms?: FormSummary[];
}

export const Forms: React.FC = () => {
	const { forms } = useContext(summariesContext);
	const [ state, setState ] = useState<FormsViewState>({
		searchTerm: '',
		forms: forms
	});

	const search = (searchTerm: string) => setState({ ...state, searchTerm });
	const included = (form: FormSummary) => form.name.toLowerCase().includes(state.searchTerm.toLowerCase());

	return (
		<section className="app">
			<SideBar />
			<div className="container">
				<Header title="Forms" search={search} />
				<Table
					type="forms"
					fieldMap={[ 'name', 'url', 'submissionCount' ]}
					items={state.forms}
					itemClickHandler="name"
					included={included}
				/>
			</div>
		</section>
	);
};
