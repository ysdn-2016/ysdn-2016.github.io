
module.exports = function (input) {
	if (typeof input !== 'string') {
		throw new TypeError('Expected a string');
	}

	return input.toLowerCase().replace('-', ' ').replace(/(?:^|\s|-)\S/g, function (m) {
		return m.toUpperCase()
	})
}
