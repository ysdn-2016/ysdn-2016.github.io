
var images = /<img ([^>]+)>/gi
var template = `
	<figure class="project-figure">
		<svg class="project-figure-placeholder" viewBox="0 0 {{ project.thumbnail.width }} {{ project.thumbnail.height }}" preserveAspectRatio="xMinYMin" width="{{ project.thumbnail.width }}">
			<rect x="0" y="0" width="100%" height="100%"></rect>
		</svg>
		<img class="project-figure-image" src="{{ pixel }}" data-src="{{ project.thumbnail | asset_url }}" />
	</figure>
`

module.exports = function (input) {
	// input.replace(images, template)
	return input
}
