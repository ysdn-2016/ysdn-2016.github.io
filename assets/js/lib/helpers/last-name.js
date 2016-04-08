
var splitName = require('./split-name');

module.exports = function (name) {
	return splitName(name)[1];
}
