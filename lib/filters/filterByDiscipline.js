
var unique = arr => [...new Set(arr)]

var categories = [
	{ id: 'graphic-design', label: 'Graphic Design', group: 'communication' },
	{ id: 'branding', label: 'Branding', group: 'communication' },
	{ id: 'type-design', label: 'Type Design', group: 'communication' },
	{ id: 'editorial', label: 'Editorial Design', group: 'communication' },
	{ id: 'book', label: 'Book Design', group: 'communication' },
	{ id: 'information-design', label: 'Information Design', group: 'information' },
	{ id: 'data-visualization', label: 'Data Visualization', group: 'information' },
	{ id: 'motion', label: 'Motion Design', group: 'communication' },
	{ id: 'web', label: 'Web Design', group: 'interactive' },
	{ id: 'mobile', label: 'Mobile Design', group: 'interactive' },
	{ id: 'physical-computing', label: 'Physical Computing', group: 'interactive' },
	{ id: 'digital-product', label: 'Digital Product Design', group: 'interactive' },
	{ id: 'experiential', label: 'Experiential', group: 'physical' },
	{ id: 'service', label: 'Service Design', group: 'physical' },
	{ id: 'packaging', label: 'Packaging Design', group: 'physical' },
	{ id: 'physical-product', label: 'Physical Product Design', group: 'physical' }
]

var disciplines = unique(categories.map(c => c.group))

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
		var isInDiscipline = category.group === discipline
		return isInDiscipline
	})

	return filtered
}
