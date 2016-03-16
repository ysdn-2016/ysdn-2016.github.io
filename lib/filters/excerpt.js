
var truncate = require('truncate-html')
var markdown = require('marked')
var santize = require('insane')

markdown.setOptions({
	breaks: true
})

var opts = {
	truncate: {
		char: '…'
	},
	santize: {
		allowedAttributes: {
	    a: ["href", "name", "target"],
	  },
	  allowedClasses: {},
	  allowedSchemes: ["http", "https", "mailto"],
		allowedTags: ['span', 'a', 'p', 'strong', 'em', 'i', 'b', 'div']
	}
}

console.log('HSDKFHKJSDHFJKSDHJF')

module.exports = function (input, length) {
	const str = input.toString()
	const unsafeHTML = markdown(str)
	const html = santize(unsafeHTML, opts.santize)
	const stripped = html.replace(/(<([^>]+)>)/ig, '')
	const trimmed = stripped.substr(0, length)
	const trimmedToWord = trimmed.substr(0, Math.min(trimmed.length, trimmed.lastIndexOf(' ')))
	const result = stripped.length > length ? [trimmedToWord, opts.truncate.char].join('') : trimmedToWord
	return result
}
