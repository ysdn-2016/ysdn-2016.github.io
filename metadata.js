

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
			averageIntermissionInterval: 18
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
		],
		faq: [
			{
				question: `Is the show free?`,
				answer: `Yes absolutely! However, we do help fund the event through sponsorships. If you're interested in supporting this or future years, <a class="event-faq-link-contact" href="mailto:exec.ysdn16@gmail.com" target="_blank">get in touch</a>.`
			},
			{
				question: `What can I expect to see and do at the show?`,
				answer: `The show is an opportunity to browse the work and meet in-person with grads from one of Canada's top design programs.`
			},
			{
				question: `Will there be drinks?`,
				answer: `Yes, we'll have a cash bar available throughout the night.`
			},
			{
				question: `What is the 'Industry' portion of the show?`,
				answer: `We dedicate a part of the night exclusively to people working in the design and creative industries. All students will be there to answer any questions about their work and experience. No ticket or registration is required.`
			},
			{
				question: `I'll be at FITC on April 19th. Can I still come?`,
				answer: `For sure! The FITC schedule ends at 6pm on April 19th. We're open until 11pm, so there's lots of time if you'd like to swing by.`
			},
			{
				question: `Where can I park my car?`,
				answer: `There is a parking area located <a class="event-faq-link-parking-main" href="https://www.google.ca/maps/place/10+Yukon+Pl,+Toronto,+ON+M6K+3C3/@43.6313371,-79.4257077,17.69z/data=!4m2!3m1!1s0x882b3509d05b0731:0x9e824a6f06404650?hl=en" target="_blank">right beside the Liberty Grand</a> that will be available.`
			}
		],
		sponsors: [
	    {
	      id: "rl-solutions",
	      company: "RL Solutions",
	      title: "Presenting Sponsor",
	      url: "http://rlsolutions.com",
	      priority: 1
	    },
	    {
	      id: "facebook",
	      company: "Facebook",
	      title: "Interactive Sponsor",
	      url: "https://facebook.com/profile.php?=73322363",
	      priority: 2
	    },
	    {
	      id: "3m",
	      company: "3M",
	      title: "Foundation Sponsor",
	      url: "http://3Mcanada.ca",
	      priority: 3
	    },
	    {
	      id: "veritiv",
	      company: "Veritiv",
	      title: "Foundation Sponsor",
	      url: "http://veritivcorp.com",
	      priority: 3
	    },
	    {
	      id: "critical-mass",
	      company: "Critical Mass",
	      title: "Patron",
	      url: "http://criticalmass.com",
	      priority: 4
	    },
	    {
	      id: "forge",
	      company: "Forge Media",
	      title: "Patron",
	      url: "http://forgemedia.ca/",
	      priority: 4
	    },
	    {
	      id: "hughes-brannan",
	      company: "Hughes & Brannan",
	      title: "Patron",
	      url: "http://hughesbrannanlaw.com",
	      priority: 4
	    },
	    {
	      id: "lassonde",
	      company: "Lassonde School of Enginering",
	      title: "Patron",
	      url: "http://lassonde.yorku.ca/",
	      priority: 4
	    },
	    {
	      id: "saman",
	      company: "Saman Design",
	      title: "Patron",
	      url: "http://www.samandesign.com/",
	      priority: 4
	    }
	  ]
	},

	/**
	 * Work categories
	 */
	categories: [
		{ id: 'graphic-design', label: 'Graphic Design', discipline: 'communication' },
		{ id: 'branding', label: 'Branding', discipline: 'communication' },
		{ id: 'type-design', label: 'Type Design', discipline: 'communication' },
		{ id: 'editorial', label: 'Editorial Design', discipline: 'communication' },
		{ id: 'book', label: 'Book Design', discipline: 'communication' },
		{ id: 'information-design', label: 'Information Design', discipline: 'information' },
		{ id: 'data-visualization', label: 'Data Visualization', discipline: 'information' },
		{ id: 'motion', label: 'Motion', discipline: 'interactive' },
		{ id: 'web', label: 'Web', discipline: 'interactive' },
		{ id: 'mobile', label: 'Mobile', discipline: 'interactive' },
		{ id: 'physical-computing', label: 'Physical Computing', discipline: 'interactive' },
		{ id: 'digital-product', label: 'Product Design', discipline: 'interactive' },
		{ id: 'experiential', label: 'Experiential', discipline: 'physical' },
		{ id: 'service', label: 'Service Design', discipline: 'physical' },
		{ id: 'packaging', label: 'Packaging Design', discipline: 'physical' },
		{ id: 'physical-product', label: 'Product Design', discipline: 'physical' }
	],

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
	pixel: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
}
