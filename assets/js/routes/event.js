
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

var $window;
var $eventDetailsGhost;
var $eventDetailsLink;
var $eventMap;

var map;
var marker;
var interval;

module.exports = function (ctx) {
	$window = $(window);
	$eventDetailsGhost = $('.event-details-location-ghost');
	$eventDetailsLink = $('.event-details-location-link');
	$eventMap = $('.event-directions-map');

	map = new google.maps.Map($eventMap.get(0), mapOptions);
	marker = new google.maps.Marker({
		position: new google.maps.LatLng(43.631014, -79.426256),
		map: map,
		icon: '/assets/images/marker.svg',
		title: 'Liberty Grand'
	})

	google.maps.event.addDomListener(marker, 'click', onMapMarkerClick)

	if (!supportsSticky()) {
		enquire.register('only screen and (min-width: 600px)', {
			match: function () {
				bind();
			},
			unmatch: function () {
				unbind();
			}
		})
	}
};

module.exports.exit = function () {
	unbind();
	google.maps.event.removeDomListener(marker, 'click', onMapMarkerClick)
}

function bind () {
	$window.on('resize', resize);
	$eventDetailsGhost.on('mouseenter', onMouseEnterGhost);
	$eventDetailsGhost.on('mouseleave', onMouseLeaveGhost);
	resize();
	interval = setInterval(resize, 800);
}

function unbind () {
	$window.off('resize', resize);
	$eventDetailsGhost.on('mouseenter', onMouseEnterGhost);
	$eventDetailsGhost.on('mouseleave', onMouseLeaveGhost);
	$eventDetailsGhost.css({
		top: '',
		left: '',
		width: '',
		height: ''
	})
	clearInterval(interval);
}

function resize () {
	var rect = $eventDetailsLink.get(0).getBoundingClientRect();
	$eventDetailsGhost.css({
		top: rect.top + 'px',
		left: rect.left + 'px',
		width: rect.width,
		height: rect.height
	})
}

function onMouseEnterGhost () {
	$eventDetailsLink.addClass('hover');
}

function onMouseLeaveGhost () {
	$eventDetailsLink.removeClass('hover');
}

function onMapMarkerClick () {
	window.open('https://goo.gl/maps/YuXwP9XNDhQ2', '_blank').focus()
}
