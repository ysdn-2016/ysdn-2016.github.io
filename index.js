#!/usr/bin/env node

var fs = require('fs')
var koa = require('koa')
var compression = require('koa-compress')
var serve = require('koa-static')

var server = koa()
var port = process.env.PORT || 8080

server.use(function * (next) {
	yield next
	if (this.status !== 404) return
	this.status = 404
	this.type = 'html'
	this.body = fs.createReadStream(`${__dirname}/../build/404.html`)
})
server.use(compression())
server.use(serve('build'))
server.listen(port)

console.log(`Listening on http://localhost:${port}/`)
