
module.exports = function (input, key, value) {
	if (!Array.isArray(input)) {
		throw new Error(`Must pass an array to the 'filter' filter`)
	}
	return input.filter(el => el[key] == value)
}
