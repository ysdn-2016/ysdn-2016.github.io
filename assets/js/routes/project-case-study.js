
var loop = require('raf-scroll');

var isBetween = require('../lib/utils').isBetween;

var SCROLL_TO_OFFSET = 80;
var SCROLL_RATE = 1000;

module.exports = function () {

	var $body = $('.project-body')
	var $sidebar = $('.project-sidebar')
	var $links = $sidebar.find('.project-sidebar-headers-link')

	/**
	 * Header link active states
	 */

	var isJumpingToHeader = false
	var lastScroll = -1
	var $headers = $('h1,h3,h5')
	var waypoints = getWaypoints($headers)

	loop.add(scroll)

	function scroll (e) {
		var scrollY = e.deltaY
		if (scrollY === lastScroll) return

		for (var i = 0; i < waypoints.length; i++) {
			var waypoint = waypoints[i]
			var betweenWaypoint = isBetween(scrollY, waypoint.start, waypoint.end)
			var isActive = !isJumpingToHeader && betweenWaypoint
			if (isActive === waypoint.active) continue
			waypoint.$link.toggleClass('active', isActive)
			waypoint.active = isActive
		}

		lastScroll = scrollY
	}

	/**
	 * Header link scrolling
	 */

	$links.on('click', function (e) {
		e.preventDefault()
		var $self = $(this)
		var $target = $($self.attr('href'))
		var scroll = $target.offset().top - SCROLL_TO_OFFSET

		scrollTo(scroll)
		$links.removeClass('active')
		$self.addClass('active')
	})

	/**
	 * Private functions
	 */

	function getWaypoints ($headers) {
		var lastEnd = 0
		var $headersWithoutFirst
		var waypoints = $headers.map(function (i, header) {
			var $link = $sidebar.find('[href="#' + header.id + '"]')
			var $header = $(header)
			var $nextHeader = $headers.eq(i + 1)

			var start = lastEnd
			var end = $nextHeader.size() > 0
				? $nextHeader.offset().top - SCROLL_TO_OFFSET
				: 999999
			lastEnd = end

			return {
				$link: $link,
				$header: $header,
				start: start,
				end: end
			}
		})
		return waypoints
	}

	function scrollTo (position) {
		var scrollY = $(window).scrollTop();
		var distance = Math.abs(position - scrollY)
		var duration = constrain(distance, 300, 800)

		isJumpingToHeader = true
		$('html,body').animate({
			scrollTop: position
		}, {
			easing: 'easeOutExpo',
			duration: duration,
			complete: function () {
				isJumpingToHeader = false
			}
		})
	}
};


function constrain (val, min, max) {
	return Math.max(Math.min(val, max), min)
}
