
var router = require('page');

var DEFAULT_URL = '/'
var EVENT_URL = '/event/'

module.exports = (function () {

	var $body;
	var $eventPanel;
	var $eventRibbon;
	var $eventRibbonAction;

	var previousUrl = DEFAULT_URL

	function init () {
		$body = $('body');
		$eventPanel = $('.event-panel');
		$eventRibbon = $('.event-ribbon-trigger');
		$eventRibbonAction = $('.event-ribbon-info-cta');

		$eventRibbon.on('click', handleEventRibbonClick);
	}

	return { init: init }

	/**
	 * Private functions
	 */

	function handleEventRibbonClick (e) {
		e.preventDefault();

		var isOpen = $eventPanel.hasClass('event-panel--open')

		if (isOpen) {
			$body.removeClass('locked');
			$eventPanel.removeClass('event-panel--open');
			router(previousUrl);
		} else {
			$body.addClass('locked');
			$eventPanel.addClass('event-panel--open');
			previousUrl = router.current;
			router(EVENT_URL);
		}
	}

})()
