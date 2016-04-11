var router = require('page');
var css = require('veinjs');
var Lazyload = require('./lazyload')

var DEFAULT_URL = '/work/';
var EVENT_URL = '/event/';

var SCROLL_THRESHOLD = 10;
var TRANSITION_END = 'transitionend webkitTransitionEnd msTransitionEnd';

var noop = function () {};

module.exports = (function () {
  var $document;
  var $body;
  var $window;
  var $header;
  var $eventPanel;
  var $eventContent;
  var $eventRibbon;
  var $eventRibbonMenu;
  var $eventRibbonMenuToggle;
  var $eventRibbonMenuOverlay;

  var isOpen = false;
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
      $eventRibbon.addClass('event-ribbon--no-transition');
      $window.on('resize', fixMobileTransition)
      $window.on('scrolldelta', handleMobileScroll);
      $window.on('resize orientationchange', showMobileRibbon);
      fixMobileTransition();
      setTimeout(function () {
        $eventRibbon.removeClass('event-ribbon--no-transition');
      }, 5)
    },
    unmatch: function () {
      $window.off('resize', fixMobileTransition)
      $window.off('scrolldelta', handleMobileScroll);
      $window.off('resize orientationchange', showMobileRibbon);
      unfixMobileTransition();
    }
  }

  var desktopHandler = {
    match: function () {
      isMobileSize = false;
      $eventRibbon.addClass('event-ribbon--no-transition');
      $window.on('resize', fixDesktopTransition);
      unfixMobileTransition();
      setTimeout(function () {
        $eventRibbon.removeClass('event-ribbon--no-transition');
      }, 5)
    }
  }

  /**
   * Exports
   */

  function init () {
    $body = $('body');
    $window = $(window);
    $document = $(document);
    $header = $('.header');
    $eventPanel = $('.event-panel');
    $eventContent = $('.event-panel-content');
    $eventRibbon = $('.event-ribbon');
    $eventRibbonMenu = $('.event-ribbon-menu');
    $eventRibbonMenuToggle = $('.event-ribbon-menu-toggle');
    $eventRibbonMenuOverlay = $('.event-ribbon-menu-overlay');

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

  return { init: init, destroy: destroy, open: showEventPanel, close: hideEventPanel };

  /**
   * Private functions
   */

  function showEventPanel () {
    isOpen = true;
    hideMobileMenu();
    fixMobileTransition();
    $body.addClass('locked');
    $body.on('touchmove', preventDefault);
    $eventContent.on('touchmove', stopPropagation);
    $eventPanel.addClass('event-panel--open event-panel--is-transitioning');
    $eventRibbon.addClass('event-ribbon--open');
    if (!isMobileSize) {
      $header.addClass('header--fixed header--maximized');
    }
    $eventPanel.on(TRANSITION_END, handlePanelTransitionEnd);
    previousUrl = router.current;
    router(EVENT_URL);
  }

  function hideEventPanel () {
    $body.removeClass('locked');
    $body.off('touchmove', preventDefault);
    $eventContent.off('touchmove', stopPropagation);
    $eventPanel.removeClass('event-panel--open');
    $eventPanel.addClass('event-panel--is-transitioning');
    $eventRibbon.removeClass('event-ribbon--open');
    $eventPanel.on(TRANSITION_END, handlePanelTransitionEnd);
    isOpen = false;
    router(previousUrl);
    Lazyload.update().check()
  }

  function showMobileMenu () {
    $eventRibbonMenu.addClass('event-ribbon-menu--open');
    $eventRibbonMenuToggle.addClass('event-ribbon-menu-toggle--open');
    $eventRibbonMenuOverlay.addClass('event-ribbon-menu-overlay--open');
    $eventRibbonMenuOverlay.on('click', hideMobileMenu);
  }

  function hideMobileMenu (e) {
    if (e) {
      e.stopPropagation();
    }
    $eventRibbonMenu.removeClass('event-ribbon-menu--open');
    $eventRibbonMenuToggle.removeClass('event-ribbon-menu-toggle--open');
    $eventRibbonMenuOverlay.removeClass('event-ribbon-menu-overlay--open');
    $eventRibbonMenuOverlay.off('click', hideMobileMenu);
  }

  function showMobileRibbon () {
    if (isOpen) return;
    $eventRibbon.removeClass('event-ribbon--minimized');
  }

  function hideMobileRibbon () {
    if (isOpen) return;
    $eventRibbon.addClass('event-ribbon--minimized');
  }

  function fixMobileTransition () {
    if (!isMobileSize) return;
    var windowHeight = window.innerHeight;
    var ribbonOffset = windowHeight - $eventRibbon.innerHeight();
    css.inject('.event-panel', { height: null, bottom: null });
    css.inject('.event-panel--open', { transform: null });
    css.inject('.event-ribbon--open', { transform: null });
    css.inject('.event-panel', { height: ribbonOffset + 'px', bottom: -ribbonOffset + 'px' });
    css.inject('.event-panel--open', { transform: 'translateY(-' + ribbonOffset + 'px)' });
    css.inject('.event-ribbon--open', { transform: 'translateY(-' + ribbonOffset + 'px)' });
    $header.removeClass('header--maximized header--fixed');
  }

  function unfixMobileTransition () {
    css.inject('.event-panel', { height: null, bottom: null });
    css.inject('.event-panel--open', { transform: null });
    css.inject('.event-ribbon--open', { transform: null });
  }

  function fixDesktopTransition () {
    if (!isOpen) return;
    $header.addClass('header--fixed header--maximized');
  }
  function handleEventRibbonClick (e) {
    e.preventDefault();
    if ($eventPanel.hasClass('event-panel--open')) {
      hideEventPanel();
    } else {
      showEventPanel();
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

  function handlePanelTransitionEnd () {
    $eventPanel.removeClass('event-panel--is-transitioning');
  }

  function preventDefault (e) {
    e.preventDefault();
  }

  function stopPropagation (e) {
    e.stopPropagation();
  }

})();
