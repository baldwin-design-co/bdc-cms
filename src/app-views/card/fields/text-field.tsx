import React from 'react';
import { FieldStructure } from '../../../types';

interface TextFieldProps {
	fieldStructure: FieldStructure<'text'>;
	currentValue: string | undefined;
	setValue: (value: string) => void;
}

export const TextField: React.FC<TextFieldProps> = ({ fieldStructure, currentValue, setValue }) => {
	return fieldStructure.multiline ? (
		<textarea value={currentValue} onChange={e => setValue(e.target.value)} />
	) : (
		<input value={currentValue} onChange={e => setValue(e.target.value)} />
	);
};
