import React from 'react';

type FieldTypes = 'number' | 'email' | 'phone' | 'url'
type FieldValue <T extends FieldTypes> = T extends { type: 'number' } ? number | undefined : string | undefined 

interface TypeFieldProps<T extends FieldTypes >{
	name: string
	type: T
	currentValue: FieldValue<T>
	setFieldValue: (value: FieldValue<T>) => void
}

export const TypeField: React.FC<TypeFieldProps<FieldTypes>> = props => {
	const { currentValue, setFieldValue } = props

	return (
		<div key={props.name}>
			<b>{props.name}</b>
			<div className="field-wrap" key={props.name}>
			<div className={`field-icon ${props.type}`} />
			<input
				type={props.type === 'phone' ? 'tel' : props.type}
				value={currentValue}
				onChange={e => setFieldValue(e.target.value)}
			/>
		</div>
		</div>
	);
};
