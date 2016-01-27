
require('./extensions')
var titleize = require('./filters/titleize')

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

	student.projects = projects.filter(p => p.owner_id === student.id)
	student.projectCategories = student.projects
		.map(project => project.category)
		.unique()
		.map(categoryName)

	return
}


function categoryName (id) {
	return {
		id: id,
		title: titleize(id),
		href: `/work/${id.toLowerCase()}`
	}
}
