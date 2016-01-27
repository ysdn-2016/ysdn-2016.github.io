
/** NOTE: if this gets complex, maybe make Projects into a class w/ getters */

module.exports = () => {
	return (files, metalsmith, done) => {
		var filenames = Object.keys(files)
		var projects = metalsmith._metadata.projects
		var students = metalsmith._metadata.students

		filenames.forEach(filename => mixin(files[filename], students))
		projects.forEach(project => mixin(project, students))

		done()
	}
}


/**
 * Normalize project `owner` information into metadata and swap out markdown
 * URLs to Amazon S3 URLs.
 *
 * @param project		{Object}
 * @param students	{Array}
 */
function mixin (project, students) {
	if (!project.owner_id) return

	/**
	 * Normalize owner data
	 */
	var owner = students.find(student => student.id === project.owner_id)
	if (owner) {
		project.owner = owner
		// NOTE: this line is for properly setting permalinks, which can't access
		// a property of the `owner` key
		project.owner_name = owner.name
	}

	/**
	 * Swap out local asset URLs to S3 URLs
	 */
	var assets = project.assets
	var contents = project.contents.toString()
	assets.forEach(asset => {
		const name = new RegExp(asset.name, 'g')
		contents = contents.replace(name, asset.url)
	})
	project.contents = new Buffer(contents)
}
