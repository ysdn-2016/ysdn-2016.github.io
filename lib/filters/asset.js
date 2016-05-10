
var parse = require('path').parse
var hash = require('object-hash')

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

	var { dir, name, ext } = parse(input.path)
	var modifier = ''
	if (opts) {
		var key = hash(opts)
		modifier += `.${key}`
	}

	return `http://ysdn-gradshow.s3.amazonaws.com/${dir}/${name}${modifier}${ext}`
}
