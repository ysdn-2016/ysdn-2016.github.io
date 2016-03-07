
var fs = require('fs')
var ready = require('domready')
var events = require('dom-events')
var enquire = require('enquire.js')
var Instafeed = require('instafeed.js')

var breakpoints = require('./lib/media')
var stripHashtags = require('./lib/helpers/strip-hashtags')
var truncate = require('./lib/helpers/truncate')

var Subscribe = require('./lib/subscribe')

var mapOptions = {
	zoom: 15,
	center: new google.maps.LatLng(43.6337886,-79.432927),
	scrollwheel: false,
	disableDefaultUI: true,
	disableDoubleClickZoom: true,
	styles: require('./templates/map')
}

var markerOptions = {
	breakpoints: breakpoints
}

var feedOptions = {
	clientId: '467ede5a6b9b48ae8e03f4e2582aeeb3',
	userId: '2228340350',
	sortBy: 'most-recent',
	template: require('./templates/instagram.html'),
	limit: 6
}

ready(function () {

	Subscribe.init()

	var mapElement = document.querySelector('[data-map]')
	var map = googleMap(mapElement)
	var marker = googleMapMarker()
	var mapPosition = { x: 0.5, y: 0.5 }

	var feedElement = document.querySelector('[data-instagram]')
	var feed = instagramFeed(feedElement)

	var venueAddressLink = document.querySelector('[data-venue-address]')

	events.on(venueAddressLink, 'mouseenter', onVenueMouseEnter)
	google.maps.event.addDomListener(window, 'resize', onMapResize)
	google.maps.event.addDomListener(marker, 'click', onMapMarkerClick)
	google.maps.event.addDomListener(marker, 'mouseover', onMapMarkerMouseOver)
	google.maps.event.addDomListener(marker, 'mouseout', onMapMarkerMouseOut)
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
			title: 'Liberty Grand'
		})
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

	function onMapMarkerMouseOver () {
		venueAddressLink.classList.add('hover')
	}

	function onMapMarkerMouseOut () {
		venueAddressLink.classList.remove('hover')
	}


	function onVenueMouseEnter (e) {
		bounceMarker()
	}

	/**
	 * Helper functions
	 */

	function bounceMarker () {
		if (marker.getAnimation() != null) return
		marker.setAnimation(google.maps.Animation.BOUNCE)
		setTimeout(function () {
			marker.setAnimation(null)
		}, 750)
	}

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
