
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
		allowedTags: ['span', 'a', 'p', 'strong', 'em', 'i', 'b', 'div', 'img', 'br']
	}
}

module.exports = function (input, length) {
	const str = input.toString()
	const unsafeHTML = markdown(str)
	const html = santize(unsafeHTML, opts.santize)
	const stripped = stripTags(html)
	const trimmed = trimToWord(stripped, length)
	const result = stripped.length > length ? [trimmed, opts.truncate.char].join('') : trimmed
	return result
}

function stripTags (html) {
	return html
		.replace(/<\/?br\/?>/gi, ' ')
		.replace('&nbsp;', ' ')
		.replace(/(<([^>]+)>)/ig, '')
}

function trimToWord (str, length) {
	const trimmed = str.substr(0, length)
	const trimmedToWord = trimmed.substr(0, Math.min(trimmed.length, trimmed.lastIndexOf(' ')))
	return trimmedToWord
}
