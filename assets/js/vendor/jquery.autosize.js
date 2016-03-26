
/**
 * Adapted from https://github.com/yuanqing/autosize-input
 * by @rosszurowski
 */

;(function($) {

	'use strict';

	var SPACE = /\s/g;
	var LESS_THAN = />/g;
	var MORE_THAN = /</g;

	function escape (str) {
		return str
			.replace(SPACE, '&nbsp;')
			.replace(LESS_THAN, '&lt;')
			.replace(MORE_THAN, '&gt;');
	}

	var ghost = document.createElement('div');
  ghost.style.cssText = 'box-sizing:content-box;display:inline-block;height:0;overflow:hidden;position:absolute;top:0;visibility:hidden;white-space:nowrap;';
  document.body.appendChild(ghost);

	$.fn.autosize = function (opts) {

		var options = {
			typeahead: null
		};

		if (opts) {
			$.extend(options, opts);
		}

		return this.each(function () {
			var elem = this;
			elem.style.boxSizing = 'content-box';
			var elemStyle = window.getComputedStyle(elem);
	    var elemCssText = 'font-family:' + elemStyle.fontFamily +
	                     ';font-size:'   + elemStyle.fontSize;
			var value = options.typeahead
				? typeaheadValue
				: elemValue

			function set (str) {
				str = str || value() || elem.getAttribute('placeholder') || '';
				ghost.style.cssText += elemCssText;
				ghost.innerHTML = escape(str);
				elem.style.width = ghost.clientWidth + 'px';
				return width;
			}

			function elemValue () {
				return elem.value
			}

			function typeaheadValue () {
				var typeahead = options.typeahead.text();
				var input = elem.value;
				return typeahead.length > input.length ? typeahead : input;
			}

			elem.addEventListener('input', function () {
				set();
			});
			elem.addEventListener('keydown', function () {
				set();
			});

			var width = set();

			return set;
		})

	}

})(window.jQuery);
