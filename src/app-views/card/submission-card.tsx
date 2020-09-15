import React, { useState } from 'react';
import { SubmissionSummary } from '../../firebase';
import { AsyncButton } from './async-button/async-button';

interface SubmissionCardProps {
	formName: string;
	submission: SubmissionSummary;
	closeCard: () => void;
	deleteSubmission: () => void;
}

export const SubmissionCard: React.FC<SubmissionCardProps> = ({
	formName,
	submission,
	closeCard,
	deleteSubmission
}) => {
	const [ error, setError ] = useState('');
	const fields = Object.keys(submission.data);
	const cardContent = fields.map(field => (
		<p key={field}>
			<b>{field}: </b>
			{submission.data[field]}
		</p>
	));

	return (
		<section className="scrimming">
			<div className="card">
				<div className="card-head">
					<button className="card-close" onClick={closeCard} />
					<h2>{`${formName} Submission`}</h2>
				</div>

				<div className="card-content">{cardContent}</div>

				{error || null}

				<div className="card-actions">
					<AsyncButton
						name="Delete"
						action={deleteSubmission}
						errorAction={setError}
					/>
				</div>
			</div>
		</section>
	);
};
