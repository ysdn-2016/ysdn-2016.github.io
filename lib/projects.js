
module.exports = () => {
	return (files, metalsmith, done) => {
		var students = metalsmith._metadata.students
		var projects = metalsmith._metadata.projects

		/**
		 * Swap out all file metadata
		 */
		Object.keys(files).forEach(filename => {
			var project = files[filename]
			swap(project)
		})

		/**
		 * Swap out all metadata keys
		 */
		projects.forEach(swap)

		done()

		function swap (project) {
			if (!project.owner_id) return

			/**
			 * Normalize owner data
			 */
			var owner = students.find(student => student.id === project.owner_id)
			if (owner) {
				project.owner = owner
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
	}
}
