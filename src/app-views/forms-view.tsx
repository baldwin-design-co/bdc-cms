import React, { useContext, useState } from 'react';
import { summariesContext } from '../context/summaries-context';
import { AppView } from './app-view';
import { DataTable, PageHeader } from 'bdc-components';
import { InsertDriveFileOutlined as FormIcon } from '@material-ui/icons';
import { FormSummary } from '../../firestore';

export const Forms: React.FC = () => {
	const { forms } = useContext(summariesContext);

	const [ searchTerm, setSearchterm ] = useState('');

	const included = (form: FormSummary) =>
		form.name.toLowerCase().includes(searchTerm.toLowerCase());

	const getTableItems = (forms: FormSummary[]) => {
		const includedForms = forms.filter(included);

		return includedForms.map(form => ({
			id: form.name,
			data: {
				...form,
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
				itemClickHandler={() => {}}
				itemIcon={<FormIcon />}
				identifyingField="name"
			/>
		</AppView>
	);
};
