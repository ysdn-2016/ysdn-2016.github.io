var hashtags = /\S*#(?:\[[^\]]+\]|\S+)/g

module.exports = function (input) {
	return input.replace(hashtags, '')
}