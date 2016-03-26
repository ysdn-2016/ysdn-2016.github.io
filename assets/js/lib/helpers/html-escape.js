
var SPACE = /\s/g;
var LESS_THAN = />/g;
var MORE_THAN = /</g;

module.exports = function escape (str) {
	return str
		.replace(SPACE, '&nbsp;')
		.replace(LESS_THAN, '&lt;')
		.replace(MORE_THAN, '&gt;');
}
