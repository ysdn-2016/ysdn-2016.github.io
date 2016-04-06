
var supportsSticky = require('../lib/helpers/supports-position-sticky');

var mapOptions = {
	zoom: 14,
	backgroundColor: 'none',
	center: new google.maps.LatLng(43.631014, -79.426256),
	scrollwheel: false,
	disableDefaultUI: true,
	disableDoubleClickZoom: true,
	styles: require('../templates/map')
}

module.exports = function (ctx) {
	var $eventPanel = $('.event-panel');
	var $eventContent = $('.event-panel-content');
	var $eventDetails = $('.event-details');
	var $eventMap = $('.event-directions-map');

	var frameRequest = null;
	var lastScroll = 0;
	var map = new google.maps.Map($eventMap.get(0), mapOptions);
	var marker = new google.maps.Marker({
		position: new google.maps.LatLng(43.631014, -79.426256),
		map: map,
		icon: '/assets/images/marker.svg',
		title: 'Liberty Grand'
	})

	google.maps.event.addDomListener(marker, 'click', onMapMarkerClick)

	if (!supportsSticky()) {
		enquire.register('only screen and (min-width: 600px)', {
			match: function () {
				$eventContent.on('scroll', onScroll);
			},
			unmatch: function () {
				$eventContent.off('scroll', onScroll);
				$eventDetails.css('transform', '');
			}
		})
	}

	/**
	 * Private functions
	 */

	function onScroll (e) {
		var scrollY = e.target.scrollTop
		$eventDetails.css('transform', 'translateY(' + scrollY + 'px)')
	}

	function onMapMarkerClick () {
		window.open('https://goo.gl/maps/YuXwP9XNDhQ2', '_blank').focus()
	}
};
