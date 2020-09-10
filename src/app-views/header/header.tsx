import React from 'react';
import { Link } from 'react-router-dom';
import './header.css';

interface HeaderProps {
	title: string;
	actionName?: string;
	action?: () => void;
	search?: (searchTerm: string) => void;
	returnLink?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, actionName, action, search, returnLink }) => (
	<div className="header">
		{returnLink ? <Link to={returnLink} className="back-arr" /> : null}
		<h1>{title}</h1>
		{action && actionName ? <button className={`main-action ${actionName}`} onClick={() => action()} /> : null}
		{search ? <input type="search" placeholder="Search..." onChange={e => search(e.target.value)} /> : null}
	</div>
);
