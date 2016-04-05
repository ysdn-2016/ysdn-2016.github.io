
var splitName = require('../../assets/js/lib/helpers/split-name')

var firstName = str => splitName(str)[0]
var lastName = str => splitName(str)[1]

module.exports = function (input) {
	if (!Array.isArray(input)) {
		throw new Error('Must pass an array to the \'sortByLastName\' filter')
	}
	input.sort((a, b) => {
		var lastA = lastName(a.name)
		var lastB = lastName(b.name)
		if (lastA.localeCompare(lastB) !== 0) {
			return lastA.localeCompare(lastB)
		}
		var firstA = firstName(a.name)
		var firstB = firstName(b.name)
		return firstA.localeCompare(firstB)
	})
	return input
}
