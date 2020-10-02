import React, { useContext, useState } from 'react';
import { summariesContext } from '../../context/summaries-context';
import { AppView } from '../app-view';
import { DataTable, PageHeader } from 'bdc-components';
import { LibraryBooksOutlined as FormIcon } from '@material-ui/icons';
import { FormSummary } from '../../firestore';
import { authContext } from '../../context/auth-context';
import { useHistory } from 'react-router-dom';

export const FormsView: React.FC = () => {
	const { site } = useContext(authContext);
	const { forms, loaded } = useContext(summariesContext);
	const history = useHistory();

	const [ searchTerm, setSearchterm ] = useState('');

	const included = (form: FormSummary) =>
		form.name.toLowerCase().includes(searchTerm.toLowerCase());

	const getTableItems = (forms: FormSummary[]) => {
		const includedForms = forms.filter(included);

		return includedForms.map(form => ({
			id: form.name,
			data: {
				name: form.name,
				url: site + form.url,
				submissionCount: form.submissionCount.toString()
			}
		}));
	};

	return (
		<AppView>
			<PageHeader title="Forms" search={setSearchterm} />

			<DataTable
				fieldMap={{
					name: { columnTemplate: 2 },
					url: { columnTemplate: 3 },
					submissionCount: { label: 'Submissions' }
				}}
				items={getTableItems(forms || [])}
				itemClickHandler={form =>
					history.push(`${process.env.PUBLIC_URL}/forms/${form.id}`)}
				itemIcon={<FormIcon />}
				loading={!loaded}
				identifyingField="name"
			/>
		</AppView>
	);
};
