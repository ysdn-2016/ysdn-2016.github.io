
module.exports = function (input) {
	return input
		.replace(/<figure\s.*>.*<\/figure>/g, '')
		.replace(/<iframe\s.*>.*<\/iframe>/g, '')
}
