
module.exports = function (input, count) {
	if (!Array.isArray(input)) {
		throw new Error(`Must pass an array to the 'take' filter`)
	}

	return input.slice(0, count)
}
