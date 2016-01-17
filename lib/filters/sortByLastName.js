
module.exports = function (input) {
	if (!Array.isArray(input)) {
		throw new Error('Must pass an array to the \'sortByLastName\' filter')
	}
	input.sort((a, b) => {
		var av = lastName(a.name)
		var bv = lastName(b.name)
		return av.localeCompare(bv)
	})
	return input
}


function lastName (name) {
	return name.split(' ').slice(-1).join(' ')
}
