
var sortByLastName = require('./filters/sortByLastName')
var shuffle = require('./filters/shuffle')
var repeat = require('./filters/repeat')

var randInt = max => Math.floor(Math.random() * max)

var EXPORT_KEY = 'studentGrid'
var SHAPE_KEY = 'shape'
var INTERMISSION_KEY = 'intermission'

var shapes = repeat(shuffle([
	{ type: 'shape', shape: 'triangle' },
	{ type: 'shape', shape: 'rectangle' },
	{ type: 'shape', shape: 'circle' },
	{ type: 'shape', shape: 'half-circle' },
	{ type: 'shape', shape: 'square' }
]), 8)

var sentences = repeat([
	{ type: 'intermission', text: `Phew, there are a lot of us, aren't there?` },
	{ type: 'intermission', text: `Keep going…` },
	{ type: 'intermission', text: `Just a little further…` },
	{ type: 'intermission', text: `Almost there…` },
], 3)

module.exports = () => {
	return (files, metalsmith, done) => {
		var metadata = metalsmith.metadata()
		var students = metadata.students
		var sorted = sortByLastName(students.slice()).map(el => {
			el.type = 'student'
			return el
		})

		var withShapes = insertElementsAtIndices(sorted, shapes, [
			3, 4, 10, 15, 17, 23, 26, 32, 37, 42, 47, 48, 54, 59, 61, 67,
			70, 76, 81, 87, 88, 94, 102, 105, 109, 116, 125
		])

		var grid = insertElementsAtIndices(withShapes, sentences, [
			23, 43, 67, 81
		])

		metadata[EXPORT_KEY] = grid

		return done()
	}
}


function insertElementsAtIndices (source, array, indices) {
	var result = source.slice()
	var stack = array.slice()
	indices.forEach(i => {
		result.splice(i, 0, array.shift())
	})
	return result
}

function injectElementsIntoArrayWithFrequency (source, array, freq) {
	var result = []
	var j = 0
	source.forEach((el, i) => {
		if ((i + 1) % freq === 0) {
			result.push(array[j])
			j++
		}
		result.push(el)
	})
	return result
}
