var router = require('page');
var css = require('veinjs');

var DEFAULT_URL = '/work/';
var EVENT_URL = '/event/';

module.exports = (function () {
  var $body;
  var $window;
  var $eventPanel;
  var $eventRibbon;
  var $eventRibbonMenu;
  var $eventRibbonMenuToggle;

  var isOpen = false;
  // NOTE: we're using user agent because the bug this fixes relates to
  // Safari's browser chrome, not the smaller browser size
  var isMobileSafari = /iPhone|iPad/i.test(window.navigator.userAgent);
  var previousUrl = DEFAULT_URL;

  function init () {
    $body = $('body');
    $window = $(window);
    $eventPanel = $('.event-panel');
    $eventRibbon = $('.event-ribbon');
    $eventRibbonMenu = $('.event-ribbon-menu');
    $eventRibbonMenuToggle = $('.event-ribbon-menu-toggle');

    isOpen = $eventPanel.hasClass('event-panel--open');

    $eventRibbon.on('click', handleEventRibbonClick);
    $eventRibbonMenuToggle.on('click', handleMobileMenuToggle);

    $window.on('resize', fixMobileSafariScrollHandler)
    fixMobileSafariScrollHandler();
  }

  return { init: init };

  /**
   * Private functions
   */

  function showEventPanel () {
    $body.addClass('locked');
    $eventPanel.addClass('event-panel--open');
    $eventRibbon.addClass('event-ribbon--open');
    isOpen = true;
    hideMobileMenu();
    fixMobileSafariScrollHandler();
  }

  function hideEventPanel () {
    $body.removeClass('locked');
    $eventPanel.removeClass('event-panel--open');
    $eventRibbon.removeClass('event-ribbon--open');
    isOpen = false;
  }

  function handleEventRibbonClick (e) {
    e.preventDefault();
    if ($eventPanel.hasClass('event-panel--open')) {
      hideEventPanel();
      router(previousUrl);
    } else {
      showEventPanel();
      previousUrl = router.current;
      router(EVENT_URL);
    }
  }

  function handleMobileMenuToggle (e) {
    e.preventDefault();
    e.stopPropagation();
    if ($eventRibbonMenu.hasClass('event-ribbon-menu--open')) {
      hideMobileMenu();
    } else {
      showMobileMenu();
    }
  }

  function showMobileMenu () {
    $eventRibbonMenu.addClass('event-ribbon-menu--open');
    $eventRibbonMenuToggle.addClass('event-ribbon-menu-toggle--open');
  }

  function hideMobileMenu () {
    $eventRibbonMenu.removeClass('event-ribbon-menu--open');
    $eventRibbonMenuToggle.removeClass('event-ribbon-menu-toggle--open');
  }

  function fixMobileSafariScrollHandler () {
    if (!isOpen) return;
    var windowHeight = window.innerHeight;
    var ribbonOffset = windowHeight - $eventRibbon.innerHeight();
    css.inject('.event-panel', { height: ribbonOffset + 'px', bottom: -ribbonOffset + 'px' });
    css.inject('.event-panel--open', { transform: 'translateY(-' + ribbonOffset + 'px)' });
    css.inject('.event-ribbon--open', { transform: 'translateY(-' + ribbonOffset + 'px)' });
  }

})();
