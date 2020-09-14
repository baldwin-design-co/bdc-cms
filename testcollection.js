const testCollection = {
	name            : 'Projects',
	fieldStructures : {
		name           : { type: 'text', required: true },
		category       : {
			type    : 'option',
			options : [ 'Brand Strategy', 'Branding', 'Website' ],
			multi   : true
		},
		completionDate : { type: 'date', label: 'completion date' },
		coverImage     : { type: 'file', fileTypes: [ 'image/*' ] },
		description    : { type: 'text', multiline: 'true' }
	},
	items           : [
		{
			name           : 'Legion Elite',
			category       : [ 'Branding' ],
			completionDate : new Date(),
			coverImage     : 'https://baldwindesign.co/images/projectThumbnail_legion-elite.jpg',
			description    : 'Lorem ipsum doler sit amet consectetur'
		},
		{
			name           : 'Kern Realty',
			category       : [ 'Website' ],
			completionDate : new Date(),
			coverImage     : 'https://baldwindesign.co/images/project-thumbnail_kern-realty.jpg',
			description    : 'Lorem ipsum doler sit amet consectetur'
		}
	]
};

export default testCollection;
