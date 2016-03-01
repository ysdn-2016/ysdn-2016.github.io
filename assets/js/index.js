
var fs = require('fs')
var ready = require('domready')
var scrollMonitor = require('scrollmonitor')
var enquire = require('enquire.js')
var Instafeed = require('instafeed.js')

var stripHashtags = require('./lib/helpers/strip-hashtags')
var truncate = require('./lib/helpers/truncate')

var mapOptions = {
	zoom: 15,
	center: new google.maps.LatLng(43.6337886,-79.432927),
	scrollwheel: false,
	disableDefaultUI: true,
	disableDoubleClickZoom: true,
	styles: [{"featureType":"all","elementType":"geometry","stylers":[{"color":"#2b4074"}]},{"featureType":"all","elementType":"labels.text.fill","stylers":[{"gamma":0.01},{"lightness":20}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"saturation":-31},{"lightness":-33},{"weight":2},{"gamma":0.8}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative.locality","elementType":"labels.text","stylers":[{"visibility":"on"}]},{"featureType":"administrative.locality","elementType":"labels.text.fill","stylers":[{"color":"#fbfbfb"}]},{"featureType":"administrative.locality","elementType":"labels.text.stroke","stylers":[{"visibility":"off"},{"color":"#ffffff"}]},{"featureType":"administrative.neighborhood","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"administrative.neighborhood","elementType":"labels.text.fill","stylers":[{"visibility":"off"},{"color":"#ffffff"}]},{"featureType":"administrative.land_parcel","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"lightness":30},{"saturation":30}]},{"featureType":"landscape","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"saturation":20}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#3864d1"},{"gamma":"1.26"},{"saturation":"43"},{"lightness":"-40"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"lightness":20},{"saturation":-20}]},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":10},{"saturation":-30}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"color":"#5ac2b4"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"saturation":25},{"lightness":25}]},{"featureType":"road","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#2b4074"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"labels.text.fill","stylers":[{"visibility":"on"},{"color":"#77a3f0"}]},{"featureType":"road.highway.controlled_access","elementType":"geometry.fill","stylers":[{"visibility":"on"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#2b4074"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road.arterial","elementType":"labels.text.fill","stylers":[{"color":"#77a3f0"},{"visibility":"on"},{"weight":"1"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#2c52ae"},{"saturation":"0"},{"lightness":"2"},{"gamma":"1.00"}]},{"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry.fill","stylers":[{"visibility":"on"}]},{"featureType":"transit","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"lightness":-20}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"off"}]}] //[{"featureType":"all","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#2c5ca5"}]},{"featureType":"poi","elementType":"all","stylers":[{"color":"#2c5ca5"}]},{"featureType":"road","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#193a70"},{"visibility":"on"}]}]
}

var markerOptions = {
	breakpoints: [
		{
			query: 'screen and (min-width: 1025px)',
			coords: { x: 0.67, y: 0.5 }
		},
		{
			query: 'screen and (max-width: 1025px)',
			coords: { x: 0.8, y: 0.4 }
		},
		{
			query: 'screen and (max-width: 769px)',
			coords: { x: 0.5, y: 0.25 }
		},
		{
			query: 'screen and (max-width: 426px)',
			coords: { x: 0.5, y: 0.25 }
		}
	]
}

var feedOptions = {
	clientId: '467ede5a6b9b48ae8e03f4e2582aeeb3',
	userId: '2228340350',
	sortBy: 'most-recent',
	template: require('./templates/instagram.html'),
	limit: 6
}

ready(function () {
	var fullSiteNotice = document.querySelector('.event-full-site-notice')
	var fullSiteNoticeScrollWatcher = scrollMonitor.create(fullSiteNotice)
	var fullSiteNoticeLink = fullSiteNotice.querySelector('[data-subscribe-link]')

	var mapElement = document.querySelector('[data-map]')
	var map = googleMap(mapElement)
	var marker = googleMapMarker()
	var mapPosition = { x: 0.5, y: 0.5 }

	var feedElement = document.querySelector('[data-instagram]')
	var feed = instagramFeed(feedElement)

	// enquire.register('screen and (max-width: 426px)', {
	// 	match:
	// })

	fullSiteNoticeScrollWatcher.enterViewport(onScrollEnterNotice)
	fullSiteNoticeScrollWatcher.exitViewport(onScrollLeaveNotice)
	google.maps.event.addDomListener(window, 'resize', onMapResize)
	google.maps.event.addDomListener(marker, 'click', onMapMarkerClick)
	google.maps.event.addListenerOnce(map, 'idle', onMapLoad)

	/**
	 * Event Handlers
	 */

	function instagramFeed (el) {
		var feed = new Instafeed({
			accessToken: '5139102.1677ed0.e96631b309c2454493762538cccb4e1d',
			target: el,
			sort: feedOptions.sortBy,
			limit: feedOptions.limit,
			get: 'user',
			resolution: 'standard_resolution',
			userId: feedOptions.userId,
			template: feedOptions.template,
			filter: function (item) {
				// HACK: we adjust the captions in filter function 🙈
				item.caption.text = stripHashtags(item.caption.text)
				item.caption.text = truncate(item.caption.text, 200)
				return item.type === 'image'
			},
		})
		feed.run()
		return feed
	}

	function googleMap (el) {
		var map = new google.maps.Map(mapElement, mapOptions)
		return map
	}

	function googleMapMarker () {
		return new google.maps.Marker({
			position: new google.maps.LatLng(43.631014, -79.426256),
			map: map,
			icon: '/assets/images/marker.svg',
			// TODO: make animation play when hovering over the venue name
			animation: google.maps.Animation.BOUNCE,
			title: 'Liberty Grand'
		})
	}

	function onScrollEnterNotice () {
		document.documentElement.classList.add('blue-elastic-scroll')
	}

	function onScrollLeaveNotice () {
		document.documentElement.classList.remove('blue-elastic-scroll')
	}

	function onMapLoad () {
		markerOptions.breakpoints.forEach(function (breakpoint) {
			enquire.register(breakpoint.query, function () {
				mapPosition = breakpoint.coords
			})
		})
		onMapResize()
	}

	function onMapResize () {
		setMapCenterWithPercentageOffset(marker.getPosition(), mapPosition.x, mapPosition.y)
	}

	function onMapMarkerClick () {
		window.open('https://goo.gl/maps/YuXwP9XNDhQ2', '_blank').focus()
	}

	/**
	 * Helper functions
	 */

	function setMapCenterWithPercentageOffset (coord, x, y) {
		var bounds = mapElement.getBoundingClientRect()
		var normalizedX = x - 0.5
		var normalizedY = 0.5 - y
		var offsetX = bounds.width * normalizedX
		var offsetY = bounds.height * normalizedY
		setMapCenterWithOffset(coord, offsetX, offsetY)
	}

	function setMapCenterWithOffset (coord, x, y) {
		var scale = Math.pow(2, map.getZoom())
		var projection = map.getProjection()

		if (!projection) return
		var a = projection.fromLatLngToPoint(coord)
		var b = new google.maps.Point(x / scale, y / scale)

		var target = new google.maps.Point(a.x - b.x, a.y + b.y)
		map.setCenter(projection.fromPointToLatLng(target))
	}

})
