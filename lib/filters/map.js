
module.exports = function (input, key) {
	if (!Array.isArray(input)) {
		throw new Error(`Must pass an array to the 'map' filter`)
	}

	return input.map(value => {
		if (!value[key]) return
		return value[key]
	}).filter(n => n)
}
