
var markdown = require('marked')

markdown.setOptions({
	breaks: true
})

module.exports = function (str) {
	return markdown(str)
}
