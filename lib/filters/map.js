
module.exports = function (input, key) {
	return input.map(value => {
		if (!value[key]) return
		return value[key]
	}).filter(n => n)
}
