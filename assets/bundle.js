(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var router = require('page');
var loop = require('raf-scroll');
var Lazyload = require('./lib/lazyload');
var Header = require('./lib/header');
var EventRibbon = require('./lib/ribbon');

var routes = {
  about: require('./routes/about'),
  home: require('./routes/home'),
  work: require('./routes/work'),
  project: require('./routes/project'),
  students: require('./routes/students'),
  student: require('./routes/student'),
  event: require('./routes/event')
};

router('/', routes.home);
router('/about/', routes.about);
router('/work/', routes.work);
router('/work/:category/', routes.work);
router('/event/', routes.event);
// router.exit('/event/', routes.event.exit);
router('/:student/:project/', routes.project);
router('/students/', routes.students);
router('/:student/', routes.student);
router.start({ click: false });

$(function () {
  EventRibbon.init();

  // NB: Keep in sync with _header.scss
  enquire.register('screen and (min-width: 600px)', {
    match: function () {
      Header.init();
    },
    unmatch: function () {
      Header.destroy();
    }
  })

  $('a[href="/event/"],a[href="/event"]').on('click', function (e) {
    e.preventDefault();
    EventRibbon.open();
    router('/event/');
  })

  $('a[href="#!top"]').on('click', function (e) {
    e.preventDefault()
    $('html,body,.parallax').animate({ scrollTop: 0 }, {
      easing: 'easeOutExpo',
      duration: 800
    });
  });
});

},{"./lib/header":2,"./lib/lazyload":8,"./lib/ribbon":9,"./routes/about":12,"./routes/event":13,"./routes/home":14,"./routes/project":17,"./routes/student":18,"./routes/students":19,"./routes/work":20,"page":29,"raf-scroll":32}],2:[function(require,module,exports){

var SCROLL_THRESHOLD = 10;

module.exports = (function () {

	var $header;
	var $spacer;
	var $ribbon;
	var $window;

	var isFixed = false;
	var isMaximized = false;
	var spacerOffset = 0;
	var spacerBottom = 0;

	function init () {
		$header = $('.header');
		$spacer = $('.header-spacer');
		$ribbon = $('.event-ribbon');
		$window = $(window);

		spacerOffset = $spacer.offset().top;
		spacerBottom = spacerOffset + $spacer.innerHeight();

		$window.on('scrolldelta', handleScroll);
		$window.on('event-panel:maximize', open);
		$window.on('event-panel:minimize', close);
	}

	function destroy () {
		isFixed = false;
		$header.removeClass('header--fixed header--maximized header--is-transitioning');
		$window.off('scrolldelta', handleScroll);
		$window.off('event-panel:maximize', open);
		$window.off('event-panel:minimize', close);
		$window.trigger('header:minimize');
	}

	function open () {
		if (!isFixed) return;
		if (isMaximized) return;
		$header.addClass('header--is-transitioning');
		$header.addClass('header--maximized');
		$header.on('transitionend webkitTransitionEnd', removeTransitionClass);
		$window.trigger('header:maximize');
		isMaximized = true;
	}

	function close () {
		if (!isFixed) return;
		if (!isMaximized) return;
		$header.addClass('header--is-transitioning');
		$header.removeClass('header--maximized');
		$header.on('transitionend webkitTransitionEnd', removeTransitionClass);
		$window.trigger('header:minimize');
		isMaximized = false;
	}

	return { init: init, destroy: destroy }

	/**
	 * Event Handlers
	 */

	function removeTransitionClass () {
		$header.removeClass('header--is-transitioning');
	}

	function handleScroll (e) {
		var scrollY = e.scrollTop;
		var delta = e.scrollTopDelta;
		if (delta < 1 && delta <= (SCROLL_THRESHOLD * -1)) {
			open();
		} else if (delta > 1 && delta >= SCROLL_THRESHOLD && scrollY > 0) {
			close();
		}
		if (!isFixed && scrollY > spacerBottom) {
			$header.addClass('header--fixed');
			$header.removeClass('header--is-transitioning')
			isFixed = true;
		} else if (isFixed && scrollY <= spacerOffset) {
			$header.removeClass('header--fixed header--maximized header--is-transitioning');
			isFixed = false;
		}
	}

})()

},{}],3:[function(require,module,exports){

var SPACE = /\s/g;
var LESS_THAN = />/g;
var MORE_THAN = /</g;

module.exports = function escape (str) {
	return str
		.replace(SPACE, '&nbsp;')
		.replace(LESS_THAN, '&lt;')
		.replace(MORE_THAN, '&gt;');
}

},{}],4:[function(require,module,exports){

module.exports = function splitName (name) {
	var components = name.split(' ');

	if (components.length < 3) {
		return components;
	}

	var first;
	var last;

	// NOTE: this block is to handle "Natalie Di Maria"
	// (which is a pretty unique case)
	var search = components[1].toLowerCase()
	if (search === 'di' || search === 'freire') {
		first = components[0];
		last = components.slice(1).join(' ');
	} else {
		first = components.slice(0, -1).join(' ');
		last = components.slice(-1).join(' ');
	}

	return [first, last]
};

},{}],5:[function(require,module,exports){
var hashtags = /\S*#(?:\[[^\]]+\]|\S+)/g;

module.exports = function (input) {
  return input.replace(hashtags, '');
};

},{}],6:[function(require,module,exports){

/**
 * Adapted from Modernizr
 * https://git.io/vVaxI
 */
module.exports = function () {
	var el = document.createElement('a');
	var style = el.style
	style.cssText = 'position:-webkit-sticky;position:sticky;'
	return style.position.indexOf('sticky') !== -1;
}

},{}],7:[function(require,module,exports){
var truncationChar = '…';

/**
 * Truncates a string to the nearest word at a given length
 */
module.exports = function (input, length) {
  if (input.length < length) return input;
  var trimmedToChar = input.substr(0, length);
  var trimmedToWord = trimmedToChar.substr(0, Math.min(trimmedToChar.length, trimmedToChar.lastIndexOf(' ')));
  return trimmedToWord + truncationChar;
};

},{}],8:[function(require,module,exports){
var Layzr = require('layzr.js');

var Lazyload = Layzr({
  normal: 'data-src',
  retina: 'data-retina-src',
  threshold: 200
});

Lazyload.on('src:before', function (image) {
  image.addEventListener('load', function () {
    image.setAttribute('lazyloaded', true);
  });
});

document.addEventListener('DOMContentLoaded', function () {
  Lazyload.update().check().handlers(true);
});

module.exports = Lazyload;

},{"layzr.js":28}],9:[function(require,module,exports){
var router = require('page');
var css = require('veinjs');
var Lazyload = require('./lazyload')

var DEFAULT_URL = '/work/';
var EVENT_URL = '/event/';

var SCROLL_THRESHOLD = 10;
var TRANSITION_END = 'transitionend webkitTransitionEnd msTransitionEnd';

var noop = function () {};

module.exports = (function () {
  var $document;
  var $body;
  var $window;
  var $header;
  var $eventPanel;
  var $eventContent;
  var $eventRibbon;
  var $eventRibbonMenu;
  var $eventRibbonMenuToggle;
  var $eventRibbonMenuOverlay;

  var isOpen = false;
  var isMobileSize = false;
  // NOTE: we're using user agent because the bug this fixes relates to
  // Safari's browser chrome, not the smaller browser size
  var isMobileSafari = /iPhone|iPad/i.test(window.navigator.userAgent);
  var previousUrl = DEFAULT_URL;

  var mobileQuery = 'screen and (max-width: 600px)';
  var desktopQuery = 'screen and (min-width: 600px)';

  var mobileHandler = {
    match: function () {
      isMobileSize = true;
      $eventRibbon.addClass('event-ribbon--no-transition');
      $window.on('resize', fixMobileTransition)
      $window.on('scrolldelta', handleMobileScroll);
      $window.on('resize orientationchange', showMobileRibbon);
      fixMobileTransition();
      setTimeout(function () {
        $eventRibbon.removeClass('event-ribbon--no-transition');
      }, 5)
    },
    unmatch: function () {
      $window.off('resize', fixMobileTransition)
      $window.off('scrolldelta', handleMobileScroll);
      $window.off('resize orientationchange', showMobileRibbon);
      unfixMobileTransition();
    }
  }

  var desktopHandler = {
    match: function () {
      isMobileSize = false;
      $eventRibbon.addClass('event-ribbon--no-transition');
      $window.on('resize', fixDesktopTransition);
      unfixMobileTransition();
      setTimeout(function () {
        $eventRibbon.removeClass('event-ribbon--no-transition');
      }, 5)
    }
  }

  /**
   * Exports
   */

  function init () {
    $body = $('body');
    $window = $(window);
    $document = $(document);
    $header = $('.header');
    $eventPanel = $('.event-panel');
    $eventContent = $('.event-panel-content');
    $eventRibbon = $('.event-ribbon');
    $eventRibbonMenu = $('.event-ribbon-menu');
    $eventRibbonMenuToggle = $('.event-ribbon-menu-toggle');
    $eventRibbonMenuOverlay = $('.event-ribbon-menu-overlay');

    if ($eventPanel.hasClass('event-panel--open')) {
      showEventPanel();
    }

    $eventRibbon.on('click', handleEventRibbonClick);
    $eventRibbonMenu.on('click', stopPropagation);
    $eventRibbonMenuToggle.on('click', handleMobileMenuToggle);

    enquire.register(mobileQuery, mobileHandler);
    enquire.register(desktopQuery, desktopHandler);
  }

  function destroy () {
    enquire.unregister(mobileQuery, mobileHandler);
  }

  return { init: init, destroy: destroy, open: showEventPanel, close: hideEventPanel };

  /**
   * Private functions
   */

  function showEventPanel () {
    isOpen = true;
    hideMobileMenu();
    fixMobileTransition();
    pinScrolling()
    $eventPanel.addClass('event-panel--open event-panel--is-transitioning');
    $eventRibbon.addClass('event-ribbon--open');
    if (!isMobileSize) {
      $header.addClass('header--fixed header--maximized');
    }
    $eventPanel.on(TRANSITION_END, handlePanelTransitionEnd);
    if (router.current !== '/event/') {
      previousUrl = router.current;
    }
    router(EVENT_URL);
  }

  function hideEventPanel () {
    unpinScrolling()
    $eventPanel.removeClass('event-panel--open');
    $eventPanel.addClass('event-panel--is-transitioning');
    $eventRibbon.removeClass('event-ribbon--open');
    $eventPanel.on(TRANSITION_END, handlePanelTransitionEnd);
    isOpen = false;
    router(previousUrl);
    Lazyload.update().check()
  }

  function showMobileMenu () {
    pinScrolling();
    $eventRibbonMenu.addClass('event-ribbon-menu--open');
    $eventRibbonMenuToggle.addClass('event-ribbon-menu-toggle--open');
    $eventRibbonMenuOverlay.addClass('event-ribbon-menu-overlay--open');
    $eventRibbonMenuOverlay.on('click', hideMobileMenu);
  }

  function hideMobileMenu (e) {
    if (e) {
      e.stopPropagation();
    }
    unpinScrolling();
    $eventRibbonMenu.removeClass('event-ribbon-menu--open');
    $eventRibbonMenuToggle.removeClass('event-ribbon-menu-toggle--open');
    $eventRibbonMenuOverlay.removeClass('event-ribbon-menu-overlay--open');
    $eventRibbonMenuOverlay.off('click', hideMobileMenu);
  }

  function showMobileRibbon () {
    if (isOpen) return;
    $eventRibbon.removeClass('event-ribbon--minimized');
  }

  function hideMobileRibbon () {
    if (isOpen) return;
    $eventRibbon.addClass('event-ribbon--minimized');
  }

  function pinScrolling () {
    $body.addClass('locked');
    $body.on('touchmove', preventDefault);
    $eventContent.on('touchmove', stopPropagation);
  }

  function unpinScrolling () {
    $body.removeClass('locked');
    $body.off('touchmove', preventDefault);
    $eventContent.off('touchmove', stopPropagation);
  }

  function fixMobileTransition () {
    if (!isMobileSize) return;
    var windowHeight = window.innerHeight;
    var ribbonOffset = windowHeight - $eventRibbon.innerHeight();
    css.inject('.event-panel', { height: null, bottom: null });
    css.inject('.event-panel--open', { transform: null });
    css.inject('.event-ribbon--open', { transform: null });
    css.inject('.event-panel', { height: ribbonOffset + 'px', bottom: -ribbonOffset + 'px' });
    css.inject('.event-panel--open', { transform: 'translateY(-' + ribbonOffset + 'px)' });
    css.inject('.event-ribbon--open', { transform: 'translateY(-' + ribbonOffset + 'px)' });
    $header.removeClass('header--maximized header--fixed');
  }

  function unfixMobileTransition () {
    css.inject('.event-panel', { height: null, bottom: null });
    css.inject('.event-panel--open', { transform: null });
    css.inject('.event-ribbon--open', { transform: null });
  }

  function fixDesktopTransition () {
    if (!isOpen) return;
    $header.addClass('header--fixed header--maximized');
  }
  function handleEventRibbonClick (e) {
    e.preventDefault();
    if ($eventPanel.hasClass('event-panel--open')) {
      hideEventPanel();
    } else {
      showEventPanel();
    }
  }

  function handleMobileMenuToggle (e) {
    e.preventDefault();
    e.stopPropagation();
    if ($eventRibbonMenu.hasClass('event-ribbon-menu--open')) {
      hideMobileMenu();
    } else {
      showMobileMenu();
    }
  }

  function handleMobileScroll (e) {
    var scrollY = e.scrollTop;
    var delta = e.scrollTopDelta;
    if (delta < 1 && delta <= (SCROLL_THRESHOLD * -1)) {
      showMobileRibbon();
    } else if (delta > 1 && delta >= SCROLL_THRESHOLD && scrollY > 0) {
      hideMobileRibbon();
    }
  }

  function handlePanelTransitionEnd () {
    $eventPanel.removeClass('event-panel--is-transitioning');
  }

  function preventDefault (e) {
    e.preventDefault();
  }

  function stopPropagation (e) {
    e.stopPropagation();
  }

})();

},{"./lazyload":8,"page":29,"veinjs":36}],10:[function(require,module,exports){

var deck = require('deck');

module.exports = function (el) {
  var children = toArray(el.children);
  var elements = toIdElementMap(children);
  var shuffled = deck.shuffle(toDeck(children));
  shuffled.forEach(function (id) {
    el.appendChild(elements[id].el)
  })
  return el;
};

function toArray (obj) {
  return [].slice.call(obj)
}

function toIdElementMap (arr) {
  return arr.map(function (el) {
    return {
      id: el.dataset.id,
      el: el
    }
  })
}

function toDeck (arr) {
  var obj = {}
  arr.forEach(function (el, i) {
    obj[i] = parseFloat(el.dataset.weight, 10) || 2.5;
  })
  return obj
}

},{"deck":24}],11:[function(require,module,exports){
exports.isBetween = function (val, min, max) {
  return min <= val && val <= max;
};

},{}],12:[function(require,module,exports){
module.exports = function () {};

},{}],13:[function(require,module,exports){

var supportsSticky = require('../lib/helpers/supports-position-sticky');

var mapOptions = {
	zoom: 14,
	backgroundColor: 'none',
	center: new google.maps.LatLng(43.631014, -79.426256),
	scrollwheel: false,
	disableDefaultUI: true,
	disableDoubleClickZoom: true,
	styles: require('../templates/map')
}

var $window;
var $eventDetailsGhost;
var $eventDetailsLink;
var $eventMap;

var map;
var marker;
var interval;

module.exports = function (ctx) {
	$window = $(window);
	$eventContent = $('.event-panel-content');
	$eventDetailsGhost = $('.event-details-location-ghost');
	$eventDetailsLink = $('.event-details-location-link');
	$eventMap = $('.event-directions-map');

	map = new google.maps.Map($eventMap.get(0), mapOptions);
	marker = new google.maps.Marker({
		position: new google.maps.LatLng(43.631014, -79.426256),
		map: map,
		icon: '/assets/images/marker.svg',
		title: 'Liberty Grand'
	})

	if (window.location.hash === '#faq') {
		var $faq = $('#faq');
		$eventContent.scrollTop($faq.offset().top - 60)
	}

	google.maps.event.addDomListener(marker, 'click', onMapMarkerClick)

	if (!supportsSticky()) {
		enquire.register('only screen and (min-width: 600px)', {
			match: function () {
				bind();
			},
			unmatch: function () {
				unbind();
			}
		})
	}
};

module.exports.exit = function () {
	unbind();
	google.maps.event.removeDomListener(marker, 'click', onMapMarkerClick)
}

function bind () {
	$window.on('resize', resize);
	$eventDetailsGhost.on('mouseenter', onMouseEnterGhost);
	$eventDetailsGhost.on('mouseleave', onMouseLeaveGhost);
	resize();
	interval = setInterval(resize, 800);
}

function unbind () {
	$window.off('resize', resize);
	$eventDetailsGhost.on('mouseenter', onMouseEnterGhost);
	$eventDetailsGhost.on('mouseleave', onMouseLeaveGhost);
	$eventDetailsGhost.css({
		top: '',
		left: '',
		width: '',
		height: ''
	})
	clearInterval(interval);
}

function resize () {
	var rect = $eventDetailsLink.get(0).getBoundingClientRect();
	$eventDetailsGhost.css({
		top: rect.top + 'px',
		left: rect.left + 'px',
		width: rect.width,
		height: rect.height
	})
}

function onMouseEnterGhost () {
	$eventDetailsLink.addClass('hover');
}

function onMouseLeaveGhost () {
	$eventDetailsLink.removeClass('hover');
}

function onMapMarkerClick () {
	window.open('https://goo.gl/maps/YuXwP9XNDhQ2', '_blank').focus()
}

},{"../lib/helpers/supports-position-sticky":6,"../templates/map":22}],14:[function(require,module,exports){

var Instafeed = require('instafeed.js');
var stripHashtags = require('../lib/helpers/strip-hashtags');
var truncate = require('../lib/helpers/truncate');
var deck = require('deck')

var GRID_PROJECT_COUNT = 3

var PIXEL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

var TEMPLATE_PIXEL = /\{\{\s*pixel\s*\}\}/g
var TEMPLATE_HREF = /\{\{\s*project\.href\s*\}\}/g
var TEMPLATE_TITLE = /\{\{\s*project\.title\s*\}\}/g
var TEMPLATE_THUMBNAIL_WIDTH = /\{\{\s*project\.thumbnail\.width\s*\}\}/g
var TEMPLATE_THUMBNAIL_HEIGHT = /\{\{\s*project\.thumbnail\.height\s*\}\}/g
var TEMPLATE_THUMBNAIL_400 = /\{\{\s*project\.thumbnail\.asset400\s*\}\}/g
var TEMPLATE_THUMBNAIL_800 = /\{\{\s*project\.thumbnail\.asset800\s*\}\}/g
var TEMPLATE_OWNER_NAME = /\{\{\s*project\.owner\.name\s*\}\}/g
var TEMPLATE_OWNER_HREF = /\{\{\s*project\.owner\.href\s*\}\}/g

module.exports = function () {

  var $header = $('.header');
  var $grids = $('[data-columns]');
  var $projects = $('.project-preview');

  var template = $('template#project-preview-template').html();
  var instagramItemCount = 0

  var feedOptions = {
    clientId: '467ede5a6b9b48ae8e03f4e2582aeeb3',
    userId: '2228340350',
    sortBy: 'most-recent',
    template: require('../templates/instagram.html'),
    limit: 8
  };

  if (window.PROJECTS.length) {
    $grids.each(function (i, el) {
      var $grid = $(el);
      var discipline = el.dataset.columns;
      var projects = PROJECTS.filter(function (p) { return p.discipline === discipline });
      var picks = shuffle(projects).slice(0, GRID_PROJECT_COUNT);
      $grid.empty();
      picks.forEach(function (project) {
        $grid.append(generateProjectPreview(project))
      });
      $grid.addClass('loaded');
    })
  }

  var grids = $grids.map(function (i, el) {
    return new Quartz(getGridConfig(el))
  }).get();

  instagramFeed('home-insta');

  $(document).on('mouseenter', '.project-preview-title', projectMouseEnter);
  $(document).on('mouseleave', '.project-preview-title', projectMouseLeave);
  $(document).on('mouseenter', '.project-preview-image', projectMouseEnter);
  $(document).on('mouseleave', '.project-preview-image', projectMouseLeave);

  function projectMouseEnter (e) {
    $(this).parents('.project-preview').addClass('hover');
  }

  function projectMouseLeave (e) {
    $(this).parents('.project-preview').removeClass('hover');
  }

  /**
  * Intro Functions
  **/
  $('.home-post-intro').on('animationstart webkitAnimationStart msAnimationStart', function (e) {
    if (e.originalEvent.animationName !== 'fade-in') return;
    $header.removeClass('header--white')
  })

  /**
   * Helper functions
   */

  function instagramFeed (el) {
    var feed = new Instafeed({
      accessToken: '5139102.1677ed0.e96631b309c2454493762538cccb4e1d',
      target: el,
      sort: feedOptions.sortBy,
      limit: feedOptions.limit * 2,
      get: 'user',
      resolution: 'standard_resolution',
      userId: feedOptions.userId,
      template: feedOptions.template,
      filter: function (item) {
        if (item.type !== 'image') return false;
        if (instagramItemCount >= feedOptions.limit) return false;
        // HACK: we adjust the captions in filter function 🙈
        item.caption.text = stripHashtags(item.caption.text);
        item.caption.text = truncate(item.caption.text, 200);
        instagramItemCount++
        return true
      },
    });
    feed.run();
    return feed;
  }

  function generateProjectPreview (project) {
    // HACK: this mess
    var rendered = template
      .replace(TEMPLATE_PIXEL, PIXEL)
      .replace(TEMPLATE_HREF, project.href)
      .replace(TEMPLATE_TITLE, project.title)
      .replace(TEMPLATE_THUMBNAIL_WIDTH, project.thumbnail.width)
      .replace(TEMPLATE_THUMBNAIL_HEIGHT, project.thumbnail.height)
      .replace(TEMPLATE_THUMBNAIL_400, project.thumbnail.asset400)
      .replace(TEMPLATE_THUMBNAIL_800, project.thumbnail.asset800)
      .replace(TEMPLATE_OWNER_NAME, project.owner.name)
      .replace(TEMPLATE_OWNER_HREF, project.owner.href)
    return rendered
  }
};

function getGridConfig (el) {
  var category = el.dataset.columns
  var className = '[data-columns="' + category + '"]'
  return {
    container: className,
    items: className + ' .project-preview',
    columnClass: 'column',
    mediaQueries: [
      { query: 'screen and (min-width: 1px)', columns: 2 }
    ]
  }
}

function shuffle (arr) {
  var obj = {}
  arr.forEach(function (p) {
    obj[p.id] = parseFloat(p.weight, 10) || 2.5;
  })
  var results = deck.shuffle(obj);
  return results.map(function (id) {
    return arr.filter(function (p) {
      return p.id === id
    })[0]
  })
}

},{"../lib/helpers/strip-hashtags":5,"../lib/helpers/truncate":7,"../templates/instagram.html":21,"deck":24,"instafeed.js":26}],15:[function(require,module,exports){
var loop = require('raf-scroll');

var isBetween = require('../lib/utils').isBetween;


var SCROLL_TO_OFFSET = 80;
var SCROLL_HIGHLIGHT_OFFSET = 10;
var SCROLL_RATE = 1000;

module.exports = function () {
  var $window = $(window);
  var $header = $('.header');
  var $body = $('.project-body');
  var $sidebar = $('.project-sidebar');
  var $intro = $('.project-header');
  var $links = $sidebar.find('.project-sidebar-headers-link');
  var $toTop = $sidebar.find('[data-back-to-top]');

  /**
   * Header link active states
   */

  var isJumpingToHeader = false;
  var lastScroll = -1;
  var $intros = $('.project-content').find('h1,h3,h5');
  var waypoints = getWaypoints($intros);
  var measurements = {
    window: {
      width: 0,
      height: 0
    }
  };

  loop.add(scroll);

  $window.on('resize', function () {
    measurements.window.height = $window.height();
  }).trigger('resize');

  function scroll (e) {
    var scrollY = e.deltaY;
    if (scrollY === lastScroll) return;

    for (var i = 0; i < waypoints.length; i++) {
      var waypoint = waypoints[i];
      var betweenWaypoint = isBetween(scrollY, waypoint.start, waypoint.end);
      var isActive = !isJumpingToHeader && betweenWaypoint;
      if (isActive === waypoint.active) continue;
      waypoint.$link.toggleClass('active', isActive);
      waypoint.active = isActive;
    }

    lastScroll = scrollY;
  }

  /**
   * Header link scrolling
   */

  $links.on('click', function (e) {
    e.preventDefault();
    var $self = $(this);
    var $target = $($self.attr('href'));
    var scroll = $target.offset().top - SCROLL_TO_OFFSET;

    if (scroll < window.scrollY) {
      scroll = scroll - $header.height();
    }

    scrollTo(scroll);
    $links.removeClass('active');
    $self.addClass('active');
  });

  /**
   * Back to top scrolling
   */

  $toTop.on('click', function (e) {
    e.preventDefault();
    scrollTo(0);
  });

  /**
   * Private functions
   */

  function getWaypoints ($intros) {
    var lastEnd = 0;
    var $introsWithoutFirst;
    var waypoints = $intros.map(function (i, header) {
      var $link = $sidebar.find('[href="#' + header.id + '"]');
      var $intro = $(header);
      var $nextHeader = $intros.eq(i + 1);

      var start = lastEnd;
      var end = $nextHeader.size() > 0
        ? $nextHeader.offset().top - SCROLL_TO_OFFSET - SCROLL_HIGHLIGHT_OFFSET
        : 999999;
      lastEnd = end;

      return {
        $link: $link,
        $intro: $intro,
        start: start,
        end: end
      };
    });
    return waypoints;
  }

  function scrollTo (position) {
    var scrollY = $(window).scrollTop();
    var distance = Math.abs(position - scrollY);
    var duration = constrain(distance, 300, 800);

    isJumpingToHeader = true;
    $('html,body').animate({
      scrollTop: position
    }, {
      easing: 'easeOutExpo',
      duration: duration,
      complete: function () {
        isJumpingToHeader = false;
      }
    });
  }
};

function constrain (val, min, max) {
  return Math.max(Math.min(val, max), min);
}

},{"../lib/utils":11,"raf-scroll":32}],16:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],17:[function(require,module,exports){
var slugify = require('slug-component');
var loop = require('raf-scroll');

var isBetween = require('../lib/utils').isBetween;
var standard = require('./project-standard');
var caseStudy = require('./project-case-study');

var PINNED_SCROLL_OFFSET_FROM_TOP = 60;
var PINNED_SCROLL_OFFSET_FROM_BOTTOM = 30;

module.exports = function () {

  var isCaseStudy = $('.project').hasClass('project--case-study');

  /**
   * Trigger different routes
   */

  if (isCaseStudy) {
    caseStudy();
  } else {
    standard();
  }

  /**
   * Sticky Sidebar
   */

  var $window = $(window);
  var $document = $(document);
  var $header = $('.header');
  var $project = $('.project-body');
  var $sidebar = $('.project-sidebar');
  var $content = $('.project-content');

  var isPinned = false;
  var isPinnedToBottom = false;
  var shouldPinToTop = false;
  var isSidebarSmallerThanWindow = false;
  var isSidebarLargerThanContent = false;
  var isContentLargerThanSidebar = false;
  var isHeaderMaximized = false;

  var tracks = {
    pinned: { start: 0, end: 0, offset: 0 },
    bottom: { start: 0, end: 0 },
  };

  var lastScrollY = 0;
  var heights = {
    content: 0,
    sidebar: 0,
    window: 0
  };

  loop.add(scroll);
  $window.on('resize load', resize);
  $document.on('DOMContentLoaded', resize);
  $window.on('header:maximize', headerMaximized);
  $window.on('header:minimize', headerMinimized);

  $(document).on('mouseenter', '.project-footer-preview-title', projectMouseEnter);
  $(document).on('mouseleave', '.project-footer-preview-title', projectMouseLeave);
  $(document).on('mouseenter', '.project-footer-preview-image', projectMouseEnter);
  $(document).on('mouseleave', '.project-footer-preview-image', projectMouseLeave);

  $project.fitVids();
  resize();

  function resize () {
    $sidebar.css('width', $sidebar.parent().innerWidth());
    heights.content = $content.innerHeight();
    heights.sidebar = $sidebar.innerHeight();
    heights.window = $window.height();
    isSidebarSmallerThanWindow = (heights.sidebar + 60) < heights.window;
    isContentLargerThanSidebar = heights.content > heights.sidebar;
    isSidebarLargerThanContent = heights.content < heights.sidebar;
    setTracks();
    if (isSidebarLargerThanContent) {
      $('.project-body').css('height', heights.sidebar);
    }
  }

  function scroll (e) {
    var scrollY = e.deltaY;
    if (scrollY === lastScrollY) return;
    refresh();
    lastScrollY = scrollY;
  }

  function refresh () {
    isBetween(scrollY, tracks.pinned.start, tracks.pinned.end) ? pin() : unpin();
    isBetween(scrollY, tracks.bottom.start, tracks.bottom.end) ? pinToBottom() : unpinToBottom();
  }

  function pin () {
    if (isPinnedToBottom) return;
    $sidebar.css('top', tracks.pinned.offset);
    $sidebar.addClass('pinned');
    isPinned = true;
  }

  function unpin () {
    if (!isPinned) return;
    $sidebar.removeClass('pinned');
    $sidebar.css('top', '');
    isPinned = false;
  }

  function pinToBottom () {
    if (isPinnedToBottom) return;
    $sidebar.addClass('bottom');
    isPinnedToBottom = true;
  }

  function unpinToBottom () {
    if (!isPinnedToBottom) return;
    $sidebar.removeClass('bottom');
    isPinnedToBottom = false;
  }

  function setTracks () {
    var projectOffset = $project.offset();
    shouldPinToTop = isCaseStudy || heights.sidebar < heights.window
    if (shouldPinToTop) {
      tracks.pinned.start = projectOffset.top - PINNED_SCROLL_OFFSET_FROM_TOP;
      tracks.pinned.end = projectOffset.top + $project.innerHeight() - $sidebar.outerHeight() - PINNED_SCROLL_OFFSET_FROM_TOP;
      tracks.pinned.offset = PINNED_SCROLL_OFFSET_FROM_TOP;
      tracks.bottom.start = tracks.pinned.end;
      tracks.bottom.end = $(document).height();
    } else {
      // Standard Project: pin-to-bottom
      var sidebarScrollOffset = (heights.sidebar - heights.window + PINNED_SCROLL_OFFSET_FROM_BOTTOM)
      tracks.pinned.start = projectOffset.top + sidebarScrollOffset;
      tracks.pinned.end = projectOffset.top + $project.innerHeight() - heights.window + PINNED_SCROLL_OFFSET_FROM_BOTTOM;
      tracks.pinned.offset = -(heights.sidebar - heights.window + PINNED_SCROLL_OFFSET_FROM_BOTTOM);
      tracks.bottom.start = tracks.pinned.end;
      tracks.bottom.end = $(document).height();
    }

    if (isHeaderMaximized) {
      var height = $header.height();
      tracks.pinned.start = tracks.pinned.start - height;
      tracks.pinned.end = tracks.pinned.end - height;
      tracks.pinned.offset = tracks.pinned.offset + height;
      tracks.bottom.start = tracks.bottom.start - height;
      tracks.bottom.end = tracks.bottom.end - height;
    }
  }

  function projectMouseEnter (e) {
    $(this).parents('.project-footer-preview').addClass('hover');
  }

  function projectMouseLeave (e) {
    $(this).parents('.project-footer-preview').removeClass('hover');
  }

  function headerMaximized () {
    isHeaderMaximized = true;
    setTracks();
    refresh();
  }

  function headerMinimized () {
    isHeaderMaximized = false;
    setTracks();
    refresh();
  }

};

},{"../lib/utils":11,"./project-case-study":15,"./project-standard":16,"raf-scroll":32,"slug-component":34}],18:[function(require,module,exports){

module.exports = function () {

  configureGrid();

  $('.student-profile').mousemove(function (e) {
    parallax(e, $('.shape-1-wrapper'), 0.15);
    parallax(e, $('.shape-2-wrapper'), 0.3);
    parallax(e, $('.shape-3-wrapper'), 0.1);
    parallax(e, $('.shape-4-wrapper'), -0.3);
    parallax(e, $('.shape-5-wrapper'), -0.1);
  });

  function parallax (e, target, layer) {
    var layer_coeff = 10 / layer;
    var x = (e.pageX / 3) / layer_coeff;
    var y = (e.pageY / 2) / layer_coeff;
    $(target).css("transform", "translateX(" + x + "px) translateY(" + y + "px)");
  }
};


function configureGrid () {

  if (!document.querySelector('[data-columns]')) return;

  var config = {
    container: '[data-columns]',
    items: '[data-columns] .student-profile-project',
    columnClass: 'column',
    mediaQueries: [
      { query: 'screen and (min-width: 1px)', columns: 2 }
    ]
  }

  var grid = new Quartz(config)
}

},{}],19:[function(require,module,exports){

var Fuse = require('fuse.js');
var Lazyload = require('../lib/lazyload');
var htmlEscape = require('../lib/helpers/html-escape');
var splitName = require('../lib/helpers/split-name');

var ANIMATION_END = 'webkitAnimationEnd oanimationend msAnimationEnd animationend';
var NON_ALPHABETIC = /[^A-Za-z,\s\-]/g;
var MINIMUM_MATCHES = 6;

var notFalse = function (x) { return !!x };
var lastChar = function (str) { return str.charAt(str.length - 1) };

module.exports = function () {

  var $window = $(window);
  var $grid = $('.student-grid');
  var $search = $('.student-search-input');
  var $typeahead = $('.student-search-typeahead');
  var $shapes = $('.student-grid-shape-container');
  var $intermissions = $('.student-grid-intermission');
  var $noResults = $('.student-search-results');
  var $noResultsPrompt = $('.student-search-results-prompt');
  var $noResultsClear = $('.student-search-results-clear');
  var $footer = $('.page-student-index .feature');
  var $students = $('.student-preview');

  var students = $students.map(toStudentObject).get();
  var fuse = new Fuse(students, {
    keys: [
      { name: 'name', weight: 0.7 },
      { name: 'invertedName', weight: 0.4 },
      { name: 'firstName', weight: 0.2 },
      { name: 'lastName', weight: 0.2 },
      // { name: 'categories', weight: 0.1 }
    ],
    include: ['matches'],
    distance: 0,
    threshold: 0
  });
  var prompt = '';

  /**
   * Register Events
   */

  $search.on('input change', update);
  $search.on('keydown', keyUp);
  $students.on('mouseenter', mouseEnter);
  $students.on('mouseleave', mouseLeave);
  $noResultsClear.on('click', clear);

  if (window.innerWidth < 600) {
    loadMobileStudents();
    enquire.register('screen and (min-width: 600px)', {
      match: function () {
        loadDesktopStudents();
      }
    })
  } else {
    loadDesktopStudents();
  }

  var autosize = $search.autosize({ typeahead: $typeahead });

  update();

  /**
   * Event Handlers
   */

  function update () {
    var predicate = $search.val();

    // Sanitize the predicate
    if (NON_ALPHABETIC.test(predicate)) {
      predicate = predicate.replace(NON_ALPHABETIC, '');
      $search.val(predicate);
    }

    if (!predicate.length) {
      $students.removeClass('hidden');
      $shapes.removeClass('hidden');
      $intermissions.removeClass('hidden');
      $footer.removeClass('hidden');
      $noResults.addClass('hidden');
      $typeahead.text('');
      prompt = '';
      autosize();
      return;
    }

    var matches = fuse.search(predicate);
    var count = matches.length;

    $students.addClass('hidden');
    $intermissions.addClass('hidden');
    $shapes.addClass('hidden');
    $footer.addClass('hidden');

    matches.forEach(function (match) {
      match.item.$el.removeClass('hidden');
    });

    Lazyload.check();

    if (matches.length < MINIMUM_MATCHES) {
      $noResultsPrompt.text('Not');
      $noResults.removeClass('hidden');
    }

    if (!matches.length) {
      $noResultsPrompt.text('Can\'t find');
      prompt = ''
      $typeahead.text('');
      return;
    }

    var match = matches[0];
    var student = match.item
    var name = student.name

    prompt = isSearchingLastName(predicate, match)
      ? formatInvertedName(student.firstName, student.lastName)
      : name;
    var index = prompt.toLowerCase().indexOf(predicate.toLowerCase()) + predicate.length;
    var ahead = prompt.substring(index);

    var html = wrap(predicate) + ahead;
    $typeahead.html(html);
  }

  function clear (e) {
    if (e) {
      e.preventDefault();
    }
    $search.val('');
    update();
  }

  function mouseEnter () {
    var $self = $(this);
    $self.off(ANIMATION_END, stopRewind);
    $self.addClass('student-preview--rewind');
  }

  function mouseLeave (e) {
    $(this).one(ANIMATION_END, stopRewind);
  }

  function keyUp (e) {
    switch (e.keyCode) {
      case 27: // esc
        clear();
        break;
      case 13: // return
        $search.val(prompt);
        update();
        autosize();
        break;
      case 39: // right arrow
        var search = $search.get(0)
        if (search.value.length === search.selectionEnd) {
          $search.val(prompt);
          update();
          autosize();
        }
        break;
    }
  }

  function stopRewind () {
    $(this).removeClass('student-preview--rewind');
  }

  function loadMobileStudents () {
    $students.find('img').each(function (i, el) {
      var $el = $(el);
      $el.attr('data-src', $el.attr('data-mobile-src'))
      $el.attr('data-retina-src', $el.attr('data-mobile-retina-src'))
    });
    Lazyload.update();
    Lazyload.check();
  }

  function loadDesktopStudents () {
    $students.find('img').each(function (i, el) {
      var $el = $(el);
      $el.attr('data-src', $el.attr('data-desktop-src'))
      $el.attr('data-retina-src', $el.attr('data-desktop-retina-src'))
    });
    Lazyload.update();
    Lazyload.check();
  }
};

/**
 * Helper Functions
 */

function wrap (str) {
  return '<span class="silent">' + htmlEscape(str) + '</span>';
}

function toStudentObject (i, el) {
  var $el = $(el);
  var name = $el.data('name');
  var components = splitName(name);
  var firstName = components[0];
  var lastName = components[1];
  return {
    index: i,
    $el: $el,
    name: name,
    invertedName: formatInvertedName(firstName, lastName),
    firstName: firstName,
    lastName: lastName,
    categories: $el.data('categories').split(',')
  }
}

function formatInvertedName (first, last) {
  return last + ', ' + first;
}

function isSearchingLastName (predicate, match) {
  var bestMatchingSearchKey = match.matches[0].key
  return bestMatchingSearchKey === 'invertedName' || bestMatchingSearchKey === 'lastName';
}

},{"../lib/helpers/html-escape":3,"../lib/helpers/split-name":4,"../lib/lazyload":8,"fuse.js":25}],20:[function(require,module,exports){

var Fuse = require('fuse.js');
var deck = require('deck');
var shuffle = require('../lib/shuffle');
var Lazyload = require('../lib/lazyload');

var MINIMUM_MATCHES = 2;

module.exports = function () {
  var gridElement = document.querySelector('[data-columns]');
  shuffle(gridElement);
  gridElement.classList.remove('loading')

  var $document = $(document);
  var $projects = $('.project-preview');
  var $categoryLinks = $('.project-nav-category');
  var $search = $('.student-nav-view-search-input');
  var $fewResults = $('.project-grid-search-results--few');
  var $noResults = $('.project-grid-search-results--none');
  var $clearSearch = $('.project-grid-search-results-clear');

  var grid;
  var projects;
  var fuse;

  var config = {
    container: '[data-columns]',
    items: '.project-preview:not(.hidden)',
    columnClass: 'column',
    mediaQueries: [
      { query: 'screen and (max-width: 800px)', columns: 2 },
      { query: 'screen and (min-width: 800px)', columns: 3 },
    ]
  }

  /**
   * Init
   */
  $categoryLinks.on('click', categoryLinkClick);
  $clearSearch.on('click', clearSearch);
  $search.on('input change', updateSearch);
  $(document).on('mouseenter', '.project-preview-title', projectMouseEnter);
  $(document).on('mouseleave', '.project-preview-title', projectMouseLeave);
  $(document).on('mouseenter', '.project-preview-image', projectMouseEnter);
  $(document).on('mouseleave', '.project-preview-image', projectMouseLeave);

  grid = new Quartz(config);
  projects = $projects.map(toProjectObject).get();
  fuse = new Fuse(projects, {
    keys: [
      { name: 'title', weight: 0.7 },
      { name: 'owner', weight: 0.4 },
      // { name: 'category', weight: 0.1 }
    ],
    include: ['matches'],
    distance: 0,
    threshold: 0
  });

  updateSearch();

  /**
   * Private Functions
   */

  function updateSearch () {
    var predicate = $search.val();

    if (!predicate.length) {
      $projects.removeClass('hidden');
      $fewResults.addClass('hidden');
      $noResults.addClass('hidden');
      grid.update();
      return;
    }

    var matches = fuse.search(predicate);
    var count = matches.length;

    $projects.addClass('hidden');
    $fewResults.addClass('hidden');
    $noResults.addClass('hidden');

    matches.forEach(function (match) {
      match.item.$el.removeClass('hidden');
    });

    if (matches.length < 1) {
      $noResults.removeClass('hidden');
    } else if (matches.length < MINIMUM_MATCHES) {
      $fewResults.removeClass('hidden');
    }

    Lazyload.check();
    grid.update();
  }

  function clearSearch (e) {
    if (e) {
      e.preventDefault()
    }
    $search.val('');
    updateSearch();
  }

  /**
   * Event Handlers
   */

  function projectMouseEnter (e) {
    $(this).parents('.project-preview').addClass('hover');
  }

  function projectMouseLeave (e) {
    $(this).parents('.project-preview').removeClass('hover');
  }

  function categoryLinkClick (e) {
    e.preventDefault();
    var $self = $(this);
    var category = $self.data('category');
    $categoryLinks.removeClass('active');
    $self.addClass('active');
    if (category === '*') {
      $projects.show();
    } else {
      $projects
        .hide()
        .filter('[data-category="' + category + '"]')
        .show();
    }
    Lazyload.check();
    grid.update();
  }
};

function toProjectObject (i, el) {
  var $el = $(el);
  return {
    $el: $el,
    title: $el.data('title'),
    owner: $el.data('owner'),
    category: $el.data('category')
  }
}

},{"../lib/lazyload":8,"../lib/shuffle":10,"deck":24,"fuse.js":25}],21:[function(require,module,exports){
module.exports = '<a class="home-social-feed-item" href="{{link}}" target="_blank">\n	<img class="home-social-feed-item-image" src="{{image}}" />\n	<div class="home-social-feed-item-caption">{{caption}}</div>\n</a>\n';
},{}],22:[function(require,module,exports){
module.exports=[
	{
		"featureType": "all",
		"elementType": "geometry",
		"stylers": [
			{
				"color": "#2b4074"
			}
		]
	},
	{
		"featureType": "all",
		"elementType": "labels.text.fill",
		"stylers": [
			{
				"gamma": 0.01
			},
			{
				"lightness": 20
			}
		]
	},
	{
		"featureType": "all",
		"elementType": "labels.text.stroke",
		"stylers": [
			{
				"saturation": -31
			},
			{
				"lightness": -33
			},
			{
				"weight": 2
			},
			{
				"gamma": 0.8
			}
		]
	},
	{
		"featureType": "all",
		"elementType": "labels.icon",
		"stylers": [
			{
				"visibility": "off"
			}
		]
	},
	{
		"featureType": "administrative.locality",
		"elementType": "labels.text",
		"stylers": [
			{
				"visibility": "on"
			}
		]
	},
	{
		"featureType": "administrative.locality",
		"elementType": "labels.text.fill",
		"stylers": [
			{
				"color": "#fbfbfb"
			}
		]
	},
	{
		"featureType": "administrative.locality",
		"elementType": "labels.text.stroke",
		"stylers": [
			{
				"visibility": "off"
			},
			{
				"color": "#ffffff"
			}
		]
	},
	{
		"featureType": "administrative.neighborhood",
		"elementType": "labels",
		"stylers": [
			{
				"visibility": "off"
			}
		]
	},
	{
		"featureType": "administrative.neighborhood",
		"elementType": "labels.text.fill",
		"stylers": [
			{
				"visibility": "on"
			},
			{
				"color": "#b4baf3"
			}
		]
	},
	{
		"featureType": "administrative.land_parcel",
		"elementType": "labels",
		"stylers": [
			{
				"visibility": "off"
			}
		]
	},
	{
		"featureType": "landscape",
		"elementType": "geometry",
		"stylers": [
			{
				"lightness": 30
			},
			{
				"saturation": 30
			},
			{
				"visibility": "on"
			}
		]
	},
	{
		"featureType": "landscape",
		"elementType": "labels",
		"stylers": [
			{
				"visibility": "off"
			}
		]
	},
	{
		"featureType": "poi",
		"elementType": "geometry.fill",
		"stylers": [
			{
				"visibility": "on"
			},
			{
				"lightness": "9"
			},
			{
				"saturation": "34"
			}
		]
	},
	{
		"featureType": "poi",
		"elementType": "labels",
		"stylers": [
			{
				"visibility": "off"
			}
		]
	},
	{
		"featureType": "poi.attraction",
		"elementType": "geometry.fill",
		"stylers": [
			{
				"lightness": "87"
			},
			{
				"visibility": "on"
			},
			{
				"color": "#133a7f"
			}
		]
	},
	{
		"featureType": "poi.business",
		"elementType": "geometry.fill",
		"stylers": [
			{
				"lightness": "87"
			},
			{
				"gamma": "1.00"
			},
			{
				"saturation": "0"
			},
			{
				"visibility": "on"
			},
			{
				"color": "#133a7f"
			}
		]
	},
	{
		"featureType": "poi.sports_complex",
		"elementType": "geometry.fill",
		"stylers": [
			{
				"visibility": "on"
			}
		]
	},
	{
		"featureType": "road",
		"elementType": "geometry",
		"stylers": [
			{
				"lightness": 10
			},
			{
				"saturation": -30
			}
		]
	},
	{
		"featureType": "road",
		"elementType": "geometry.fill",
		"stylers": [
			{
				"color": "#5ac2b4"
			}
		]
	},
	{
		"featureType": "road",
		"elementType": "geometry.stroke",
		"stylers": [
			{
				"saturation": 25
			},
			{
				"lightness": 25
			}
		]
	},
	{
		"featureType": "road",
		"elementType": "labels.text",
		"stylers": [
			{
				"visibility": "off"
			}
		]
	},
	{
		"featureType": "road.highway",
		"elementType": "geometry.fill",
		"stylers": [
			{
				"color": "#2b4074"
			}
		]
	},
	{
		"featureType": "road.highway",
		"elementType": "geometry.stroke",
		"stylers": [
			{
				"visibility": "off"
			}
		]
	},
	{
		"featureType": "road.highway",
		"elementType": "labels.text.fill",
		"stylers": [
			{
				"visibility": "on"
			},
			{
				"color": "#6e93d5"
			}
		]
	},
	{
		"featureType": "road.arterial",
		"elementType": "geometry.fill",
		"stylers": [
			{
				"visibility": "on"
			},
			{
				"color": "#2b4074"
			}
		]
	},
	{
		"featureType": "road.arterial",
		"elementType": "geometry.stroke",
		"stylers": [
			{
				"visibility": "off"
			}
		]
	},
	{
		"featureType": "road.arterial",
		"elementType": "labels.text.fill",
		"stylers": [
			{
				"color": "#6e93d5"
			},
			{
				"visibility": "on"
			},
			{
				"weight": "1"
			}
		]
	},
	{
		"featureType": "road.local",
		"elementType": "geometry.fill",
		"stylers": [
			{
				"visibility": "on"
			},
			{
				"color": "#2c52ae"
			},
			{
				"saturation": "0"
			},
			{
				"lightness": "2"
			},
			{
				"gamma": "1.00"
			}
		]
	},
	{
		"featureType": "road.local",
		"elementType": "geometry.stroke",
		"stylers": [
			{
				"visibility": "off"
			}
		]
	},
	{
		"featureType": "transit",
		"elementType": "labels",
		"stylers": [
			{
				"visibility": "off"
			}
		]
	},
	{
		"featureType": "water",
		"elementType": "all",
		"stylers": [
			{
				"lightness": -20
			}
		]
	},
	{
		"featureType": "water",
		"elementType": "labels",
		"stylers": [
			{
				"visibility": "off"
			}
		]
	}
]

},{}],23:[function(require,module,exports){
/**
 * Expose `requestAnimationFrame()`.
 */

exports = module.exports = window.requestAnimationFrame
  || window.webkitRequestAnimationFrame
  || window.mozRequestAnimationFrame
  || fallback;

/**
 * Fallback implementation.
 */

var prev = new Date().getTime();
function fallback(fn) {
  var curr = new Date().getTime();
  var ms = Math.max(0, 16 - (curr - prev));
  var req = setTimeout(fn, ms);
  prev = curr;
  return req;
}

/**
 * Cancel.
 */

var cancel = window.cancelAnimationFrame
  || window.webkitCancelAnimationFrame
  || window.mozCancelAnimationFrame
  || window.clearTimeout;

exports.cancel = function(id){
  cancel.call(window, id);
};

},{}],24:[function(require,module,exports){
var exports = module.exports = function (xs) {
    if (typeof xs !== 'object') { // of which Arrays are
        throw new TypeError('Must be an Array or an object');
    }
    
    return Object.keys(exports).reduce(function (acc, name) {
        acc[name] = exports[name].bind(null, xs);
        return acc;
    }, {});
};

exports.shuffle = function (xs) {
    if (Array.isArray(xs)) {
        // uniform shuffle
        var res = xs.slice();
        for (var i = res.length - 1; i >= 0; i--) {
            var n = Math.floor(Math.random() * i);
            var t = res[i];
            res[i] = res[n];
            res[n] = t;
        }
        return res;
    }
    else if (typeof xs === 'object') {
        // weighted shuffle
        var weights = Object.keys(xs).reduce(function (acc, key) {
            acc[key] = xs[key];
            return acc;
        }, {});
        
        var ret = [];
        
        while (Object.keys(weights).length > 0) {
            var key = exports.pick(weights);
            delete weights[key];
            ret.push(key);
        }
        
        return ret;
    }
    else {
        throw new TypeError('Must be an Array or an object');
    }
};

exports.pick = function (xs) {
    if (Array.isArray(xs)) {
        // uniform sample
        return xs[Math.floor(Math.random() * xs.length)];
    }
    else if (typeof xs === 'object') {
        // weighted sample
        var weights = exports.normalize(xs);
        if (!weights) return undefined;
        
        var n = Math.random();
        var threshold = 0;
        var keys = Object.keys(weights);
        
        for (var i = 0; i < keys.length; i++) {
            threshold += weights[keys[i]];
            if (n < threshold) return keys[i];
        }
        throw new Error('Exceeded threshold. Something is very wrong.');
    }
    else {
        throw new TypeError('Must be an Array or an object');
    }
};

exports.normalize = function (weights) {
    if (typeof weights !== 'object' || Array.isArray(weights)) {
        throw 'Not an object'
    }
    
    var keys = Object.keys(weights);
    if (keys.length === 0) return undefined;
    
    var total = keys.reduce(function (sum, key) {
        var x = weights[key];
        if (x < 0) {
            throw new Error('Negative weight encountered at key ' + key);
        }
        else if (typeof x !== 'number') {
            throw new TypeError('Number expected, got ' + typeof x);
        }
        else {
            return sum + x;
        }
    }, 0);
    
    return total === 1
        ? weights
        : keys.reduce(function (acc, key) {
            acc[key] = weights[key] / total;
            return acc;
        }, {})
    ;
};

},{}],25:[function(require,module,exports){
/**
 * @license
 * Fuse - Lightweight fuzzy-search
 *
 * Copyright (c) 2012-2016 Kirollos Risk <kirollos@gmail.com>.
 * All Rights Reserved. Apache Software License 2.0
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
;(function (global) {
  'use strict'

  function log () {
    console.log.apply(console, arguments)
  }

  var MULTI_CHAR_REGEX = / +/g

  var defaultOptions = {
    // The name of the identifier property. If specified, the returned result will be a list
    // of the items' dentifiers, otherwise it will be a list of the items.
    id: null,

    // Indicates whether comparisons should be case sensitive.

    caseSensitive: false,

    // An array of values that should be included from the searcher's output. When this array
    // contains elements, each result in the list will be of the form `{ item: ..., include1: ..., include2: ... }`.
    // Values you can include are `score`, `matchedLocations`
    include: [],

    // Whether to sort the result list, by score
    shouldSort: true,

    // The search function to use
    // Note that the default search function ([[Function]]) must conform to the following API:
    //
    //  @param pattern The pattern string to search
    //  @param options The search option
    //  [[Function]].constructor = function(pattern, options)
    //
    //  @param text: the string to search in for the pattern
    //  @return Object in the form of:
    //    - isMatch: boolean
    //    - score: Int
    //  [[Function]].prototype.search = function(text)
    searchFn: BitapSearcher,

    // Default sort function
    sortFn: function (a, b) {
      return a.score - b.score
    },

    // The get function to use when fetching an object's properties.
    // The default will search nested paths *ie foo.bar.baz*
    getFn: deepValue,

    // List of properties that will be searched. This also supports nested properties.
    keys: [],

    // Will print to the console. Useful for debugging.
    verbose: false,

    // When true, the search algorithm will search individual words **and** the full string,
    // computing the final score as a function of both. Note that when `tokenize` is `true`,
    // the `threshold`, `distance`, and `location` are inconsequential for individual tokens.
    tokenize: false
  }

  function Fuse (list, options) {
    var i
    var len
    var key
    var keys

    this.list = list
    this.options = options = options || {}

    // Add boolean type options
    for (i = 0, keys = ['sort', 'shouldSort', 'verbose', 'tokenize'], len = keys.length; i < len; i++) {
      key = keys[i]
      this.options[key] = key in options ? options[key] : defaultOptions[key]
    }
    // Add all other options
    for (i = 0, keys = ['searchFn', 'sortFn', 'keys', 'getFn', 'include'], len = keys.length; i < len; i++) {
      key = keys[i]
      this.options[key] = options[key] || defaultOptions[key]
    }
  }

  Fuse.VERSION = '2.2.0'

  /**
   * Sets a new list for Fuse to match against.
   * @param {Array} list
   * @return {Array} The newly set list
   * @public
   */
  Fuse.prototype.set = function (list) {
    this.list = list
    return list
  }

  Fuse.prototype.search = function (pattern) {
    if (this.options.verbose) log('\nSearch term:', pattern, '\n')

    this.pattern = pattern
    this.results = []
    this.resultMap = {}
    this._keyMap = null

    this._prepareSearchers()
    this._startSearch()
    this._computeScore()
    this._sort()

    var output = this._format()
    return output
  }

  Fuse.prototype._prepareSearchers = function () {
    var options = this.options
    var pattern = this.pattern
    var searchFn = options.searchFn
    var tokens = pattern.split(MULTI_CHAR_REGEX)
    var i = 0
    var len = tokens.length

    if (this.options.tokenize) {
      this.tokenSearchers = []
      for (; i < len; i++) {
        this.tokenSearchers.push(new searchFn(tokens[i], options))
      }
    }
    this.fullSeacher = new searchFn(pattern, options)
  }

  Fuse.prototype._startSearch = function () {
    var options = this.options
    var getFn = options.getFn
    var list = this.list
    var listLen = list.length
    var keys = this.options.keys
    var keysLen = keys.length
    var key
    var weight
    var item = null
    var i
    var j

    // Check the first item in the list, if it's a string, then we assume
    // that every item in the list is also a string, and thus it's a flattened array.
    if (typeof list[0] === 'string') {
      // Iterate over every item
      for (i = 0; i < listLen; i++) {
        this._analyze('', list[i], i, i)
      }
    } else {
      this._keyMap = {}
      // Otherwise, the first item is an Object (hopefully), and thus the searching
      // is done on the values of the keys of each item.
      // Iterate over every item
      for (i = 0; i < listLen; i++) {
        item = list[i]
        // Iterate over every key
        for (j = 0; j < keysLen; j++) {
          key = keys[j]
          if (typeof key !== 'string') {
            weight = (1 - key.weight) || 1
            this._keyMap[key.name] = {
              weight: weight
            }
            if (key.weight <= 0 || key.weight > 1) {
              throw new Error('Key weight has to be > 0 and <= 1')
            }
            key = key.name
          } else {
            this._keyMap[key] = {
              weight: 1
            }
          }
          this._analyze(key, getFn(item, key, []), item, i)
        }
      }
    }
  }

  Fuse.prototype._analyze = function (key, text, entity, index) {
    var options = this.options
    var words
    var scores
    var exists = false
    var tokenSearchers
    var tokenSearchersLen
    var existingResult
    var averageScore
    var finalScore
    var scoresLen
    var mainSearchResult
    var tokenSearcher
    var termScores
    var word
    var tokenSearchResult
    var i
    var j

    // Check if the text can be searched
    if (text === undefined || text === null) {
      return
    }

    scores = []

    if (typeof text === 'string') {
      words = text.split(MULTI_CHAR_REGEX)

      if (options.verbose) log('---------\nKey:', key)
      if (options.verbose) log('Record:', words)

      if (this.options.tokenize) {
        tokenSearchers = this.tokenSearchers
        tokenSearchersLen = tokenSearchers.length

        for (i = 0; i < this.tokenSearchers.length; i++) {
          tokenSearcher = this.tokenSearchers[i]
          termScores = []
          for (j = 0; j < words.length; j++) {
            word = words[j]
            tokenSearchResult = tokenSearcher.search(word)
            if (tokenSearchResult.isMatch) {
              exists = true
              termScores.push(tokenSearchResult.score)
              scores.push(tokenSearchResult.score)
            } else {
              termScores.push(1)
              scores.push(1)
            }
          }
          if (options.verbose) log('Token scores:', termScores)
        }

        averageScore = scores[0]
        scoresLen = scores.length
        for (i = 1; i < scoresLen; i++) {
          averageScore += scores[i]
        }
        averageScore = averageScore / scoresLen

        if (options.verbose) log('Token score average:', averageScore)
      }

      // Get the result
      mainSearchResult = this.fullSeacher.search(text)
      if (options.verbose) log('Full text score:', mainSearchResult.score)

      finalScore = mainSearchResult.score
      if (averageScore !== undefined) {
        finalScore = (finalScore + averageScore) / 2
      }

      if (options.verbose) log('Score average:', finalScore)

      // If a match is found, add the item to <rawResults>, including its score
      if (exists || mainSearchResult.isMatch) {
        // Check if the item already exists in our results
        existingResult = this.resultMap[index]

        if (existingResult) {
          // Use the lowest score
          // existingResult.score, bitapResult.score
          existingResult.output.push({
            key: key,
            score: finalScore,
            matchedIndices: mainSearchResult.matchedIndices
          })
        } else {
          // Add it to the raw result list
          this.resultMap[index] = {
            item: entity,
            output: [{
              key: key,
              score: finalScore,
              matchedIndices: mainSearchResult.matchedIndices
            }]
          }

          this.results.push(this.resultMap[index])
        }
      }
    } else if (isArray(text)) {
      for (i = 0; i < text.length; i++) {
        this._analyze(key, text[i], entity, index)
      }
    }
  }

  Fuse.prototype._computeScore = function () {
    var i
    var j
    var keyMap = this._keyMap
    var totalScore
    var output
    var scoreLen
    var score
    var weight
    var results = this.results
    var bestScore
    var nScore

    if (this.options.verbose) log('\n\nComputing score:\n')

    for (i = 0; i < results.length; i++) {
      totalScore = 0
      output = results[i].output
      scoreLen = output.length

      bestScore = 1

      for (j = 0; j < scoreLen; j++) {
        score = output[j].score
        weight = keyMap ? keyMap[output[j].key].weight : 1

        nScore = score * weight

        if (weight !== 1) {
          bestScore = Math.min(bestScore, nScore)
        } else {
          totalScore += nScore
          output[j].nScore = nScore
        }
      }

      if (bestScore === 1) {
        results[i].score = totalScore / scoreLen
      } else {
        results[i].score = bestScore
      }

      if (this.options.verbose) log(results[i])
    }
  }

  Fuse.prototype._sort = function () {
    var options = this.options
    if (options.shouldSort) {
      if (options.verbose) log('\n\nSorting....')
      this.results.sort(options.sortFn)
    }
  }

  Fuse.prototype._format = function () {
    var options = this.options
    var getFn = options.getFn
    var finalOutput = []
    var item
    var i
    var len
    var results = this.results
    var replaceValue
    var getItemAtIndex
    var include = options.include

    if (options.verbose) log('\n\nOutput:\n\n', results)

    // Helper function, here for speed-up, which replaces the item with its value,
    // if the options specifies it,
    replaceValue = options.id ? function (index) {
      results[index].item = getFn(results[index].item, options.id, [])[0]
    } : function () {}

    getItemAtIndex = function (index) {
      var record = results[index]
      var data
      var includeVal
      var j
      var output
      var _item
      var _result

      // If `include` has values, put the item in the result
      if (include.length > 0) {
        data = {
          item: record.item
        }
        if (include.indexOf('matches') !== -1) {
          output = record.output
          data.matches = []
          for (j = 0; j < output.length; j++) {
            _item = output[j]
            _result = {
              indices: _item.matchedIndices
            }
            if (_item.key) {
              _result.key = _item.key
            }
            data.matches.push(_result)
          }
        }

        if (include.indexOf('score') !== -1) {
          data.score = results[index].score
        }

      } else {
        data = record.item
      }

      return data
    }

    // From the results, push into a new array only the item identifier (if specified)
    // of the entire item.  This is because we don't want to return the <results>,
    // since it contains other metadata
    for (i = 0, len = results.length; i < len; i++) {
      replaceValue(i)
      item = getItemAtIndex(i)
      finalOutput.push(item)
    }

    return finalOutput
  }

  // Helpers

  function deepValue (obj, path, list) {
    var firstSegment
    var remaining
    var dotIndex
    var value
    var i
    var len

    if (!path) {
      // If there's no path left, we've gotten to the object we care about.
      list.push(obj)
    } else {
      dotIndex = path.indexOf('.')

      if (dotIndex !== -1) {
        firstSegment = path.slice(0, dotIndex)
        remaining = path.slice(dotIndex + 1)
      } else {
        firstSegment = path
      }

      value = obj[firstSegment]
      if (value !== null && value !== undefined) {
        if (!remaining && (typeof value === 'string' || typeof value === 'number')) {
          list.push(value)
        } else if (isArray(value)) {
          // Search each item in the array.
          for (i = 0, len = value.length; i < len; i++) {
            deepValue(value[i], remaining, list)
          }
        } else if (remaining) {
          // An object. Recurse further.
          deepValue(value, remaining, list)
        }
      }
    }

    return list
  }

  function isArray (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]'
  }

  /**
   * Adapted from "Diff, Match and Patch", by Google
   *
   *   http://code.google.com/p/google-diff-match-patch/
   *
   * Modified by: Kirollos Risk <kirollos@gmail.com>
   * -----------------------------------------------
   * Details: the algorithm and structure was modified to allow the creation of
   * <Searcher> instances with a <search> method which does the actual
   * bitap search. The <pattern> (the string that is searched for) is only defined
   * once per instance and thus it eliminates redundant re-creation when searching
   * over a list of strings.
   *
   * Licensed under the Apache License, Version 2.0 (the "License")
   * you may not use this file except in compliance with the License.
   */
  function BitapSearcher (pattern, options) {
    options = options || {}
    this.options = options
    this.options.location = options.location || BitapSearcher.defaultOptions.location
    this.options.distance = 'distance' in options ? options.distance : BitapSearcher.defaultOptions.distance
    this.options.threshold = 'threshold' in options ? options.threshold : BitapSearcher.defaultOptions.threshold
    this.options.maxPatternLength = options.maxPatternLength || BitapSearcher.defaultOptions.maxPatternLength

    this.pattern = options.caseSensitive ? pattern : pattern.toLowerCase()
    this.patternLen = pattern.length

    if (this.patternLen <= this.options.maxPatternLength) {
      this.matchmask = 1 << (this.patternLen - 1)
      this.patternAlphabet = this._calculatePatternAlphabet()
    }
  }

  BitapSearcher.defaultOptions = {
    // Approximately where in the text is the pattern expected to be found?
    location: 0,

    // Determines how close the match must be to the fuzzy location (specified above).
    // An exact letter match which is 'distance' characters away from the fuzzy location
    // would score as a complete mismatch. A distance of '0' requires the match be at
    // the exact location specified, a threshold of '1000' would require a perfect match
    // to be within 800 characters of the fuzzy location to be found using a 0.8 threshold.
    distance: 100,

    // At what point does the match algorithm give up. A threshold of '0.0' requires a perfect match
    // (of both letters and location), a threshold of '1.0' would match anything.
    threshold: 0.6,

    // Machine word size
    maxPatternLength: 32
  }

  /**
   * Initialize the alphabet for the Bitap algorithm.
   * @return {Object} Hash of character locations.
   * @private
   */
  BitapSearcher.prototype._calculatePatternAlphabet = function () {
    var mask = {},
      i = 0

    for (i = 0; i < this.patternLen; i++) {
      mask[this.pattern.charAt(i)] = 0
    }

    for (i = 0; i < this.patternLen; i++) {
      mask[this.pattern.charAt(i)] |= 1 << (this.pattern.length - i - 1)
    }

    return mask
  }

  /**
   * Compute and return the score for a match with `e` errors and `x` location.
   * @param {number} errors Number of errors in match.
   * @param {number} location Location of match.
   * @return {number} Overall score for match (0.0 = good, 1.0 = bad).
   * @private
   */
  BitapSearcher.prototype._bitapScore = function (errors, location) {
    var accuracy = errors / this.patternLen,
      proximity = Math.abs(this.options.location - location)

    if (!this.options.distance) {
      // Dodge divide by zero error.
      return proximity ? 1.0 : accuracy
    }
    return accuracy + (proximity / this.options.distance)
  }

  /**
   * Compute and return the result of the search
   * @param {String} text The text to search in
   * @return {Object} Literal containing:
   *                          {Boolean} isMatch Whether the text is a match or not
   *                          {Decimal} score Overall score for the match
   * @public
   */
  BitapSearcher.prototype.search = function (text) {
    var options = this.options
    var i
    var j
    var textLen
    var location
    var threshold
    var bestLoc
    var binMin
    var binMid
    var binMax
    var start, finish
    var bitArr
    var lastBitArr
    var charMatch
    var score
    var locations
    var matches
    var isMatched
    var matchMask
    var matchedIndices
    var matchesLen
    var match

    text = options.caseSensitive ? text : text.toLowerCase()

    if (this.pattern === text) {
      // Exact match
      return {
        isMatch: true,
        score: 0,
        matchedIndices: [[0, text.length - 1]]
      }
    }

    // When pattern length is greater than the machine word length, just do a a regex comparison
    if (this.patternLen > options.maxPatternLength) {
      matches = text.match(new RegExp(this.pattern.replace(MULTI_CHAR_REGEX, '|')))
      isMatched = !!matches

      if (isMatched) {
        matchedIndices = []
        for (i = 0, matchesLen = matches.length; i < matchesLen; i++) {
          match = matches[i]
          matchedIndices.push([text.indexOf(match), match.length - 1])
        }
      }

      return {
        isMatch: isMatched,
        // TODO: revisit this score
        score: isMatched ? 0.5 : 1,
        matchedIndices: matchedIndices
      }
    }

    location = options.location
    // Set starting location at beginning text and initialize the alphabet.
    textLen = text.length
    // Highest score beyond which we give up.
    threshold = options.threshold
    // Is there a nearby exact match? (speedup)
    bestLoc = text.indexOf(this.pattern, location)

    // a mask of the matches
    matchMask = []
    for (i = 0; i < textLen; i++) {
      matchMask[i] = 0
    }

    if (bestLoc != -1) {
      threshold = Math.min(this._bitapScore(0, bestLoc), threshold)
      // What about in the other direction? (speed up)
      bestLoc = text.lastIndexOf(this.pattern, location + this.patternLen)

      if (bestLoc != -1) {
        threshold = Math.min(this._bitapScore(0, bestLoc), threshold)
      }
    }

    bestLoc = -1
    score = 1
    locations = []
    binMax = this.patternLen + textLen

    for (i = 0; i < this.patternLen; i++) {
      // Scan for the best match; each iteration allows for one more error.
      // Run a binary search to determine how far from the match location we can stray
      // at this error level.
      binMin = 0
      binMid = binMax
      while (binMin < binMid) {
        if (this._bitapScore(i, location + binMid) <= threshold) {
          binMin = binMid
        } else {
          binMax = binMid
        }
        binMid = Math.floor((binMax - binMin) / 2 + binMin)
      }

      // Use the result from this iteration as the maximum for the next.
      binMax = binMid
      start = Math.max(1, location - binMid + 1)
      finish = Math.min(location + binMid, textLen) + this.patternLen

      // Initialize the bit array
      bitArr = Array(finish + 2)

      bitArr[finish + 1] = (1 << i) - 1

      for (j = finish; j >= start; j--) {
        charMatch = this.patternAlphabet[text.charAt(j - 1)]

        if (charMatch) {
          matchMask[j - 1] = 1
        }

        if (i === 0) {
          // First pass: exact match.
          bitArr[j] = ((bitArr[j + 1] << 1) | 1) & charMatch
        } else {
          // Subsequent passes: fuzzy match.
          bitArr[j] = ((bitArr[j + 1] << 1) | 1) & charMatch | (((lastBitArr[j + 1] | lastBitArr[j]) << 1) | 1) | lastBitArr[j + 1]
        }
        if (bitArr[j] & this.matchmask) {
          score = this._bitapScore(i, j - 1)

          // This match will almost certainly be better than any existing match.
          // But check anyway.
          if (score <= threshold) {
            // Indeed it is
            threshold = score
            bestLoc = j - 1
            locations.push(bestLoc)

            if (bestLoc > location) {
              // When passing loc, don't exceed our current distance from loc.
              start = Math.max(1, 2 * location - bestLoc)
            } else {
              // Already passed loc, downhill from here on in.
              break
            }
          }
        }
      }

      // No hope for a (better) match at greater error levels.
      if (this._bitapScore(i + 1, location) > threshold) {
        break
      }
      lastBitArr = bitArr
    }

    matchedIndices = this._getMatchedIndices(matchMask)

    // Count exact matches (those with a score of 0) to be "almost" exact
    return {
      isMatch: bestLoc >= 0,
      score: score === 0 ? 0.001 : score,
      matchedIndices: matchedIndices
    }
  }

  BitapSearcher.prototype._getMatchedIndices = function (matchMask) {
    var matchedIndices = []
    var start = -1
    var end = -1
    var i = 0
    var match
    var len = len = matchMask.length
    for (; i < len; i++) {
      match = matchMask[i]
      if (match && start === -1) {
        start = i
      } else if (!match && start !== -1) {
        end = i - 1
        matchedIndices.push([start, end])
        start = -1
      }
    }
    if (matchMask[i - 1]) {
      matchedIndices.push([start, i - 1])
    }
    return matchedIndices
  }

  // Export to Common JS Loader
  if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = Fuse
  } else if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(function () {
      return Fuse
    })
  } else {
    // Browser globals (root is window)
    global.Fuse = Fuse
  }

})(this)

},{}],26:[function(require,module,exports){
// Generated by CoffeeScript 1.9.3
(function() {
  var Instafeed;

  Instafeed = (function() {
    function Instafeed(params, context) {
      var option, value;
      this.options = {
        target: 'instafeed',
        get: 'popular',
        resolution: 'thumbnail',
        sortBy: 'none',
        links: true,
        mock: false,
        useHttp: false
      };
      if (typeof params === 'object') {
        for (option in params) {
          value = params[option];
          this.options[option] = value;
        }
      }
      this.context = context != null ? context : this;
      this.unique = this._genKey();
    }

    Instafeed.prototype.hasNext = function() {
      return typeof this.context.nextUrl === 'string' && this.context.nextUrl.length > 0;
    };

    Instafeed.prototype.next = function() {
      if (!this.hasNext()) {
        return false;
      }
      return this.run(this.context.nextUrl);
    };

    Instafeed.prototype.run = function(url) {
      var header, instanceName, script;
      if (typeof this.options.clientId !== 'string') {
        if (typeof this.options.accessToken !== 'string') {
          throw new Error("Missing clientId or accessToken.");
        }
      }
      if (typeof this.options.accessToken !== 'string') {
        if (typeof this.options.clientId !== 'string') {
          throw new Error("Missing clientId or accessToken.");
        }
      }
      if ((this.options.before != null) && typeof this.options.before === 'function') {
        this.options.before.call(this);
      }
      if (typeof document !== "undefined" && document !== null) {
        script = document.createElement('script');
        script.id = 'instafeed-fetcher';
        script.src = url || this._buildUrl();
        header = document.getElementsByTagName('head');
        header[0].appendChild(script);
        instanceName = "instafeedCache" + this.unique;
        window[instanceName] = new Instafeed(this.options, this);
        window[instanceName].unique = this.unique;
      }
      return true;
    };

    Instafeed.prototype.parse = function(response) {
      var anchor, childNodeCount, childNodeIndex, childNodesArr, e, eMsg, fragment, header, htmlString, httpProtocol, i, image, imageObj, imageString, imageUrl, images, img, imgHeight, imgOrient, imgUrl, imgWidth, instanceName, j, k, len, len1, len2, node, parsedLimit, reverse, sortSettings, targetEl, tmpEl;
      if (typeof response !== 'object') {
        if ((this.options.error != null) && typeof this.options.error === 'function') {
          this.options.error.call(this, 'Invalid JSON data');
          return false;
        } else {
          throw new Error('Invalid JSON response');
        }
      }
      if (response.meta.code !== 200) {
        if ((this.options.error != null) && typeof this.options.error === 'function') {
          this.options.error.call(this, response.meta.error_message);
          return false;
        } else {
          throw new Error("Error from Instagram: " + response.meta.error_message);
        }
      }
      if (response.data.length === 0) {
        if ((this.options.error != null) && typeof this.options.error === 'function') {
          this.options.error.call(this, 'No images were returned from Instagram');
          return false;
        } else {
          throw new Error('No images were returned from Instagram');
        }
      }
      if ((this.options.success != null) && typeof this.options.success === 'function') {
        this.options.success.call(this, response);
      }
      this.context.nextUrl = '';
      if (response.pagination != null) {
        this.context.nextUrl = response.pagination.next_url;
      }
      if (this.options.sortBy !== 'none') {
        if (this.options.sortBy === 'random') {
          sortSettings = ['', 'random'];
        } else {
          sortSettings = this.options.sortBy.split('-');
        }
        reverse = sortSettings[0] === 'least' ? true : false;
        switch (sortSettings[1]) {
          case 'random':
            response.data.sort(function() {
              return 0.5 - Math.random();
            });
            break;
          case 'recent':
            response.data = this._sortBy(response.data, 'created_time', reverse);
            break;
          case 'liked':
            response.data = this._sortBy(response.data, 'likes.count', reverse);
            break;
          case 'commented':
            response.data = this._sortBy(response.data, 'comments.count', reverse);
            break;
          default:
            throw new Error("Invalid option for sortBy: '" + this.options.sortBy + "'.");
        }
      }
      if ((typeof document !== "undefined" && document !== null) && this.options.mock === false) {
        images = response.data;
        parsedLimit = parseInt(this.options.limit, 10);
        if ((this.options.limit != null) && images.length > parsedLimit) {
          images = images.slice(0, parsedLimit);
        }
        fragment = document.createDocumentFragment();
        if ((this.options.filter != null) && typeof this.options.filter === 'function') {
          images = this._filter(images, this.options.filter);
        }
        if ((this.options.template != null) && typeof this.options.template === 'string') {
          htmlString = '';
          imageString = '';
          imgUrl = '';
          tmpEl = document.createElement('div');
          for (i = 0, len = images.length; i < len; i++) {
            image = images[i];
            imageObj = image.images[this.options.resolution];
            if (typeof imageObj !== 'object') {
              eMsg = "No image found for resolution: " + this.options.resolution + ".";
              throw new Error(eMsg);
            }
            imgWidth = imageObj.width;
            imgHeight = imageObj.height;
            imgOrient = "square";
            if (imgWidth > imgHeight) {
              imgOrient = "landscape";
            }
            if (imgWidth < imgHeight) {
              imgOrient = "portrait";
            }
            imageUrl = imageObj.url;
            httpProtocol = window.location.protocol.indexOf("http") >= 0;
            if (httpProtocol && !this.options.useHttp) {
              imageUrl = imageUrl.replace(/https?:\/\//, '//');
            }
            imageString = this._makeTemplate(this.options.template, {
              model: image,
              id: image.id,
              link: image.link,
              type: image.type,
              image: imageUrl,
              width: imgWidth,
              height: imgHeight,
              orientation: imgOrient,
              caption: this._getObjectProperty(image, 'caption.text'),
              likes: image.likes.count,
              comments: image.comments.count,
              location: this._getObjectProperty(image, 'location.name')
            });
            htmlString += imageString;
          }
          tmpEl.innerHTML = htmlString;
          childNodesArr = [];
          childNodeIndex = 0;
          childNodeCount = tmpEl.childNodes.length;
          while (childNodeIndex < childNodeCount) {
            childNodesArr.push(tmpEl.childNodes[childNodeIndex]);
            childNodeIndex += 1;
          }
          for (j = 0, len1 = childNodesArr.length; j < len1; j++) {
            node = childNodesArr[j];
            fragment.appendChild(node);
          }
        } else {
          for (k = 0, len2 = images.length; k < len2; k++) {
            image = images[k];
            img = document.createElement('img');
            imageObj = image.images[this.options.resolution];
            if (typeof imageObj !== 'object') {
              eMsg = "No image found for resolution: " + this.options.resolution + ".";
              throw new Error(eMsg);
            }
            imageUrl = imageObj.url;
            httpProtocol = window.location.protocol.indexOf("http") >= 0;
            if (httpProtocol && !this.options.useHttp) {
              imageUrl = imageUrl.replace(/https?:\/\//, '//');
            }
            img.src = imageUrl;
            if (this.options.links === true) {
              anchor = document.createElement('a');
              anchor.href = image.link;
              anchor.appendChild(img);
              fragment.appendChild(anchor);
            } else {
              fragment.appendChild(img);
            }
          }
        }
        targetEl = this.options.target;
        if (typeof targetEl === 'string') {
          targetEl = document.getElementById(targetEl);
        }
        if (targetEl == null) {
          eMsg = "No element with id=\"" + this.options.target + "\" on page.";
          throw new Error(eMsg);
        }
        targetEl.appendChild(fragment);
        header = document.getElementsByTagName('head')[0];
        header.removeChild(document.getElementById('instafeed-fetcher'));
        instanceName = "instafeedCache" + this.unique;
        window[instanceName] = void 0;
        try {
          delete window[instanceName];
        } catch (_error) {
          e = _error;
        }
      }
      if ((this.options.after != null) && typeof this.options.after === 'function') {
        this.options.after.call(this);
      }
      return true;
    };

    Instafeed.prototype._buildUrl = function() {
      var base, endpoint, final;
      base = "https://api.instagram.com/v1";
      switch (this.options.get) {
        case "popular":
          endpoint = "media/popular";
          break;
        case "tagged":
          if (!this.options.tagName) {
            throw new Error("No tag name specified. Use the 'tagName' option.");
          }
          endpoint = "tags/" + this.options.tagName + "/media/recent";
          break;
        case "location":
          if (!this.options.locationId) {
            throw new Error("No location specified. Use the 'locationId' option.");
          }
          endpoint = "locations/" + this.options.locationId + "/media/recent";
          break;
        case "user":
          if (!this.options.userId) {
            throw new Error("No user specified. Use the 'userId' option.");
          }
          endpoint = "users/" + this.options.userId + "/media/recent";
          break;
        default:
          throw new Error("Invalid option for get: '" + this.options.get + "'.");
      }
      final = base + "/" + endpoint;
      if (this.options.accessToken != null) {
        final += "?access_token=" + this.options.accessToken;
      } else {
        final += "?client_id=" + this.options.clientId;
      }
      if (this.options.limit != null) {
        final += "&count=" + this.options.limit;
      }
      final += "&callback=instafeedCache" + this.unique + ".parse";
      return final;
    };

    Instafeed.prototype._genKey = function() {
      var S4;
      S4 = function() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      };
      return "" + (S4()) + (S4()) + (S4()) + (S4());
    };

    Instafeed.prototype._makeTemplate = function(template, data) {
      var output, pattern, ref, varName, varValue;
      pattern = /(?:\{{2})([\w\[\]\.]+)(?:\}{2})/;
      output = template;
      while (pattern.test(output)) {
        varName = output.match(pattern)[1];
        varValue = (ref = this._getObjectProperty(data, varName)) != null ? ref : '';
        output = output.replace(pattern, function() {
          return "" + varValue;
        });
      }
      return output;
    };

    Instafeed.prototype._getObjectProperty = function(object, property) {
      var piece, pieces;
      property = property.replace(/\[(\w+)\]/g, '.$1');
      pieces = property.split('.');
      while (pieces.length) {
        piece = pieces.shift();
        if ((object != null) && piece in object) {
          object = object[piece];
        } else {
          return null;
        }
      }
      return object;
    };

    Instafeed.prototype._sortBy = function(data, property, reverse) {
      var sorter;
      sorter = function(a, b) {
        var valueA, valueB;
        valueA = this._getObjectProperty(a, property);
        valueB = this._getObjectProperty(b, property);
        if (reverse) {
          if (valueA > valueB) {
            return 1;
          } else {
            return -1;
          }
        }
        if (valueA < valueB) {
          return 1;
        } else {
          return -1;
        }
      };
      data.sort(sorter.bind(this));
      return data;
    };

    Instafeed.prototype._filter = function(images, filter) {
      var filteredImages, fn, i, image, len;
      filteredImages = [];
      fn = function(image) {
        if (filter(image)) {
          return filteredImages.push(image);
        }
      };
      for (i = 0, len = images.length; i < len; i++) {
        image = images[i];
        fn(image);
      }
      return filteredImages;
    };

    return Instafeed;

  })();

  (function(root, factory) {
    if (typeof define === 'function' && define.amd) {
      return define([], factory);
    } else if (typeof module === 'object' && module.exports) {
      return module.exports = factory();
    } else {
      return root.Instafeed = factory();
    }
  })(this, function() {
    return Instafeed;
  });

}).call(this);

},{}],27:[function(require,module,exports){
module.exports = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

},{}],28:[function(require,module,exports){
(function (global){
/*!
 * Layzr.js 2.0.4 - A small, fast, and modern library for lazy loading images.
 * Copyright (c) 2016 Michael Cavalea - http://callmecavs.github.io/layzr.js/
 * License: GPL-3.0
 */
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var t;t="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,t.Layzr=e()}}(function(){var e;return function t(e,n,r){function o(f,u){if(!n[f]){if(!e[f]){var s="function"==typeof require&&require;if(!u&&s)return s(f,!0);if(i)return i(f,!0);var c=new Error("Cannot find module '"+f+"'");throw c.code="MODULE_NOT_FOUND",c}var d=n[f]={exports:{}};e[f][0].call(d.exports,function(t){var n=e[f][1][t];return o(n?n:t)},d,d.exports,t,e,n,r)}return n[f].exports}for(var i="function"==typeof require&&require,f=0;f<r.length;f++)o(r[f]);return o}({1:[function(t,n,r){(function(o){!function(t){if("object"==typeof r&&"undefined"!=typeof n)n.exports=t();else if("function"==typeof e&&e.amd)e([],t);else{var i;i="undefined"!=typeof window?window:"undefined"!=typeof o?o:"undefined"!=typeof self?self:this,i.Knot=t()}}(function(){return function e(n,r,o){function i(u,s){if(!r[u]){if(!n[u]){var c="function"==typeof t&&t;if(!s&&c)return c(u,!0);if(f)return f(u,!0);var d=new Error("Cannot find module '"+u+"'");throw d.code="MODULE_NOT_FOUND",d}var a=r[u]={exports:{}};n[u][0].call(a.exports,function(e){var t=n[u][1][e];return i(t?t:e)},a,a.exports,e,n,r,o)}return r[u].exports}for(var f="function"==typeof t&&t,u=0;u<o.length;u++)i(o[u]);return i}({1:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n["default"]=function(){var e=arguments.length<=0||void 0===arguments[0]?{}:arguments[0];return e.events={},e.on=function(t,n){return e.events[t]=e.events[t]||[],e.events[t].push(n),e},e.once=function(t,n){return n._once=!0,e.on(t,n),e},e.off=function(t,n){return 2===arguments.length?e.events[t].splice(e.events[t].indexOf(n),1):delete e.events[t],e},e.emit=function(t){for(var n=arguments.length,r=Array(n>1?n-1:0),o=1;n>o;o++)r[o-1]=arguments[o];var i=e.events[t]&&e.events[t].slice();return i&&i.forEach(function(n){n._once&&e.off(t,n),n.apply(e,r)}),e},e},t.exports=n["default"]},{}]},{},[1])(1)})}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],2:[function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(n,"__esModule",{value:!0});var o=e("knot.js"),i=r(o);n["default"]=function(){function e(){return window.scrollY||window.pageYOffset}function t(){a=e(),n()}function n(){l||(requestAnimationFrame(function(){return s()}),l=!0)}function r(e){return e.getBoundingClientRect().top+a}function o(e){var t=a,n=t+v,o=r(e),i=o+e.offsetHeight,f=h.threshold/100*v;return i>=t-f&&n+f>=o}function f(e){if(m.emit("src:before",e),w&&e.hasAttribute(h.srcset))e.setAttribute("srcset",e.getAttribute(h.srcset));else{var t=y>1&&e.getAttribute(h.retina);e.setAttribute("src",t||e.getAttribute(h.normal))}m.emit("src:after",e),[h.normal,h.retina,h.srcset].forEach(function(t){return e.removeAttribute(t)}),c()}function u(e){var n=e?"addEventListener":"removeEventListener";return["scroll","resize"].forEach(function(e){return window[n](e,t)}),this}function s(){return v=window.innerHeight,p.forEach(function(e){return o(e)&&f(e)}),l=!1,this}function c(){return p=Array.prototype.slice.call(document.querySelectorAll("["+h.normal+"]")),this}var d=arguments.length<=0||void 0===arguments[0]?{}:arguments[0],a=e(),l=void 0,p=void 0,v=void 0,h={normal:d.normal||"data-normal",retina:d.retina||"data-retina",srcset:d.srcset||"data-srcset",threshold:d.threshold||0},w=document.body.classList.contains("srcset")||"srcset"in document.createElement("img"),y=window.devicePixelRatio||window.screen.deviceXDPI/window.screen.logicalXDPI,m=(0,i["default"])({handlers:u,check:s,update:c});return m},t.exports=n["default"]},{"knot.js":1}]},{},[2])(2)});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],29:[function(require,module,exports){
(function (process){
  /* globals require, module */

  'use strict';

  /**
   * Module dependencies.
   */

  var pathtoRegexp = require('path-to-regexp');

  /**
   * Module exports.
   */

  module.exports = page;

  /**
   * Detect click event
   */
  var clickEvent = ('undefined' !== typeof document) && document.ontouchstart ? 'touchstart' : 'click';

  /**
   * To work properly with the URL
   * history.location generated polyfill in https://github.com/devote/HTML5-History-API
   */

  var location = ('undefined' !== typeof window) && (window.history.location || window.location);

  /**
   * Perform initial dispatch.
   */

  var dispatch = true;


  /**
   * Decode URL components (query string, pathname, hash).
   * Accommodates both regular percent encoding and x-www-form-urlencoded format.
   */
  var decodeURLComponents = true;

  /**
   * Base path.
   */

  var base = '';

  /**
   * Running flag.
   */

  var running;

  /**
   * HashBang option
   */

  var hashbang = false;

  /**
   * Previous context, for capturing
   * page exit events.
   */

  var prevContext;

  /**
   * Register `path` with callback `fn()`,
   * or route `path`, or redirection,
   * or `page.start()`.
   *
   *   page(fn);
   *   page('*', fn);
   *   page('/user/:id', load, user);
   *   page('/user/' + user.id, { some: 'thing' });
   *   page('/user/' + user.id);
   *   page('/from', '/to')
   *   page();
   *
   * @param {string|!Function|!Object} path
   * @param {Function=} fn
   * @api public
   */

  function page(path, fn) {
    // <callback>
    if ('function' === typeof path) {
      return page('*', path);
    }

    // route <path> to <callback ...>
    if ('function' === typeof fn) {
      var route = new Route(/** @type {string} */ (path));
      for (var i = 1; i < arguments.length; ++i) {
        page.callbacks.push(route.middleware(arguments[i]));
      }
      // show <path> with [state]
    } else if ('string' === typeof path) {
      page['string' === typeof fn ? 'redirect' : 'show'](path, fn);
      // start [options]
    } else {
      page.start(path);
    }
  }

  /**
   * Callback functions.
   */

  page.callbacks = [];
  page.exits = [];

  /**
   * Current path being processed
   * @type {string}
   */
  page.current = '';

  /**
   * Number of pages navigated to.
   * @type {number}
   *
   *     page.len == 0;
   *     page('/login');
   *     page.len == 1;
   */

  page.len = 0;

  /**
   * Get or set basepath to `path`.
   *
   * @param {string} path
   * @api public
   */

  page.base = function(path) {
    if (0 === arguments.length) return base;
    base = path;
  };

  /**
   * Bind with the given `options`.
   *
   * Options:
   *
   *    - `click` bind to click events [true]
   *    - `popstate` bind to popstate [true]
   *    - `dispatch` perform initial dispatch [true]
   *
   * @param {Object} options
   * @api public
   */

  page.start = function(options) {
    options = options || {};
    if (running) return;
    running = true;
    if (false === options.dispatch) dispatch = false;
    if (false === options.decodeURLComponents) decodeURLComponents = false;
    if (false !== options.popstate) window.addEventListener('popstate', onpopstate, false);
    if (false !== options.click) {
      document.addEventListener(clickEvent, onclick, false);
    }
    if (true === options.hashbang) hashbang = true;
    if (!dispatch) return;
    var url = (hashbang && ~location.hash.indexOf('#!')) ? location.hash.substr(2) + location.search : location.pathname + location.search + location.hash;
    page.replace(url, null, true, dispatch);
  };

  /**
   * Unbind click and popstate event handlers.
   *
   * @api public
   */

  page.stop = function() {
    if (!running) return;
    page.current = '';
    page.len = 0;
    running = false;
    document.removeEventListener(clickEvent, onclick, false);
    window.removeEventListener('popstate', onpopstate, false);
  };

  /**
   * Show `path` with optional `state` object.
   *
   * @param {string} path
   * @param {Object=} state
   * @param {boolean=} dispatch
   * @param {boolean=} push
   * @return {!Context}
   * @api public
   */

  page.show = function(path, state, dispatch, push) {
    var ctx = new Context(path, state);
    page.current = ctx.path;
    if (false !== dispatch) page.dispatch(ctx);
    if (false !== ctx.handled && false !== push) ctx.pushState();
    return ctx;
  };

  /**
   * Goes back in the history
   * Back should always let the current route push state and then go back.
   *
   * @param {string} path - fallback path to go back if no more history exists, if undefined defaults to page.base
   * @param {Object=} state
   * @api public
   */

  page.back = function(path, state) {
    if (page.len > 0) {
      // this may need more testing to see if all browsers
      // wait for the next tick to go back in history
      history.back();
      page.len--;
    } else if (path) {
      setTimeout(function() {
        page.show(path, state);
      });
    }else{
      setTimeout(function() {
        page.show(base, state);
      });
    }
  };


  /**
   * Register route to redirect from one path to other
   * or just redirect to another route
   *
   * @param {string} from - if param 'to' is undefined redirects to 'from'
   * @param {string=} to
   * @api public
   */
  page.redirect = function(from, to) {
    // Define route from a path to another
    if ('string' === typeof from && 'string' === typeof to) {
      page(from, function(e) {
        setTimeout(function() {
          page.replace(/** @type {!string} */ (to));
        }, 0);
      });
    }

    // Wait for the push state and replace it with another
    if ('string' === typeof from && 'undefined' === typeof to) {
      setTimeout(function() {
        page.replace(from);
      }, 0);
    }
  };

  /**
   * Replace `path` with optional `state` object.
   *
   * @param {string} path
   * @param {Object=} state
   * @param {boolean=} init
   * @param {boolean=} dispatch
   * @return {!Context}
   * @api public
   */


  page.replace = function(path, state, init, dispatch) {
    var ctx = new Context(path, state);
    page.current = ctx.path;
    ctx.init = init;
    ctx.save(); // save before dispatching, which may redirect
    if (false !== dispatch) page.dispatch(ctx);
    return ctx;
  };

  /**
   * Dispatch the given `ctx`.
   *
   * @param {Context} ctx
   * @api private
   */
  page.dispatch = function(ctx) {
    var prev = prevContext,
      i = 0,
      j = 0;

    prevContext = ctx;

    function nextExit() {
      var fn = page.exits[j++];
      if (!fn) return nextEnter();
      fn(prev, nextExit);
    }

    function nextEnter() {
      var fn = page.callbacks[i++];

      if (ctx.path !== page.current) {
        ctx.handled = false;
        return;
      }
      if (!fn) return unhandled(ctx);
      fn(ctx, nextEnter);
    }

    if (prev) {
      nextExit();
    } else {
      nextEnter();
    }
  };

  /**
   * Unhandled `ctx`. When it's not the initial
   * popstate then redirect. If you wish to handle
   * 404s on your own use `page('*', callback)`.
   *
   * @param {Context} ctx
   * @api private
   */
  function unhandled(ctx) {
    if (ctx.handled) return;
    var current;

    if (hashbang) {
      current = base + location.hash.replace('#!', '');
    } else {
      current = location.pathname + location.search;
    }

    if (current === ctx.canonicalPath) return;
    page.stop();
    ctx.handled = false;
    location.href = ctx.canonicalPath;
  }

  /**
   * Register an exit route on `path` with
   * callback `fn()`, which will be called
   * on the previous context when a new
   * page is visited.
   */
  page.exit = function(path, fn) {
    if (typeof path === 'function') {
      return page.exit('*', path);
    }

    var route = new Route(path);
    for (var i = 1; i < arguments.length; ++i) {
      page.exits.push(route.middleware(arguments[i]));
    }
  };

  /**
   * Remove URL encoding from the given `str`.
   * Accommodates whitespace in both x-www-form-urlencoded
   * and regular percent-encoded form.
   *
   * @param {string} val - URL component to decode
   */
  function decodeURLEncodedURIComponent(val) {
    if (typeof val !== 'string') { return val; }
    return decodeURLComponents ? decodeURIComponent(val.replace(/\+/g, ' ')) : val;
  }

  /**
   * Initialize a new "request" `Context`
   * with the given `path` and optional initial `state`.
   *
   * @constructor
   * @param {string} path
   * @param {Object=} state
   * @api public
   */

  function Context(path, state) {
    if ('/' === path[0] && 0 !== path.indexOf(base)) path = base + (hashbang ? '#!' : '') + path;
    var i = path.indexOf('?');

    this.canonicalPath = path;
    this.path = path.replace(base, '') || '/';
    if (hashbang) this.path = this.path.replace('#!', '') || '/';

    this.title = document.title;
    this.state = state || {};
    this.state.path = path;
    this.querystring = ~i ? decodeURLEncodedURIComponent(path.slice(i + 1)) : '';
    this.pathname = decodeURLEncodedURIComponent(~i ? path.slice(0, i) : path);
    this.params = {};

    // fragment
    this.hash = '';
    if (!hashbang) {
      if (!~this.path.indexOf('#')) return;
      var parts = this.path.split('#');
      this.path = parts[0];
      this.hash = decodeURLEncodedURIComponent(parts[1]) || '';
      this.querystring = this.querystring.split('#')[0];
    }
  }

  /**
   * Expose `Context`.
   */

  page.Context = Context;

  /**
   * Push state.
   *
   * @api private
   */

  Context.prototype.pushState = function() {
    page.len++;
    history.pushState(this.state, this.title, hashbang && this.path !== '/' ? '#!' + this.path : this.canonicalPath);
  };

  /**
   * Save the context state.
   *
   * @api public
   */

  Context.prototype.save = function() {
    history.replaceState(this.state, this.title, hashbang && this.path !== '/' ? '#!' + this.path : this.canonicalPath);
  };

  /**
   * Initialize `Route` with the given HTTP `path`,
   * and an array of `callbacks` and `options`.
   *
   * Options:
   *
   *   - `sensitive`    enable case-sensitive routes
   *   - `strict`       enable strict matching for trailing slashes
   *
   * @constructor
   * @param {string} path
   * @param {Object=} options
   * @api private
   */

  function Route(path, options) {
    options = options || {};
    this.path = (path === '*') ? '(.*)' : path;
    this.method = 'GET';
    this.regexp = pathtoRegexp(this.path,
      this.keys = [],
      options);
  }

  /**
   * Expose `Route`.
   */

  page.Route = Route;

  /**
   * Return route middleware with
   * the given callback `fn()`.
   *
   * @param {Function} fn
   * @return {Function}
   * @api public
   */

  Route.prototype.middleware = function(fn) {
    var self = this;
    return function(ctx, next) {
      if (self.match(ctx.path, ctx.params)) return fn(ctx, next);
      next();
    };
  };

  /**
   * Check if this route matches `path`, if so
   * populate `params`.
   *
   * @param {string} path
   * @param {Object} params
   * @return {boolean}
   * @api private
   */

  Route.prototype.match = function(path, params) {
    var keys = this.keys,
      qsIndex = path.indexOf('?'),
      pathname = ~qsIndex ? path.slice(0, qsIndex) : path,
      m = this.regexp.exec(decodeURIComponent(pathname));

    if (!m) return false;

    for (var i = 1, len = m.length; i < len; ++i) {
      var key = keys[i - 1];
      var val = decodeURLEncodedURIComponent(m[i]);
      if (val !== undefined || !(hasOwnProperty.call(params, key.name))) {
        params[key.name] = val;
      }
    }

    return true;
  };


  /**
   * Handle "populate" events.
   */

  var onpopstate = (function () {
    var loaded = false;
    if ('undefined' === typeof window) {
      return;
    }
    if (document.readyState === 'complete') {
      loaded = true;
    } else {
      window.addEventListener('load', function() {
        setTimeout(function() {
          loaded = true;
        }, 0);
      });
    }
    return function onpopstate(e) {
      if (!loaded) return;
      if (e.state) {
        var path = e.state.path;
        page.replace(path, e.state);
      } else {
        page.show(location.pathname + location.hash, undefined, undefined, false);
      }
    };
  })();
  /**
   * Handle "click" events.
   */

  function onclick(e) {

    if (1 !== which(e)) return;

    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    if (e.defaultPrevented) return;



    // ensure link
    var el = e.target;
    while (el && 'A' !== el.nodeName) el = el.parentNode;
    if (!el || 'A' !== el.nodeName) return;



    // Ignore if tag has
    // 1. "download" attribute
    // 2. rel="external" attribute
    if (el.hasAttribute('download') || el.getAttribute('rel') === 'external') return;

    // ensure non-hash for the same path
    var link = el.getAttribute('href');
    if (!hashbang && el.pathname === location.pathname && (el.hash || '#' === link)) return;



    // Check for mailto: in the href
    if (link && link.indexOf('mailto:') > -1) return;

    // check target
    if (el.target) return;

    // x-origin
    if (!sameOrigin(el.href)) return;



    // rebuild path
    var path = el.pathname + el.search + (el.hash || '');

    // strip leading "/[drive letter]:" on NW.js on Windows
    if (typeof process !== 'undefined' && path.match(/^\/[a-zA-Z]:\//)) {
      path = path.replace(/^\/[a-zA-Z]:\//, '/');
    }

    // same page
    var orig = path;

    if (path.indexOf(base) === 0) {
      path = path.substr(base.length);
    }

    if (hashbang) path = path.replace('#!', '');

    if (base && orig === path) return;

    e.preventDefault();
    page.show(orig);
  }

  /**
   * Event button.
   */

  function which(e) {
    e = e || window.event;
    return null === e.which ? e.button : e.which;
  }

  /**
   * Check if `href` is the same origin.
   */

  function sameOrigin(href) {
    var origin = location.protocol + '//' + location.hostname;
    if (location.port) origin += ':' + location.port;
    return (href && (0 === href.indexOf(origin)));
  }

  page.sameOrigin = sameOrigin;

}).call(this,require('_process'))
},{"_process":31,"path-to-regexp":30}],30:[function(require,module,exports){
var isarray = require('isarray')

/**
 * Expose `pathToRegexp`.
 */
module.exports = pathToRegexp
module.exports.parse = parse
module.exports.compile = compile
module.exports.tokensToFunction = tokensToFunction
module.exports.tokensToRegExp = tokensToRegExp

/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
var PATH_REGEXP = new RegExp([
  // Match escaped characters that would otherwise appear in future matches.
  // This allows the user to escape special characters that won't transform.
  '(\\\\.)',
  // Match Express-style parameters and un-named parameters with a prefix
  // and optional suffixes. Matches appear as:
  //
  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
  // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
  // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
  '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^()])+)\\))?|\\(((?:\\\\.|[^()])+)\\))([+*?])?|(\\*))'
].join('|'), 'g')

/**
 * Parse a string for the raw tokens.
 *
 * @param  {String} str
 * @return {Array}
 */
function parse (str) {
  var tokens = []
  var key = 0
  var index = 0
  var path = ''
  var res

  while ((res = PATH_REGEXP.exec(str)) != null) {
    var m = res[0]
    var escaped = res[1]
    var offset = res.index
    path += str.slice(index, offset)
    index = offset + m.length

    // Ignore already escaped sequences.
    if (escaped) {
      path += escaped[1]
      continue
    }

    // Push the current path onto the tokens.
    if (path) {
      tokens.push(path)
      path = ''
    }

    var prefix = res[2]
    var name = res[3]
    var capture = res[4]
    var group = res[5]
    var suffix = res[6]
    var asterisk = res[7]

    var repeat = suffix === '+' || suffix === '*'
    var optional = suffix === '?' || suffix === '*'
    var delimiter = prefix || '/'
    var pattern = capture || group || (asterisk ? '.*' : '[^' + delimiter + ']+?')

    tokens.push({
      name: name || key++,
      prefix: prefix || '',
      delimiter: delimiter,
      optional: optional,
      repeat: repeat,
      pattern: escapeGroup(pattern)
    })
  }

  // Match any characters still remaining.
  if (index < str.length) {
    path += str.substr(index)
  }

  // If the path exists, push it onto the end.
  if (path) {
    tokens.push(path)
  }

  return tokens
}

/**
 * Compile a string to a template function for the path.
 *
 * @param  {String}   str
 * @return {Function}
 */
function compile (str) {
  return tokensToFunction(parse(str))
}

/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction (tokens) {
  // Compile all the tokens into regexps.
  var matches = new Array(tokens.length)

  // Compile all the patterns before compilation.
  for (var i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] === 'object') {
      matches[i] = new RegExp('^' + tokens[i].pattern + '$')
    }
  }

  return function (obj) {
    var path = ''
    var data = obj || {}

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i]

      if (typeof token === 'string') {
        path += token

        continue
      }

      var value = data[token.name]
      var segment

      if (value == null) {
        if (token.optional) {
          continue
        } else {
          throw new TypeError('Expected "' + token.name + '" to be defined')
        }
      }

      if (isarray(value)) {
        if (!token.repeat) {
          throw new TypeError('Expected "' + token.name + '" to not repeat, but received "' + value + '"')
        }

        if (value.length === 0) {
          if (token.optional) {
            continue
          } else {
            throw new TypeError('Expected "' + token.name + '" to not be empty')
          }
        }

        for (var j = 0; j < value.length; j++) {
          segment = encodeURIComponent(value[j])

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
          }

          path += (j === 0 ? token.prefix : token.delimiter) + segment
        }

        continue
      }

      segment = encodeURIComponent(value)

      if (!matches[i].test(segment)) {
        throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
      }

      path += token.prefix + segment
    }

    return path
  }
}

/**
 * Escape a regular expression string.
 *
 * @param  {String} str
 * @return {String}
 */
function escapeString (str) {
  return str.replace(/([.+*?=^!:${}()[\]|\/])/g, '\\$1')
}

/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {String} group
 * @return {String}
 */
function escapeGroup (group) {
  return group.replace(/([=!:$\/()])/g, '\\$1')
}

/**
 * Attach the keys as a property of the regexp.
 *
 * @param  {RegExp} re
 * @param  {Array}  keys
 * @return {RegExp}
 */
function attachKeys (re, keys) {
  re.keys = keys
  return re
}

/**
 * Get the flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {String}
 */
function flags (options) {
  return options.sensitive ? '' : 'i'
}

/**
 * Pull out keys from a regexp.
 *
 * @param  {RegExp} path
 * @param  {Array}  keys
 * @return {RegExp}
 */
function regexpToRegexp (path, keys) {
  // Use a negative lookahead to match only capturing groups.
  var groups = path.source.match(/\((?!\?)/g)

  if (groups) {
    for (var i = 0; i < groups.length; i++) {
      keys.push({
        name: i,
        prefix: null,
        delimiter: null,
        optional: false,
        repeat: false,
        pattern: null
      })
    }
  }

  return attachKeys(path, keys)
}

/**
 * Transform an array into a regexp.
 *
 * @param  {Array}  path
 * @param  {Array}  keys
 * @param  {Object} options
 * @return {RegExp}
 */
function arrayToRegexp (path, keys, options) {
  var parts = []

  for (var i = 0; i < path.length; i++) {
    parts.push(pathToRegexp(path[i], keys, options).source)
  }

  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options))

  return attachKeys(regexp, keys)
}

/**
 * Create a path regexp from string input.
 *
 * @param  {String} path
 * @param  {Array}  keys
 * @param  {Object} options
 * @return {RegExp}
 */
function stringToRegexp (path, keys, options) {
  var tokens = parse(path)
  var re = tokensToRegExp(tokens, options)

  // Attach keys back to the regexp.
  for (var i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] !== 'string') {
      keys.push(tokens[i])
    }
  }

  return attachKeys(re, keys)
}

