
module.exports = function (input) {
	return input
		.replace(/<a\s([^>]*)>([^<\/]*)<\/a>/g, '<a target="_blank" $1>$2</a>')
}
