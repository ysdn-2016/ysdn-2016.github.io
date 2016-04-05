
var SCROLL_THRESHOLD = 10;

module.exports = (function () {

	var $header;
	var $spacer;
	var $ribbon;
	var $window;

	var isFixed = false;
	var spacerOffset = 0;
	var spacerBottom = 0;

	function init () {
		$header = $('.header');
		$spacer = $('.header-spacer');
		$ribbon = $('.event-ribbon');
		$window = $(window);

		spacerOffset = $spacer.offset().top;
		spacerBottom = spacerOffset + $spacer.innerHeight();

		$window.on('scrolldelta', handleScroll);
		$window.on('event-panel:maximize', open);
		$window.on('event-panel:minimize', close);
	}

	function destroy () {
		isFixed = false;
		$header.removeClass('header--fixed header--maximized header--is-transitioning');
		$window.off('scrolldelta', handleScroll);
		$window.off('event-panel:maximize', open);
		$window.off('event-panel:minimize', close);
		$window.trigger('header:minimize');
	}

	function open () {
		if (!isFixed) return;
		$header.addClass('header--is-transitioning');
		$header.addClass('header--maximized');
		$header.on('transitionend webkitTransitionEnd', removeTransitionClass);
		$window.trigger('header:maximize');
	}

	function close () {
		if (!isFixed) return;
		$header.addClass('header--is-transitioning');
		$header.removeClass('header--maximized');
		$header.on('transitionend webkitTransitionEnd', removeTransitionClass);
		$window.trigger('header:minimize');
	}

	return { init: init, destroy: destroy }

	/**
	 * Event Handlers
	 */

	function removeTransitionClass () {
		$header.removeClass('header--is-transitioning');
	}

	function handleScroll (e) {
		var scrollY = e.scrollTop;
		var delta = e.scrollTopDelta;
		if (delta < 1 && delta <= (SCROLL_THRESHOLD * -1)) {
			open();
		} else if (delta > 1 && delta >= SCROLL_THRESHOLD && scrollY > 0) {
			close();
		}
		if (!isFixed && scrollY > spacerBottom) {
			$header.addClass('header--fixed');
			$header.removeClass('header--is-transitioning')
			isFixed = true;
		} else if (isFixed && scrollY <= spacerOffset) {
			$header.removeClass('header--fixed header--maximized header--is-transitioning');
			isFixed = false;
		}
	}

})()
