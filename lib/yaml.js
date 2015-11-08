
var path = require('path')
var yaml = require('js-yaml')

/**
 * Loads data from a YAML file without any template
 */
module.exports = () => {
	return (files, metalsmith, done) => {
		Object.keys(files)
			.filter(filename => filename.match(/\.(yml|yaml|json)$/))
			.forEach(filename => {
				var ext = path.extname(filename)
				var name = filename.replace(new RegExp(`\\${ext}$`), '.html')
				var page = files[filename]
				var metadata = {}
				try {
					if (ext.match(/\.yml/)) {
						metadata = yaml.safeLoad(page.contents.toString())
					} else if (ext.match(/\.json/)) {
						metadata = JSON.parse(page.contents.toString())
					}
				} catch (err) {
					done(err)
				}
				Object.keys(metadata).forEach(key => page[key] = metadata[key])
				page.contents = new Buffer('')
				files[name] = page
				delete files[filename]
			})
		done()
	}
}
