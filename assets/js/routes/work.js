
module.exports = function () {
	$('img').unveil(200, function () {
		var $image = $(this);
		$image.load(function () {
			$image.removeAttr('data-src');
			$image.attr('lazyloaded', true);
		})
	});
};
