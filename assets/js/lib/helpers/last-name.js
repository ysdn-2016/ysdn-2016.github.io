
var splitName = require('./split-name');

module.export = function (name) {
	return splitName(name)[1];
}
