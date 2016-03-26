
var categories = require('../../metadata').categories

module.exports = function (input) {
	return categories.find(category => category.id === input).discipline
}
