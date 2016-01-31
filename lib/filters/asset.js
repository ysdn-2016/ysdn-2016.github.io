
var optionKeys = {
	width: 'w',
	height: 'h',
	fit: 'fit'
}

module.exports = function (input, opts) {
	if (!input.path) {
		throw new Error(`Must pass a valid asset to the 'asset' filter`)
	}

	var path = input.path
	var args = []
	var query = ''

	if (typeof opts !== 'undefined') {
		Object.keys(opts).forEach(key => {
			args.push(`${optionKeys[key]}=${opts[key]}`)
		})
		if (args.length) {
			query += '?'
			query += args.join('&')
		}
	}
	return `http://ysdn-2016.imgix.net/${path}${query}`
}
