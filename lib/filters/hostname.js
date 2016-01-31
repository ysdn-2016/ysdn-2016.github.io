
var url = require('url')

module.exports = function (input) {
	return url.parse(input).hostname.replace(/^www\./i, '')
}
