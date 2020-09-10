import React from 'react';
import { Link } from 'react-router-dom';
import './items.css';

type Item =
	| { [key: string]: string | number | boolean }
	| { [key: string]: any; data?: { [key: string]: string | number | boolean } };

interface TableItemProps {
	type: 'collections' | 'collection' | 'forms' | 'form' | 'editors';
	fieldMap: (string | { [key: string]: string })[];
	item: Item;
	clickHandler: string | ((item: any) => void);
}

export const TableItem: React.FC<TableItemProps> = ({ type, fieldMap, item, clickHandler }) => {
	const fields = fieldMap.map(field => (typeof field === 'string' ? field : Object.keys(field)[0]));
	const itemData = typeof item.data === 'object' ? item.data : item;

	const fieldValue = (field: string) => {
		const fieldItem = fieldMap.find(fieldItem => {
			if (fieldItem === field) return true;
			return typeof fieldItem === 'object' ? typeof fieldItem[field] === 'string' : false;
		});

		return typeof fieldItem === 'object'
			? itemData[fieldItem[Object.keys(fieldItem)[0]]]
			: itemData[fieldItem || ''];
	};

	const itemFields = fields.map((field, i) => {
		return i === 0 ? (
			<b key={field}>{fieldValue(field)}</b>
		) : i < 5 ? type === 'collection' && field === 'status' ? (
			<div className={`status-indicator ${item.status}`} key={field}>
				{item.status}
			</div>
		) : (
			<span key={field}>{fieldValue(field)}</span>
		) : null;
	});

	return typeof clickHandler === 'string' ? (
		<Link to={`./${type}/${item[clickHandler]}`} className={`table-item ${type}`}>
			{itemFields}
		</Link>
	) : (
		<div onClick={() => clickHandler(item)} className={`table-item ${type}`}>
			{itemFields}
		</div>
	);
};