/**
 * Expose a function for taking tokens and returning a RegExp.
 *
 * @param  {Array}  tokens
 * @param  {Array}  keys
 * @param  {Object} options
 * @return {RegExp}
 */
function tokensToRegExp (tokens, options) {
  options = options || {}

  var strict = options.strict
  var end = options.end !== false
  var route = ''
  var lastToken = tokens[tokens.length - 1]
  var endsWithSlash = typeof lastToken === 'string' && /\/$/.test(lastToken)

  // Iterate over the tokens and create our regexp string.
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i]

    if (typeof token === 'string') {
      route += escapeString(token)
    } else {
      var prefix = escapeString(token.prefix)
      var capture = token.pattern

      if (token.repeat) {
        capture += '(?:' + prefix + capture + ')*'
      }

      if (token.optional) {
        if (prefix) {
          capture = '(?:' + prefix + '(' + capture + '))?'
        } else {
          capture = '(' + capture + ')?'
        }
      } else {
        capture = prefix + '(' + capture + ')'
      }

      route += capture
    }
  }

  // In non-strict mode we allow a slash at the end of match. If the path to
  // match already ends with a slash, we remove it for consistency. The slash
  // is valid at the end of a path match, not in the middle. This is important
  // in non-ending mode, where "/test/" shouldn't match "/test//route".
  if (!strict) {
    route = (endsWithSlash ? route.slice(0, -2) : route) + '(?:\\/(?=$))?'
  }

  if (end) {
    route += '$'
  } else {
    // In non-ending mode, we need the capturing groups to match as much as
    // possible by using a positive lookahead to the end or next path segment.
    route += strict && endsWithSlash ? '' : '(?=\\/|$)'
  }

  return new RegExp('^' + route, flags(options))
}

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(String|RegExp|Array)} path
 * @param  {Array}                 [keys]
 * @param  {Object}                [options]
 * @return {RegExp}
 */
