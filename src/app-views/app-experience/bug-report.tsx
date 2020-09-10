import React, { useState } from 'react';
import firebase from '../../firebase';
import { AsyncButton } from '../card/async-button/async-button';
import { TextField } from '../card/fields/text-field';

interface BugReportProps {
	close: () => void;
}

interface FormState {
	name?: string;
	description?: string;
	recreation?: string;
}

export const BugReport: React.FC<BugReportProps> = ({ close }) => {
	const [ state, setState ] = useState<FormState>({});
	const [ error, setError ] = useState<string>('');

	const submitReport = async () => {
		await firebase.firestore().collection('appExperience/bugs/bugReports').add(state);
		close();
	};

	return (
		<section className="scrimming">
			<div className="card">
				<div className="card-head">
					<button className="card-close" onClick={close} />
					<h2>Bug Report</h2>
				</div>

				<div className="card-content">
					<b>Name</b>
					<TextField
						fieldStructure={{ type: 'text', name: 'name', multiline: false }}
						currentValue={state.name}
						setValue={name => setState({ ...state, name })}
					/>

					<b>Description</b>
					<TextField
						fieldStructure={{ type: 'text', name: 'description', multiline: true }}
						currentValue={state.description}
						setValue={description => setState({ ...state, description })}
					/>

					<b>Recreation Steps</b>
					<TextField
						fieldStructure={{ type: 'text', name: 'recreation', multiline: true }}
						currentValue={state.recreation}
						setValue={recreation => setState({ ...state, recreation })}
					/>
				</div>

				{error}

				<div className="card-actions">
					<AsyncButton name="save" action={submitReport} errorAction={setError} />
				</div>
			</div>
		</section>
	);
};
