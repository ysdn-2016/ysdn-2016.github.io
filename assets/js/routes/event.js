
var store = localStorage

var KEY = 'eventPanelColor';

var savedColor;
var previousColor;

module.exports = function (ctx) {
	var $eventPanel = $('.event-panel');

	savedColor = store.getItem(KEY);
	previousColor = getColor($eventPanel);
	if (savedColor) {
		$eventPanel.removeClass(previousColor);
		$eventPanel.addClass(savedColor);
	} else {
		store.setItem(KEY, previousColor);
	}

	setTimeout(setActionWork, 50);
};

module.exports.exit = function (ctx) {
	var $eventPanel = $('.event-panel');

	if (store.getItem(KEY)) {
		store.removeItem(KEY);
		$eventPanel.removeClass(savedColor);
		$eventPanel.addClass(previousColor);
	}

	setTimeout(setActionShow, 50);
}

function setActionShow () {
	$('.event-ribbon-info-cta').text('Event Information');
}

function setActionWork () {
	$('.event-ribbon-info-cta').text('Student Work');
}

function getColor ($el) {
	if ($el.hasClass('yellow')) return 'yellow'
	if ($el.hasClass('red')) return 'red'
	return 'blue'
}
