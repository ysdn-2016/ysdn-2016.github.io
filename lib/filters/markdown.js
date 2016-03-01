
var markdown = require('megamark')

console.log(markdown)

var opts = {
	sanitizer: {
		allowedAttributes: {
			a: ['class', 'href', 'name', 'target', 'title', 'aria-label']
		}
	}
}

module.exports = function (input) {
	return markdown(input, opts)
}
