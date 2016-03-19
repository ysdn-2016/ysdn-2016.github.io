
module.exports = function (input) {
	if (typeof input !== 'string') {
		throw new TypeError('Expected a string');
	}

	// HACK: I screwed up and didn't make the category ids the full title
	switch (input) {
		case 'book':
			return 'Book Design'
			break
		case 'packaging':
			return 'Package Design'
			break
		case 'web':
			return 'Web Design'
			break
		case 'mobile':
			return 'Mobile Design'
			break
	}

	return input.toLowerCase().replace('-', ' ').replace(/(?:^|\s|-)\S/g, function (m) {
		return m.toUpperCase()
	})
}
