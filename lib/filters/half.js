
module.exports = function (input) {
	if (!Array.isArray(input)) {
		throw new Error(`Must pass an array to the 'half' filter`)
	}
	const middle = Math.ceil(input.length / 2)
	const a = input.slice(0, middle)
	const b = input.slice(middle)
	return [a, b]
}
