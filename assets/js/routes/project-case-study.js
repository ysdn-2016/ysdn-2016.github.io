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

    var progress = (window.scrollY * 1.2) / (measurements.window.height / 2);
    $intro.css({
      transform: 'translateY(' + Math.round(progress * 200) + 'px)',
      opacity: Math.max(1 - progress, 0)
    });

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
