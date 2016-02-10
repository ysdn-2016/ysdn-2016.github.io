var router = require('page');

var routes = {
  home: require('./routes/home'),
  work: require('./routes/work'),
  project: require('./routes/project'),
  students: require('./routes/students'),
  student: require('./routes/student'),
  event: require('./routes/event')
};

router('/', routes.home);
router('/work/', routes.work);
router('/:student/:project/', routes.project);
router('/students/', routes.students);
router('/:student/', routes.student);
router('/event/', routes.event);
router.start({ click: false });

$(function () {
	var $body = $('body');
	var $eventPanel = $('.event-panel');
	var $eventRibbon = $('.event-ribbon-trigger');

  // TODO: find a better spot for this
  $('img[data-src]').unveil(200, function () {
		var $image = $(this);
		$image.load(function () {
			$image.removeAttr('data-src');
			$image.attr('lazyloaded', true);
		})
	});

	$eventRibbon.on('click', handleEventRibbonClick);

	function handleEventRibbonClick (e) {
		e.preventDefault();
    if ($eventPanel.hasClass('event-panel--open')) {
      $body.removeClass('locked');
      $eventPanel.removeClass('event-panel--open');
    } else {
      $body.addClass('locked');
      $eventPanel.addClass('event-panel--open');
      router('/event/');
    }
	}
});
