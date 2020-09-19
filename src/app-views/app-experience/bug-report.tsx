import React from 'react';
import { FormModal } from 'bdc-components';

interface BugReportProps {
	close: () => void;
}

export const BugReport: React.FC<BugReportProps> = ({ close }) => (
	<FormModal
		name="Bug Report"
		fieldStructures={{
			name: { type: 'text', required: true },
			description: { type: 'text', multiline: true, required: true },
			recreation: { type: 'text', multiline: true, required: true }
		}}
		actions={[ { label: 'submit', validate: true, action: console.log } ]}
		onClose={close}
	/>
);
