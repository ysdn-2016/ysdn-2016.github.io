var router = require('page');

var DEFAULT_URL = '/';
var EVENT_URL = '/event/';

module.exports = (function () {
  var $body;
  var $eventPanel;
  var $eventRibbon;
  var $eventRibbonMenu;
  var $eventRibbonMenuToggle;

  var previousUrl = DEFAULT_URL;

  function init () {
    $body = $('body');
    $eventPanel = $('.event-panel');
    $eventRibbon = $('.event-ribbon');
    $eventRibbonMenu = $('.event-ribbon-menu');
    $eventRibbonMenuToggle = $('.event-ribbon-menu-toggle');

    $eventRibbon.on('click', handleEventRibbonClick);
    $eventRibbonMenuToggle.on('click', handleMobileMenuToggle);
  }

  return { init: init };

  /**
   * Private functions
   */

  function showEventPanel () {
    $body.addClass('locked');
    $eventPanel.addClass('event-panel--open');
    $eventRibbon.addClass('event-ribbon--open');
  }

  function hideEventPanel () {
    $body.removeClass('locked');
    $eventPanel.removeClass('event-panel--open');
    $eventRibbon.removeClass('event-ribbon--open');
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
    $eventRibbonMenu.toggleClass('event-ribbon-menu--open');
    $eventRibbonMenuToggle.toggleClass('event-ribbon-menu-toggle--open');
  }

})();
