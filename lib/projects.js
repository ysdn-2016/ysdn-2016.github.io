
module.exports = () => {
	return (files, metalsmith, done) => {
		var students = metalsmith._metadata.students
		Object.keys(files).forEach(filename => {
			var file = files[filename]

			/**
			 * Normalize owner data
			 */
			var owner = students.find(student => student.id === file.owner_id)
			if (owner) {
				file.owner = owner
				file.owner_name = owner.name
			}

			/**
			 * Swap out local asset URLs to S3 URLs
			 */
			var assets = file.assets
			var contents = file.contents.toString()
			assets.forEach(asset => {
				const name = new RegExp(asset.name, 'g')
				contents = contents.replace(name, asset.url)
			})
			file.contents = new Buffer(contents)
		})
		done()
	}
}
