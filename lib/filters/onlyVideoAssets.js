
var sanitize = require('insane')

var options = {
  allowedAttributes: {
    iframe: [
			"allowfullscreen", "webkitallowfullscreen", "mozallowfullscreen",
			"frameborder", "src", "width", "height"
		]
  },
  allowedTags: ["iframe"]
}

module.exports = function (input) {
	return sanitize(input, options)
}
