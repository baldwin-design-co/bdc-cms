const fieldStructures = [
	{ type: 'text', name: 'text', multiline: false },
	{ type: 'text', name: 'text-multiline', multiline: true },
	{ type: 'number', name: 'number' },
	{ type: 'email', name: 'email' },
	{ type: 'phone', name: 'phone' },
	{ type: 'url', name: 'url' },
	{ type: 'date', name: 'date', time: false },
	{ type: 'date', name: 'date-time', time: true },
	{ type: 'option', name: 'option', options: [ '1', '2', '3' ], multi: false },
	{ type: 'option', name: 'option-multi', options: [ '1', '2', '3' ], multi: true },
	{ type: 'reference', name: 'reference', collection: 'projects', multi: false },
	{ type: 'reference', name: 'reference-multi', collection: 'projects', multi: true },
	{ type: 'image', name: 'image', fileTypes: [ 'jpg', 'jpeg', 'png', 'svg' ] },
	{ type: 'attatchment', name: 'attatchment', fileTypes: [ 'pdf' ] }
];
