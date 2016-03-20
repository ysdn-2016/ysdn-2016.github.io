var router = require('page');
var Lazyload = require('./lib/lazyload');
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
router('/event/', routes.event);
router('/:student/:project/', routes.project);
router('/students/', routes.students);
router('/:student/', routes.student);
router.start({ click: false });

$(function () {
  EventRibbon.init();
});
