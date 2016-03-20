var router = require('page');

var DEFAULT_URL = '/';
var EVENT_URL = '/event/';

module.exports = (function () {
  var $body;
  var $eventPanel;
  var $eventRibbon;

  var previousUrl = DEFAULT_URL;

  function init () {
    $body = $('body');
    $eventPanel = $('.event-panel');
    $eventRibbon = $('.event-ribbon-trigger');
    $eventRibbon.on('click', handleEventRibbonClick);
  }

  return { init: init };

  /**
   * Private functions
   */

  function handleEventRibbonClick (e) {
    e.preventDefault();
    if ($eventPanel.hasClass('event-panel--open')) {
      $body.removeClass('locked');
      $eventPanel.removeClass('event-panel--open');
      router(previousUrl);
    } else {
      $body.addClass('locked');
      $eventPanel.addClass('event-panel--open');
      previousUrl = router.current;
      router(EVENT_URL);
    }
  }

})();
