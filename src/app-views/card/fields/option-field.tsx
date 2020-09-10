import 'firebase/firestore';
import React, { useState } from 'react';
import { FieldStructure } from '../../../types';

interface OptionFieldProps {
	fieldStructure: FieldStructure<'option'>
	currentValue?: string | string[];
	setFieldValue: (value: any) => void;
}

export const OptionField: React.FC<OptionFieldProps> = ({ fieldStructure, currentValue, setFieldValue })  => {
	const [ state, setState ] = useState({ focused: false, searchTerm: '' });
	const { options } = fieldStructure

	const toggleFocus = (focused?: boolean) => setState({ ...state, focused: focused ?? !state.focused });

	const select = (option: string) => {
		setState({ focused: false, searchTerm: '' });
		setFieldValue(option);
	};

	const optionLabels = options.map(option => (typeof option === 'string' ? option : Object.keys(option)[0]));

	const fieldValue = typeof currentValue === 'object' ? currentValue.join(', ') : currentValue;

	const optionElements = optionLabels.map(option => {
		const included = option.toLowerCase().includes(state.searchTerm.toLowerCase());
		const optionElement = (
			<div className="option" onClick={() => select(option)} key={option}>
				{option}
			</div>
		);

		return included ? optionElement : null;
	});

	return (
		<div className="option-field-wrap">
			<div className="option-input-wrap">
				<div className="options-dropdown" onClick={() => toggleFocus()} />
				<input
					className="options-search"
					onFocus={() => toggleFocus(true)}
					value={state.searchTerm}
					onChange={e => setState({ ...state, searchTerm: e.target.value })}
				/>
				<div className="options-selected" onClick={() => toggleFocus()}>
					{fieldValue}
				</div>
			</div>
			{state.focused ? <div className="options-wrap">{optionElements}</div> : null}
		</div>
	);
};
