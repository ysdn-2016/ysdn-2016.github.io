
module.exports = {

	env: process.env.NODE_ENV || 'development',

	/**
	 * Site metadata (title, meta description, etc)
	 */
	site: {
		title: 'YSDN'
	},

	/**
	 * Details about the event
	 */
	event: {
		title: 'The Intermission',
		venue: {
			name: 'Liberty Grand'
		},
		sessions: [
			{
				name: 'Friends & Family',
				start: new Date('2016-04-18T18:00:00.000Z'),
				end: new Date('2015-04-18T22:00:00.000Z')
			},
			{
				name: 'Industry Night',
				start: new Date('2016-04-19T18:00:00.000Z'),
				end: new Date('2016-04-19T22:00:00.000Z')
			}
		]
	}
}
