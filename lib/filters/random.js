
module.exports = function (input) {
	if (!Array.isArray(input)) {
		throw new Error(`Must pass an array to the 'random' filter`)
	}

	return input[Math.floor(Math.random() * input.length)]
}
