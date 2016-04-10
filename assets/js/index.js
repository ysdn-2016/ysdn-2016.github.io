var router = require('page');
var loop = require('raf-scroll');
var Lazyload = require('./lib/lazyload');
var Header = require('./lib/header');
var EventRibbon = require('./lib/ribbon');

var routes = {
  about: require('./routes/about'),
  home: require('./routes/home'),
  work: require('./routes/work'),
  project: require('./routes/project'),
  students: require('./routes/students'),
  student: require('./routes/student'),
  event: require('./routes/event')
};

router('/', routes.home);
router('/about/', routes.about);
router('/work/', routes.work);
router('/work/:category/', routes.work);
router('/event/', routes.event);
// router.exit('/event/', routes.event.exit);
router('/:student/:project/', routes.project);
router('/students/', routes.students);
router('/:student/', routes.student);
router.start({ click: false });

$(function () {
  EventRibbon.init();

  // NB: Keep in sync with _header.scss
  enquire.register('screen and (min-width: 600px)', {
    match: function () {
      Header.init();
    },
    unmatch: function () {
      Header.destroy();
    }
  })

  $('a[href="/event/"],a[href="/event"]').on('click', function (e) {
    e.preventDefault();
    EventRibbon.open();
    router('/event/');
  })

  $('a[href="#!top"]').on('click', function (e) {
    e.preventDefault()
    $('html,body,.parallax').animate({ scrollTop: 0 }, {
      easing: 'easeOutExpo',
      duration: 800
    });
  });
});
