
var categories = require('../../metadata').categories
var unique = arr => [...new Set(arr)]

var disciplines = unique(categories.map(c => c.discipline))

module.exports = function (input, discipline) {
	if (!Array.isArray(input)) {
		throw new Error(`Must pass an array to the 'filterByDiscipline' filter`)
	}
	if (disciplines.indexOf(discipline) === -1) {
		throw new Error(`Invalid discipline '${discipline}'. Must be one of ${disciplines.join(', ')}.`)
	}

	var filtered = input.filter(project => {
		var category = categories.find(c => c.id === project.category)
		if (!category) return false
		var isInDiscipline = category.discipline === discipline
		return isInDiscipline
	})

	return filtered
}
