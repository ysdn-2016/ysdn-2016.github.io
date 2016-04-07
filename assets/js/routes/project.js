var slugify = require('slug-component');
var loop = require('raf-scroll');

var isBetween = require('../lib/utils').isBetween;
var standard = require('./project-standard');
var caseStudy = require('./project-case-study');

var PINNED_SCROLL_OFFSET_FROM_TOP = 60;
var PINNED_SCROLL_OFFSET_FROM_BOTTOM = 30;

module.exports = function () {

  var isCaseStudy = $('.project').hasClass('project--case-study');

  /**
   * Trigger different routes
   */

  if (isCaseStudy) {
    caseStudy();
  } else {
    standard();
  }

  /**
   * Sticky Sidebar
   */

  var $window = $(window);
  var $document = $(document);
  var $header = $('.header');
  var $project = $('.project-body');
  var $sidebar = $('.project-sidebar');
  var $content = $('.project-content');

  var isPinned = false;
  var isPinnedToBottom = false;
  var shouldPinToTop = false;
  var isSidebarSmallerThanWindow = false;
  var isSidebarLargerThanContent = false;
  var isContentLargerThanSidebar = false;
  var isHeaderMaximized = false;

  var tracks = {
    pinned: { start: 0, end: 0, offset: 0 },
    bottom: { start: 0, end: 0 },
  };

  var lastScrollY = 0;
  var heights = {
    content: 0,
    sidebar: 0,
    window: 0
  };

  loop.add(scroll);
  $window.on('resize load', resize);
  $document.on('DOMContentLoaded', resize);
  $window.on('header:maximize', headerMaximized);
  $window.on('header:minimize', headerMinimized);

  $(document).on('mouseenter', '.project-footer-preview-title', projectMouseEnter);
  $(document).on('mouseleave', '.project-footer-preview-title', projectMouseLeave);
  $(document).on('mouseenter', '.project-footer-preview-image', projectMouseEnter);
  $(document).on('mouseleave', '.project-footer-preview-image', projectMouseLeave);

  $project.fitVids();
  resize();

  function resize () {
    $sidebar.css('width', $sidebar.parent().innerWidth());
    heights.content = $content.innerHeight();
    heights.sidebar = $sidebar.innerHeight();
    heights.window = $window.height();
    isSidebarSmallerThanWindow = (heights.sidebar + 60) < heights.window;
    isContentLargerThanSidebar = heights.content > heights.sidebar;
    isSidebarLargerThanContent = heights.content < heights.sidebar;
    setTracks();
    if (isSidebarLargerThanContent) {
      $('.project-body').css('height', heights.sidebar);
    }
  }

  function scroll (e) {
    var scrollY = e.deltaY;
    if (scrollY === lastScrollY) return;
    refresh();
    lastScrollY = scrollY;
  }

  function refresh () {
    isBetween(scrollY, tracks.pinned.start, tracks.pinned.end) ? pin() : unpin();
    isBetween(scrollY, tracks.bottom.start, tracks.bottom.end) ? pinToBottom() : unpinToBottom();
  }

  function pin () {
    if (isPinned) return;
    if (isPinnedToBottom) return;
    $sidebar.css('top', tracks.pinned.offset);
    $sidebar.addClass('pinned');
    isPinned = true;
  }

  function unpin () {
    if (!isPinned) return;
    $sidebar.removeClass('pinned');
    $sidebar.css('top', '');
    isPinned = false;
  }

  function pinToBottom () {
    if (isPinnedToBottom) return;
    $sidebar.addClass('bottom');
    isPinnedToBottom = true;
  }

  function unpinToBottom () {
    if (!isPinnedToBottom) return;
    $sidebar.removeClass('bottom');
    isPinnedToBottom = false;
  }

  function setTracks () {
    var projectOffset = $project.offset();
    shouldPinToTop = isCaseStudy || heights.sidebar < heights.window
    if (shouldPinToTop) {
      tracks.pinned.start = projectOffset.top - PINNED_SCROLL_OFFSET_FROM_TOP;
      tracks.pinned.end = projectOffset.top + $project.innerHeight() - $sidebar.outerHeight() - PINNED_SCROLL_OFFSET_FROM_TOP;
      tracks.pinned.offset = PINNED_SCROLL_OFFSET_FROM_TOP;
      tracks.bottom.start = tracks.pinned.end;
      tracks.bottom.end = $(document).height();
    } else {
      // Standard Project: pin-to-bottom
      var sidebarScrollOffset = (heights.sidebar - heights.window + PINNED_SCROLL_OFFSET_FROM_BOTTOM)
      tracks.pinned.start = projectOffset.top + sidebarScrollOffset;
      tracks.pinned.end = projectOffset.top + $project.innerHeight() - heights.window + PINNED_SCROLL_OFFSET_FROM_BOTTOM;
      tracks.pinned.offset = -(heights.sidebar - heights.window + PINNED_SCROLL_OFFSET_FROM_BOTTOM);
      tracks.bottom.start = tracks.pinned.end;
      tracks.bottom.end = $(document).height();
    }

    if (isHeaderMaximized) {
      var height = $header.height();
      tracks.pinned.start = tracks.pinned.start - height;
      tracks.pinned.end = tracks.pinned.end - height;
      tracks.pinned.offset = tracks.pinned.offset + height;
      tracks.bottom.start = tracks.bottom.start - height;
      tracks.bottom.end = tracks.bottom.end - height;
    }
  }

  function projectMouseEnter (e) {
    $(this).parents('.project-footer-preview').addClass('hover');
  }

  function projectMouseLeave (e) {
    $(this).parents('.project-footer-preview').removeClass('hover');
  }

  function headerMaximized () {
    isHeaderMaximized = true;
    setTracks();
    refresh();
  }

  function headerMinimized () {
    isHeaderMaximized = false;
    setTracks();
    refresh();
  }

};
