
module.exports = function (input, count) {
	if (!Array.isArray(input)) {
		throw new Error(`Must pass an array to the 'repeat' filter`)
	}

	var len = input.length
	var result = []

	for (var i = 0; i < count; i++) {
		result = result.concat(input)
	}

	return result
}
