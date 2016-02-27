
var markdown = require('marked')

module.exports = function (str) {
	return markdown(str)
}
