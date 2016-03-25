
var sortByLastName = require('./filters/sortByLastName')
var sentences = require('../metadata').config.studentIndex.intermissionSentences
var select = arr => arr[Math.floor(Math.random() * (arr.length - 1))]

var EXPORT_KEY = 'studentGrid'
var SHAPE_KEY = 'shape'
var INTERMISSION_KEY = 'intermission'

var opts = {
	averageShapeInterval: 5,
	averageIntermissionInterval: 20
}

var shapes = [
	'triangle',
	'rectangle',
	'circle',
	'half-circle',
	'square'
]

module.exports = () => {
	return (files, metalsmith, done) => {
		var metadata = metalsmith.metadata()
		var students = metadata.students
		var sorted = sortByLastName(students.slice())
		var grid = []

		sorted.forEach((item, i) => {
			var j = i + 1
			if (j % opts.averageShapeInterval === 0) {
				grid.push({ type: SHAPE_KEY, shape: select(shapes) })
			}
			if (j % opts.averageIntermissionInterval === 0) {
				grid.push({ type: INTERMISSION_KEY, text: sentences.shift() })
			}
			item.type = 'student'
			grid.push(item)
		})

		metadata[EXPORT_KEY] = grid

		return done()
	}
}
