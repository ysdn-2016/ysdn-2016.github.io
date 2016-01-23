
var router = require('page')

var routes = {
	home:     require('./routes/home'),
	work:     require('./routes/work'),
	project:  require('./routes/project'),
	students: require('./routes/students'),
	student:  require('./routes/student'),
	event:    require('./routes/event')
}

$(function () {

	router('/', routes.home)
	router('/work/', routes.work)
	router('/work/:project/', routes.project)
	router('/students/', routes.students)
	router('/students/:student/', routes.student)
	router('/event/', routes.event)
	router.start({ click: false })

})
