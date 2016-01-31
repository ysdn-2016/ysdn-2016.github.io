
require('./extensions')
var slug = require('slug-component')
var titleize = require('./filters/titleize')

var categories = [
	{ id: 'graphic-design', label: 'Graphic Design', group: 'communication' },
	{ id: 'branding', label: 'Branding', group: 'communication' },
	{ id: 'type-design', label: 'Type Design', group: 'communication' },
	{ id: 'editorial', label: 'Editorial Design', group: 'communication' },
	{ id: 'book', label: 'Book Design', group: 'communication' },
	{ id: 'information-design', label: 'Information Design', group: 'information' },
	{ id: 'data-visualization', label: 'Data Visualization', group: 'information' },
	{ id: 'motion', label: 'Motion Design', group: 'communication' },
	{ id: 'web', label: 'Web Design', group: 'interactive' },
	{ id: 'mobile', label: 'Mobile Design', group: 'interactive' },
	{ id: 'physical-computing', label: 'Physical Computing', group: 'interactive' },
	{ id: 'digital-product', label: 'Digital Product Design', group: 'interactive' },
	{ id: 'experiential', label: 'Experiential', group: 'physical' },
	{ id: 'service', label: 'Service Design', group: 'physical' },
	{ id: 'packaging', label: 'Packaging Design', group: 'physical' },
	{ id: 'physical-product', label: 'Physical Product Design', group: 'physical' }
]

module.exports = () => {
	return (files, metalsmith, done) => {
		var filenames = Object.keys(files)
		var projects = metalsmith._metadata.projects
		var students = metalsmith._metadata.students

		filenames.forEach(filename => mixin(files[filename], projects))
		students.forEach(student => mixin(student, projects))

		done()
	}
}


/**
 * Add extra properties to `student` keys based on their projects
 *
 * @param student		{Object}
 * @param projects	{Array}
 */
function mixin (student, projects) {
	if (!student.email) return

	student.firstName = student.name.split(' ').shift()
	student.lastName = student.name.split(' ').slice(1).join(' ')
	student.projects = projects.filter(p => p.owner_id === student.id)
	student.projectCategories = student.projects
		.map(project => project.category)
		.map(category => categories.find(c => category === c.id).group)
		.unique()
		.map(metadata)
	student.href = `/${slug(student.name)}/`

	return
}


function metadata (id) {
	return {
		id: id,
		title: titleize(id),
		href: `/work/${id.toLowerCase()}`
	}
}
