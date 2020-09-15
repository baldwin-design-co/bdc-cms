import React, { useState } from 'react';
import { ItemDoc, FieldStructures } from '../../firebase';
import { AsyncButton } from './async-button/async-button';
import './card.css';

interface CollectionCardProps {
	currentItem: ItemDoc;
	fieldStructures: FieldStructures;
	setCurrentItem: (item: ItemDoc) => void;
	closeCurrentItem: () => void;
	saveCurrentItem: () => void;
	deleteCurrentItem: () => void;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({
	currentItem,
	fieldStructures,
	setCurrentItem,
	closeCurrentItem,
	saveCurrentItem,
	deleteCurrentItem
}) => {
	const [ error, setError ] = useState('');

	const fields = null;

	return (
		<section className="scrimming">
			<div className="card">
				<div className="card-head">
					<button className="card-close" onClick={() => closeCurrentItem()} />
					<h2>{currentItem.data.name || 'New Item'}</h2>
				</div>

				<div className="card-content">{fields}</div>

				{error}

				<div className="card-actions">
					<AsyncButton
						name={currentItem.status === 'published' ? 'archive' : 'publish'}
						subAction
						action={() => {}}
						errorAction={setError}
					/>
					<AsyncButton
						name="delete"
						subAction
						action={deleteCurrentItem}
						errorAction={setError}
					/>
					<AsyncButton name="save" action={saveCurrentItem} errorAction={setError} />
				</div>
			</div>
		</section>
	);
};
