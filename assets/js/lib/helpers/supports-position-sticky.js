
/**
 * Adapted from Modernizr
 * https://git.io/vVaxI
 */
module.exports = function () {
	var el = document.createElement('a');
	var style = el.style
	style.cssText = 'position:-webkit-sticky;position:sticky;'
	return style.position.indexOf('sticky') !== -1;
}
