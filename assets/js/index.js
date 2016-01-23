
var $ = require('jquery')
var router = require('page')

var home = require('./routes/home')
var work = require('./routes/work')
var students = require('./routes/students')
var event = require('./routes/event')

$(function () {

	router('/', routes.home)
	router('/work/:project?', routes.work)
	router('/students/:student?', routes.student)
	routes('/event', routes.event)
	router.start()

})
