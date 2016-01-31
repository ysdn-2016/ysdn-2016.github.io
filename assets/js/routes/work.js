
module.exports = function () {
	$('img').unveil(200, function () {
		var $image = $(this);
		$image.load(function () {
			setTimeout(function () {
				$image.attr('lazyloaded', true);
			}, 10);
		})
	});
};
