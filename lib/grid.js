
var sortByLastName = require('./filters/sortByLastName')

var EXPORT_KEY = 'studentGrid'
var SHAPE_KEY = 'shape'
var INTERMISSION_KEY = 'intermission'

var opts = {
	averageShapeInterval: 5,
	averageIntermissionInterval: 20
}

module.exports = () => {
	return (files, metalsmith, done) => {
		var metadata = metalsmith.metadata()
		var students = metadata.students
		var sorted = sortByLastName(students.slice())
		var grid = []

		sorted.forEach((item, i) => {
			var j = i + 1
			if (j % opts.averageShapeInterval === 0) {
				grid.push({ type: SHAPE_KEY, shape: 'triangle' })
			}
			if (j % opts.averageIntermissionInterval === 0) {
				grid.push({ type: INTERMISSION_KEY, text: 'Phew. There’s a lot of us, isn’t there?' })
			}
			item.type = 'student'
			grid.push(item)
		})

		metadata[EXPORT_KEY] = grid

		return done()
	}
}
