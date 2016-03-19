
var slugify = require('slug-component');
var loop = require('raf-scroll')

var isBetween = require('../lib/utils').isBetween;
var standard = require('./project-standard');
var caseStudy = require('./project-case-study');

var SCROLL_TO_OFFSET = 60

module.exports = function () {
  var route = $('.project').hasClass('project--case-study')
    ? caseStudy()
    : standard();

  /**
   * Sticky Sidebar
   */

  var $window = $(window);
  var $document = $(document);
  var $body = $('.project-body');
  var $sidebar = $('.project-sidebar');
  var $content = $('.project-content');

  var tracks = {
    pinned: { start: 0, end: 0 },
    bottom: { start: 0, end: 0 },
  }
  var lastScrollY = 0
  var heights = {
    content: 0,
    sidebar: 0
  }

  loop.add(scroll);
  $window.on('resize load', resize);
  $document.on('DOMContentLoaded', resize);

  $body.fitVids();
  resize();

  function resize () {
    $sidebar.css('width', $sidebar.parent().innerWidth())
    heights.content = $content.innerHeight()
    heights.sidebar = $sidebar.innerHeight()
    setTracks()
  }

  function scroll (e) {
    var scrollY = e.deltaY
    if (scrollY === lastScrollY) return
    var shouldPin = heights.content > heights.sidebar
    $sidebar.toggleClass('pinned', shouldPin && isBetween(scrollY, tracks.pinned.start, tracks.pinned.end))
    $sidebar.toggleClass('bottom', shouldPin && isBetween(scrollY, tracks.bottom.start, tracks.bottom.end))
    lastScrollY = scrollY
  }

  function setTracks () {
    var bodyOffset = $body.offset()
    tracks.pinned.start = bodyOffset.top - SCROLL_TO_OFFSET
    tracks.pinned.end = bodyOffset.top + $body.innerHeight() - $sidebar.outerHeight() - SCROLL_TO_OFFSET
    tracks.bottom.start = tracks.pinned.end
    tracks.bottom.end = $(document).height()
  }

};
