import React from 'react';
import { TableItem } from './item/table-item';
import { Loader } from './states/loading-state';
import './table.css';

interface TableProps <T extends { [key: string]: any }> {
	type: 'collections' | 'collection' | 'forms' | 'form' | 'editors';
	fieldMap?: (keyof T | { [k in keyof T]: string })[]
	items?: T[];
	itemClickHandler: string | ((item: T) => void);
	included: (item: T) => boolean
}

export const Table = <T extends { [key: string]: any }> (props: TableProps<T>) => {
	const { type, fieldMap, items, itemClickHandler, included } = props
	const fields = fieldMap ? fieldMap.map(field => (typeof field === 'string' ? field : Object.keys(field)[0])) : undefined
	const tableFields = fields ? fields.slice(0, 4) : undefined
	
	const headLabels = tableFields ? tableFields.map(field => <b key={field} >{field}</b>) : null;
	const tableItems = items && fieldMap ? items.map((item, i) => {
		return included(item) ? <TableItem type={type} fieldMap={fieldMap} item={item} clickHandler={itemClickHandler} key={i} /> : null
	}) : null

	return (
		<>
			<div className={`table-head ${type}`}>{headLabels}</div>
			<div className="table">{tableItems || <Loader />}</div>
		</>
	);
};
