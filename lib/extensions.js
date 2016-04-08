
Array.prototype.unique = function () {
	var a = []
	for (var i=0, l=this.length; i<l; i++) {
		if (a.indexOf(this[i]) === -1) {
			a.push(this[i])
		}
	}
	return a
}

Array.prototype.insert = function (index, item) {
	this.splice(index, 0, item)
	return this
}
