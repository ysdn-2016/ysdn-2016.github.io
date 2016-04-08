
/**
 * Fisher-Yates shuffle in javascript
 */
module.exports = function (input) {
	if (!Array.isArray(input)) {
		throw new Error(`Must pass an array to the 'shuffle' filter`)
	}

	var arr = input.slice()
	var i = input.length
	var j
	var swap

	while (--i) {
		j = Math.random() * (i + 1) | 0
		swap = arr[i]
		arr[i] = arr[j]
		arr[j] = swap
	}

	return arr
}
