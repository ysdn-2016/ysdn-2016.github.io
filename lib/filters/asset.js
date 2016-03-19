
var optionKeys = {
	width: 'w',
	height: 'h',
	fit: 'fit',
	crop: 'crop',
	rect: 'rect',
	face: 'faceindex',
	facepad: 'facepad'
}

module.exports = function (input, opts) {
	if (!input.path) {
		return '#!'
		// throw new Error(`Must pass a valid asset to the 'asset_url' filter`)
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
