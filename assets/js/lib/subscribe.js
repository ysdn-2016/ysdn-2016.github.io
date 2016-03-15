
var dom = require('dom')
var enquire = require('enquire.js')
var scrollTo = require('scroll-to')
var scrollMonitor = require('scrollmonitor')

var scrollAnimationOptions = {
	ease: 'out-quart',
	duration: 500
}

module.exports = (function () {

	var html
	var body
	var notice
	var noticeOverlay
	var noticeScrollWatcher
	var noticeOpenLink
	var noticeCloseLink
	var noticeInput

	var savedScrollPosition = 0

	function init () {
		html = dom('html')
		body = dom('body')
		notice = dom('.event-full-site-notice')
		noticeOverlay = dom('.event-full-site-notice-overlay')
		noticeScrollWatcher = scrollMonitor.create(notice)
		noticeOpenLink = dom('[data-subscribe-open]')
		noticeCloseLink = dom('[data-subscribe-close]')
		noticeInput = dom('input[name="EMAIL"]')

		noticeOpenLink.on('click', noticeOpenClick)
		noticeCloseLink.on('click', noticeCloseClick)
		noticeOverlay.on('click', noticeOverlayClick)
		noticeOverlay.on('touchend', noticeOverlayClick)
		noticeOverlay.on('mouseenter', noticeOverlayHover)
		noticeOverlay.on('mouseleave', noticeOverlayLeave)
		noticeScrollWatcher.enterViewport(scrollEnterNotice)
		noticeScrollWatcher.exitViewport(scrollLeaveNotice)

		enquire.register('screen and (max-width: 769px)', {
			match: function () {
				noticeOpenLink.off('click', noticeOpenClick)
				notice.on('click', noticeOpenClick)
			},
			unmatch: function () {
				notice.off('click', noticeOpenClick)
				noticeOpenLink.on('click', noticeOpenClick)
			}
		})
	}

	function open () {
		savedScrollPosition = getScrollY()
		scrollTo(0, 0, scrollAnimationOptions)
		html.on('touchstart', preventDefault)
		notice.on('touchstart', stopPropagation)
		notice.addClass('event-full-site-notice--active')
		body.addClass('locked')
		noticeInput[0].focus()
	}

	function close () {
		scrollTo(0, savedScrollPosition || 0, scrollAnimationOptions)
		html.off('touchstart', preventDefault)
		notice.off('touchstart', stopPropagation)
		notice.removeClass('event-full-site-notice--active')
		body.removeClass('locked')
	}

	return {
		init: init,
		open: open,
		close: close
	}

	/**
	 * Event Handler
	 */

	function scrollEnterNotice () {
		html.addClass('blue-elastic-scroll')
	}

	function scrollLeaveNotice () {
		html.removeClass('blue-elastic-scroll')
	}

	function noticeOpenClick (e) {
		e.preventDefault()
		if (notice.hasClass('event-full-site-notice--active')) return
		open()
	}

	function noticeCloseClick (e) {
		e.preventDefault()
		e.stopPropagation()
		close()
	}

	function noticeOverlayClick (e) {
		e.preventDefault()
		if (!notice.hasClass('event-full-site-notice--active')) return
		close()
	}

	function noticeOverlayHover () {
		noticeCloseLink.addClass('hover')
	}

	function noticeOverlayLeave () {
		noticeCloseLink.removeClass('hover')
	}

	function preventDefault (e) {
		e.preventDefault()
	}

	function stopPropagation (e) {
		e.stopPropagation()
	}

	function getScrollY () {
		var doc = document.documentElement
		return (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0)
	}

})()
