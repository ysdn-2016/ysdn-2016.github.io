var router = require('page');
var css = require('veinjs');

var DEFAULT_URL = '/work/';
var EVENT_URL = '/event/';

var SCROLL_THRESHOLD = 10;

var noop = function () {};

module.exports = (function () {
  var $document;
  var $body;
  var $window;
  var $eventPanel;
  var $eventRibbon;
  var $eventRibbonMenu;
  var $eventRibbonMenuToggle;

  var isOpen = false;
  var isShowingOnMobile = false;
  var isMobileSize = false;
  // NOTE: we're using user agent because the bug this fixes relates to
  // Safari's browser chrome, not the smaller browser size
  var isMobileSafari = /iPhone|iPad/i.test(window.navigator.userAgent);
  var previousUrl = DEFAULT_URL;

  var mobileQuery = 'screen and (max-width: 600px)';
  var desktopQuery = 'screen and (min-width: 600px)';

  var mobileHandler = {
    match: function () {
      isMobileSize = true;
      isShowingOnMobile = true;
      $window.on('resize', fixMobileTransition)
      $window.on('scrolldelta', handleMobileScroll);
      $window.on('resize orientationchange', showMobileRibbon);
      fixMobileTransition();
    },
    unmatch: function () {
      $window.off('resize', fixMobileTransition)
      $window.off('scrolldelta', handleMobileScroll);
      $window.off('resize orientationchange', showMobileRibbon);
    }
  }

  var desktopHandler = {
    match: function () {
      isMobileSize = false;
      unfixMobileTransition();
    }
  }

  /**
   * Exports
   */

  function init () {
    $body = $('body');
    $window = $(window);
    $document = $(document);
    $eventPanel = $('.event-panel');
    $eventRibbon = $('.event-ribbon');
    $eventRibbonMenu = $('.event-ribbon-menu');
    $eventRibbonMenuToggle = $('.event-ribbon-menu-toggle');

    if ($eventPanel.hasClass('event-panel--open')) {
      showEventPanel();
    }

    $eventRibbon.on('click', handleEventRibbonClick);
    $eventRibbonMenu.on('click', stopPropagation);
    $eventRibbonMenuToggle.on('click', handleMobileMenuToggle);

    enquire.register(mobileQuery, mobileHandler);
    enquire.register(desktopQuery, desktopHandler);
  }

  function destroy () {
    enquire.unregister(mobileQuery, mobileHandler);
  }

  return { init: init, destroy: destroy };

  /**
   * Private functions
   */

  function showEventPanel () {
    isOpen = true;
    hideMobileMenu();
    fixMobileTransition();
    $body.addClass('locked');
    $body.on('touchmove', preventDefault);
    $eventPanel.on('touchmove', stopPropagation);
    $eventPanel.addClass('event-panel--open');
    $eventRibbon.addClass('event-ribbon--open');
  }

  function hideEventPanel () {
    $body.removeClass('locked');
    $body.off('touchmove', preventDefault);
    $eventPanel.off('touchmove', stopPropagation);
    $eventPanel.removeClass('event-panel--open');
    $eventRibbon.removeClass('event-ribbon--open');
    isOpen = false;
  }

  function showMobileMenu () {
    $eventRibbonMenu.addClass('event-ribbon-menu--open');
    $eventRibbonMenuToggle.addClass('event-ribbon-menu-toggle--open');
  }

  function hideMobileMenu () {
    $eventRibbonMenu.removeClass('event-ribbon-menu--open');
    $eventRibbonMenuToggle.removeClass('event-ribbon-menu-toggle--open');
  }

  function showMobileRibbon () {
    $eventRibbon.removeClass('event-ribbon--minimized');
  }

  function hideMobileRibbon () {
    $eventRibbon.addClass('event-ribbon--minimized');
  }

  function fixMobileTransition () {
    if (!isMobileSize) return;
    var windowHeight = window.innerHeight;
    var ribbonOffset = windowHeight - $eventRibbon.innerHeight();
    css.inject('.event-panel', { height: ribbonOffset + 'px', bottom: -ribbonOffset + 'px' });
    css.inject('.event-panel--open', { transform: 'translateY(-' + ribbonOffset + 'px)' });
    css.inject('.event-ribbon--open', { transform: 'translateY(-' + ribbonOffset + 'px)' });
  }

  function unfixMobileTransition () {
    css.inject('.event-panel', { height: null, bottom: null });
    css.inject('.event-panel--open', { transform: null });
    css.inject('.event-ribbon--open', { transform: null });
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

  function handleMobileScroll (e) {
    var scrollY = e.scrollTop;
    var delta = e.scrollTopDelta;
    if (delta < 1 && delta <= (SCROLL_THRESHOLD * -1)) {
      showMobileRibbon();
    } else if (delta > 1 && delta >= SCROLL_THRESHOLD && scrollY > 0) {
      hideMobileRibbon();
    }
  }

  function preventDefault (e) {
    e.preventDefault();
  }

  function stopPropagation (e) {
    e.stopPropagation();
  }

})();
