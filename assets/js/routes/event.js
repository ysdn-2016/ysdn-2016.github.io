
module.exports = function (ctx) {
	var $html = $('html');
	var $panel = $('.event-panel');

	setTimeout(setActionWork, 50);
};

module.exports.exit = function (ctx) {
	setTimeout(setActionShow, 50);
}

function setActionShow () {
	$('.event-ribbon-info-cta').text('Event Information');
}

function setActionWork () {
	$('.event-ribbon-info-cta').text('Student Work');
}
