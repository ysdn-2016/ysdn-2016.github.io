
module.exports = function (input, roundDown) {
	if (!Array.isArray(input)) {
		throw new Error(`Must pass an array to the 'half' filter`)
	}
	const middle = round(input.length / 2, roundDown)
	const a = input.slice(0, middle)
	const b = input.slice(middle)
	return [a, b]
}

function round (val, down) {
	return down === true ? Math.floor(val) : Math.ceil(val)
}