function pathToRegexp (path, keys, options) {
  keys = keys || []

  if (!isarray(keys)) {
    options = keys
    keys = []
  } else if (!options) {
    options = {}
  }

  if (path instanceof RegExp) {
    return regexpToRegexp(path, keys, options)
  }

  if (isarray(path)) {
    return arrayToRegexp(path, keys, options)
  }

  return stringToRegexp(path, keys, options)
}

},{"isarray":27}],31:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],32:[function(require,module,exports){
'use strict';

var raf = require('component-raf');
var scrollTop = require('scrolltop');
var Emitter = require('tiny-emitter');
var emitter = new Emitter();
var rafId = -1;
var scrollY = 0;
var deltaY = 0;
var ticking = false;

module.exports = {
  add: function(fn) {
    emitter.on('scroll', fn);

    // Start raf on first callback
    if (emitter.e.scroll.length === 1) {
      rafId = raf(update);
    }
  },

  addOnce: function(fn) {
    emitter.once('scroll', fn);

    // Start raf on first callback
    if (emitter.e.scroll.length === 1) {
      rafId = raf(update);
    }
  },

  remove: function(fn) {
    emitter.off('scroll', fn);

    // Stop raf if there is no more callbacks
    if (!emitter.e.scroll || emitter.e.scroll.length < 1) {
      raf.cancel(rafId);
    }
  },

  getCurrent: function() {
    return getEvent();
  },

  destroy: function() {
    raf.cancel(rafId);
    emitter = new Emitter();
    scrollY = 0;
    deltaY = 0;
  }
};

function getEvent() {
  if (ticking) {
    var scroll = scrollTop();
    deltaY = scroll - scrollY;
  }

  return {
    scrollY: scrollY,
    deltaY: deltaY
  };
}

function update() {
  rafId = raf(update);

  ticking = true;
  emitter.emit('scroll', getEvent());
  ticking = false;
}

},{"component-raf":23,"scrolltop":33,"tiny-emitter":35}],33:[function(require,module,exports){

/**
 * get the window's scrolltop.
 * 
 * @return {Number}
 */

module.exports = function(){
  if (window.pageYOffset) return window.pageYOffset;
  return document.documentElement.clientHeight
    ? document.documentElement.scrollTop
    : document.body.scrollTop;
};

},{}],34:[function(require,module,exports){

/**
 * Generate a slug from the given `str`.
 *
 * example:
 *
 *        generate('foo bar');
 *        // > foo-bar
 *
 * @param {String} str
 * @param {Object} options
 * @config {String|RegExp} [replace] characters to replace, defaulted to `/[^a-z0-9]/g`
 * @config {String} [separator] separator to insert, defaulted to `-`
 * @return {String}
 */

module.exports = function (str, options) {
  options || (options = {});
  return str.toLowerCase()
    .replace(options.replace || /[^a-z0-9]/g, ' ')
    .replace(/^ +| +$/g, '')
    .replace(/ +/g, options.separator || '-')
};

},{}],35:[function(require,module,exports){
function E () {
	// Keep this empty so it's easier to inherit from
  // (via https://github.com/lipsmack from https://github.com/scottcorgan/tiny-emitter/issues/3)
}

E.prototype = {
	on: function (name, callback, ctx) {
    var e = this.e || (this.e = {});

    (e[name] || (e[name] = [])).push({
      fn: callback,
      ctx: ctx
    });

    return this;
  },

  once: function (name, callback, ctx) {
    var self = this;
    function listener () {
      self.off(name, listener);
      callback.apply(ctx, arguments);
    };

    listener._ = callback
    return this.on(name, listener, ctx);
  },

  emit: function (name) {
    var data = [].slice.call(arguments, 1);
    var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
    var i = 0;
    var len = evtArr.length;

    for (i; i < len; i++) {
      evtArr[i].fn.apply(evtArr[i].ctx, data);
    }

    return this;
  },

  off: function (name, callback) {
    var e = this.e || (this.e = {});
    var evts = e[name];
    var liveEvents = [];

    if (evts && callback) {
      for (var i = 0, len = evts.length; i < len; i++) {
        if (evts[i].fn !== callback && evts[i].fn._ !== callback)
          liveEvents.push(evts[i]);
      }
    }

    // Remove event from queue to prevent memory leak
    // Suggested by https://github.com/lazd
    // Ref: https://github.com/scottcorgan/tiny-emitter/commit/c6ebfaa9bc973b33d110a84a307742b7cf94c953#commitcomment-5024910

    (liveEvents.length)
      ? e[name] = liveEvents
      : delete e[name];

    return this;
  }
};

module.exports = E;

},{}],36:[function(require,module,exports){
/**
 *  vein.js - version 0.3
 *
 *  by Danny Povolotski (dannypovolotski@gmail.com)
 **/

!function (name, definition) {
    if (typeof module != 'undefined') module.exports = definition()
    else if (typeof define == 'function' && define.amd) define(name, definition)
    else this[name] = definition()
}('vein', function () {
    var vein = function(){};

    // Kudos to: http://youmightnotneedjquery.com/
    var extend = function(out) {
      out = out || {};

      for (var i = 1; i < arguments.length; i++) {
        if (!arguments[i])
          continue;

        for (var key in arguments[i]) {
          if (arguments[i].hasOwnProperty(key))
            out[key] = arguments[i][key];
        }
      }

      return out;
    };

    var findOrDeleteBySelector = function(selector, stylesheet, css){
        var matches = [],
            rules = stylesheet[ document.all ? 'rules' : 'cssRules' ],
            selectorCompare = selector.replace(/\s/g,''),
            ri, rl;

        // Since there could theoretically be multiple versions of the same rule,
        // we will first iterate
        for(ri = 0, rl = rules.length; ri < rl; ri++) {
            if(
                // regular style selector
                (rules[ri].selectorText === selector)   ||
                // for media queries, remove spaces and see if the query matches
                (rules[ri].type === 4 && rules[ri].cssText.replace(/\s/g,'').substring(0, selectorCompare.length) == selectorCompare)
            ) {
                if(css === null) {
                    // If we set css to null, let's delete that ruleset altogether
                    stylesheet.deleteRule(ri);
                }
                else {
                    // Otherwise - we push it into the matches array
                    matches.push(rules[ri]);
                }
            }
        }

        return matches;
    };

    var cssToString = function(css){
        cssArray = [];

        for(property in css) {
            if (css.hasOwnProperty(property)) {
                cssArray.push(property + ': ' + css[property] + ';');
            }
        }
        cssText = cssArray.join('');
        return cssText;
    };

    // Get the stylesheet we use to inject stuff or create it if it doesn't exist yet
    vein.getStylesheet = function() {
        var self = this,
            si, sl;

        if(!self.element || !document.getElementById('vein')) {
            self.element = document.createElement("style");
            self.element.setAttribute('type', 'text/css');
            self.element.setAttribute('id', 'vein');
            document.getElementsByTagName("head")[0].appendChild(self.element);

            self.stylesheet = self.element.sheet;
        }

        return self.stylesheet;
    };

    var getRulesFromStylesheet = function(stylesheet){
        return stylesheet[ document.all ? 'rules' : 'cssRules' ];
    }

    var insertRule = function(selector, cssText, stylesheet){
        var rules = getRulesFromStylesheet(stylesheet);

        if(stylesheet.insertRule) {
            // Supported by all modern browsers
            stylesheet.insertRule(selector + '{' + cssText + '}', rules.length);
        } else {
            // Old IE compatability
            stylesheet.addRule(selector, cssText, rules.length);
        }
    };

    // Let's inject some CSS. We can supply an array (or string) of selectors, and an object
    // with CSS value and property pairs.
    vein.inject = function(selectors, css, options) {
        options = extend({}, options);

        var self        =   this,
            stylesheet  =   options.stylesheet || self.getStylesheet(),
            rules       =   getRulesFromStylesheet(stylesheet),
            si, sl, query, matches, cssText, property, mi, ml, qi, ql;

        if(typeof selectors === 'string') {
            selectors = [selectors];
        }

        for(si = 0, sl = selectors.length; si < sl; si++) {
            if(typeof selectors[si] === 'object' && stylesheet.insertRule){
                for(query in selectors[si]) {
                    matches = findOrDeleteBySelector(query, stylesheet, css);

                    if(matches.length === 0){
                        cssText = cssToString(css);
                        for(qi = 0, ql = selectors[si][query].length; qi < ql; qi++) {
                            insertRule(query, selectors[si][query][qi] + '{' + cssText + '}', stylesheet);
                        }
                    } else {
                        for(mi = 0, ml = matches.length; mi < ml; mi++) {
                            self.inject(selectors[si][query], css, {stylesheet: matches[mi]});
                        }
                    }
                }
            } else {
                matches = findOrDeleteBySelector(selectors[si], stylesheet, css);

                // If all we wanted is to delete that ruleset, we're done here
                if(css === null) return;

                // If no rulesets have been found for the selector, we will create it below
                if(matches.length === 0) {
                    cssText = cssToString(css);
                    insertRule(selectors[si], cssText, stylesheet);
                }

                // Otherwise, we're just going to modify the property
                else {
                    for(mi = 0, ml = matches.length; mi < ml; mi++) {
                        for(property in css) {
                            if (css.hasOwnProperty(property)) {
                                // TODO: Implement priority
                                if(matches[mi].style.setProperty) {
                                    matches[mi].style.setProperty(property, css[property], '');
                                } else {
                                    //IE8
                                    matches[mi].style.setAttribute(property, css[property], '');
                                }
                            }
                        }
                    }
                }
            }
        }

        return self;
    };

    return vein;
});

},{}]},{},[1]);
