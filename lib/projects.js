
'use strict'

var slug = require('slug-component')
var url = require('url')
var cheerio = require('cheerio')
var omit = require('key-del')

var markdown = require('./filters/markdown')
var assetUrl = require('./filters/asset')
var categoryToDiscipline = require('./filters/categoryToDiscipline')

var clone = obj => Object.assign({}, obj)
var isOdd = n => n % 2 !== 0
// NOTE: this function is taken from https://git.io/va6dy, don't replace it with
// another `slug` function! It needs to be this one.
var markdownSlug = str => str.toLowerCase().replace(/[^\w]+/g, '-')
var trimFirstCharacter = str => str.substring(1)


module.exports = () => {
	return (files, metalsmith, done) => {
		var filenames = Object.keys(files)
		var projects = metalsmith._metadata.projects
		var students = metalsmith._metadata.students

		filenames.forEach(filename => mixin(files[filename], students))
		projects.forEach(project => mixin(project, students))

		metalsmith._metadata.projectsHash = projects.map(toHash)

		done()
	}
}


/**
 * Normalize project `owner` information into metadata and swap out markdown
 * URLs to Amazon S3 URLs.
 *
 * @param project		{Object}
 * @param students	{Array}
 */
function mixin (project, students) {
	if (!project.owner_id) return
	if (project._mixin) return

	var contents = project.contents.toString()

	/**
	 * Normalize owner data
	 */
	var owner = students.find(student => student.id === project.owner_id)
	if (owner) {
		project.owner = owner
		// NOTE: this line is for properly setting permalinks, which can't access
		// a property of the `owner` key
		project.owner_name = owner.name
	}

	/**
	 * Swap out local asset URLs to S3 URLs
	 */
	var assets = project.assets
	assets.forEach(asset => {
		contents = replaceAll(contents, `\\(${asset.name}\\)`, `(${assetUrl(asset)})`)
	})

	/**
	 * Case Study modifications
	 * — Define headers (for project sidebar)
	 * — Strip first image and set it to project.headerImage
	 */
	if (project.type === 'case-study') {
		project.headers = defineHeaders(contents)
		project.headerImage = findFirstAssetFromMarkdownString(contents, assets)
		contents = stripFirstImage(contents)
	}

	/**
	 * Wrap images in figure tags
	 */
	contents = lazyloadWrapImages(contents, assets)

	/**
	 * Set metadata
	 */
	project.contents = new Buffer(contents)
	project.href = `/${slug(project.owner_name)}/${slug(project.title)}/`
	project.layout = 'project.html'
	project._mixin = true
}

function toHash (project) {
	return {
		id: project.id,
		category: project.category,
		discipline: categoryToDiscipline(project.category),
		type: project.type,
		title: project.title,
		weight: project.weight,
		thumbnail: Object.assign({}, project.thumbnail, {
			asset400: assetUrl(project.thumbnail, { width: 400 }),
			asset800: assetUrl(project.thumbnail, { width: 800 })
		}),
		href: project.href,
		owner: {
			id: project.owner.id,
			name: project.owner.name,
			href: project.owner.href
		}
	}
}

function lazyloadWrapImages (contents, allAssets) {
	var imageRegexp = /!\[.*\]\(.+\)/gi
	var images = contents.match(imageRegexp)
	if (!images) return contents
	var assets = images.map(image => findFirstAssetFromMarkdownString(image, allAssets))
	var result = contents

	images.forEach((image, i) => {
		var asset = assets[i]
		result = result.replace(image, figureTemplate(asset))
	})

	return result
}

function stripFirstImage (contents) {
	return contents.replace(/!\[.*\]\((.+)\)\n?/i, '')
}

function defineHeaders (contents) {
	var markdownMatches = contents.match(/^#{1,6}\s.+/gm) || []
	var htmlMatches = contents.match(/^<h(\d).*>.*<\/h\1>/gm) || []
	var matches = markdownMatches.concat(htmlMatches)

	if (!matches.length) return []

	var results = matches
		.map(headerToObject)
		.filter(match => isOdd(match.level))

	return results
}

function headerToObject (match) {
	return match.charAt(0) !== '<'
		? markdownHeaderToObject(match)
		: htmlHeaderToObject(match)
}

function htmlHeaderToObject (match) {
	var components = /^<h(\d).*>(.*)<\/h\1>/g.exec(match)
	var level = components[1]
	var text = components[2].trim()
	var id = markdownSlug(text)
	var href = '#' + id
	return { id, level, href, text }
}

function markdownHeaderToObject (match) {
	var text = match.replace(/^#+\s/g, '')
	var id = markdownSlug(text)
	var level = match.split('#').length - 1
	var href = '#' + id
	return { id, level, href, text }
}

function replaceAll (str, search, replacement) {
	return str.replace(new RegExp(search, 'gi'), replacement)
}

function figureTemplate (asset) {
	if (!asset) {
		return `<figure class="missing-figure"><svg viewBox="0 0 1200 500" preserveAspectRatio="xMinYMin" width="1200"><rect x="0" y="0" width="100%" height="100%"></rect></svg></figure>`
	}
	var standardSrc = assetUrl(asset, { width: 800 })
	var retinaSrc = assetUrl(asset, { width: 1600 })
	return `<figure>
		<svg viewBox="0 0 ${asset.width} ${asset.height}" preserveAspectRatio="xMinYMin" width="${asset.width}">
			<rect x="0" y="0" width="100%" height="100%"></rect>
		</svg>
		<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP4z8BQDwAEgAF/posBPQAAAABJRU5ErkJggg==" data-src="${standardSrc}" data-retina-src="${retinaSrc}" />
	</figure>`.replace(/\n/g, '')
}

function findFirstAssetFromMarkdownString (str, assets) {
	var image = /!\[.*\]\((.+)\)/i
	var src = str.match(image)
	if (!src || !src[1]) return

	var pathWithLeadingSlash = url.parse(src[1]).path
	var path = trimFirstCharacter(pathWithLeadingSlash)
	var asset = assets.find(asset => asset.path === path)
	return asset
}
