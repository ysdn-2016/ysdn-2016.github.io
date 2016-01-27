
Array.prototype.unique = function () {
	var a = []
	for (var i=0, l=this.length; i<l; i++) {
		if (a.indexOf(this[i]) === -1) {
			a.push(this[i])
		}
	}
	return a
}
