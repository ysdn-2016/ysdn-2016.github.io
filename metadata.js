
module.exports = {

	env: process.env.NODE_ENV || 'development',

	/**
	 * Site metadata (title, meta description, etc)
	 */
	site: {
		title: 'YSDN'
	},

	/**
	 * Appearance Configuration
	 */
	config: {
		studentProfile: {
			defaults: {
				biography: "This student hasn't written anything about themselves :("
			}
		},
		studentIndex: {
			averageShapeInterval: 5,
			averageIntermissionInterval: 18,
			intermissionSentences: [
				`Phew, there's a lot of us, isn't there?`,
				`Keep going…`,
				`Just a bit further`,
				`Almost there!`,
				`That's right. 96 students. Eat it OCAD.`
			]
		}
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
	},

	/**
	 * Social
	 */
	social: {
		facebook: {
			url: 'https://www.facebook.com/ysdntheintermission/'
		},
		instagram: {
			url: 'https://www.instagram.com/ysdntheintermission/'
		},
		twitter: {
			url: 'https://twitter.com/ysdn2016'
		},
		mail: {
			url: 'mailto:hello@ysdn2016.com'
		},
	},

	/**
	 * Development Utils
	 */
	pixel: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP4z8BQDwAEgAF/posBPQAAAABJRU5ErkJggg=='
}
