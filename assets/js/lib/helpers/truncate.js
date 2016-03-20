var truncationChar = '…'

/**
 * Truncates a string to the nearest word at a given length
 */
module.exports = function (input, length) {
	if (input.length < length) return input
	var trimmedToChar = input.substr(0, length)
	var trimmedToWord = trimmedToChar.substr(0, Math.min(trimmedToChar.length, trimmedToChar.lastIndexOf(' ')))
	return trimmedToWord + truncationChar
}