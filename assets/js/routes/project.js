module.exports = function () {
  if ($('.project--standard')[0]) {
    console.log('Running');
    var windw = this;
    $.fn.followTo = function () {
      var overlay = $('#project-fixed-overlay'),
        container = $('#content');
      var lastScrollTop = 0,
        scroll,
        lastdownposition,
        lastupposition,
        overlayHeight = overlay.height(),
        windowHeight = $(window).height(),
        containerTop = container.offset().top,
        direction;

      $(windw).scroll(function (e) {
        scroll = $(window).scrollTop();
        var bottomScroll = scroll + windowHeight,
          containerHeight = container.height(),
          overlayTop = overlay.offset().top,
          overlayBottom = overlayHeight + overlayTop,
          bottomhit = containerTop + containerHeight + (windowHeight - overlayHeight);

        if (windowHeight < overlayHeight) {
          // Determine Scroll Direction & position of overlay
          var st = $(this).scrollTop();
          if (st > lastScrollTop) {
            direction = 'down';
            lastScrollTop = st;
            lastdownposition = overlayTop;
          } else {
            overlay.removeClass();
            direction = 'up';
            lastScrollTop = st;
            lastupposition = overlayTop;
          }

          // Find out if the current view is wihtin content bounds (top & bottom)
          if ((scroll > containerTop) && (bottomScroll < (containerTop + containerHeight))) {
            // Within Bounds
            console.log('withinBounds');
            if (direction == 'up') {
              console.log('up');
              if (scroll <= overlayTop) {
                console.log('Stick to top');
                overlay.attr('class', 'sticktop');
              } else {
                overlay.attr('class', 'stuck');
                overlay.css({
                  position: 'absolute', top: (lastupposition - containerTop)
                });
              }
            } else if (direction == 'down') {
              console.log('down');
              if (bottomScroll >= (overlayTop + overlayHeight)) {
                console.log('Hit bottom of box');
                overlay.attr('class', 'stickbottom');
              } else {
                overlay.attr('class', 'stuck');
                overlay.css({
                  position: 'absolute', top: (lastdownposition - containerTop)
                });
              }
            }
          } else {
            // Outside of Bounds
            console.log('outsideBounds');
            if (scroll < containerTop) {
              overlay.attr('class', 'sticktopwindow');
            } else if (bottomScroll > (containerTop + containerHeight)) {
              overlay.attr('class', 'stickbottomwindow');
            }
          }
        }
        if (windowHeight > overlayHeight) {
          if (scroll > containerTop) {
            // if scroll past top of content
            overlay.attr('class', 'sticktop');
          } else if (scroll < containerTop) {
            overlay.attr('class', 'sticktopwindow');
          }
          if (bottomScroll > bottomhit) {
            // if scroll past bottom of content
            overlay.attr('class', 'stickbottomwindow');
          }
        }
      });
    };
    $('#project-fixed-overlay').followTo();
  } else {
    $(document).ready(function () {
      var $mainNav = $('.case-nav');
      $mainNav.append("<li id='indicator'></li>"),
      $indicator = $('#indicator');
      $('.project-content p img').unwrap();
      $('.project-content img:first-of-type').appendTo('.project-header');
      $('.project-content h1, .project-content h2, .project-content h3').each(function () {
        var currentId = $(this).attr('id');
        $(this).contents().appendTo('.case-nav').wrap("<a href='#" + currentId + "' class='new'></a>");
      });
      $('.case-nav a:first-of-type').addClass('active');
      $('a').click(function () {
        $('html, body').animate({
          scrollTop: $($(this).attr('href')).offset().top - 80
        }, 500);
        return false;
      });
    });

    console.log('Running Case Study');
    var windw = this;
    var thing;
    $.fn.followTo = function () {
      var overlay = $('#project-fixed-overlay'),
        container = $('#content');
      var lastScrollTop = 0,
        scroll,
        lastdownposition,
        lastupposition,
        overlayHeight = overlay.height(),
        windowHeight = $(window).height(),
        direction;

      $(windw).scroll(function (e) {
        scroll = $(window).scrollTop();
        var bottomScroll = scroll + windowHeight,
          containerTop = container.offset().top,
          containerHeight = container.height(),
          overlayTop = overlay.offset().top,
          overlayBottom = overlayHeight + overlayTop,
          bottomhit = containerTop + containerHeight + (windowHeight - overlayHeight);

        if (scroll > containerTop) {
          // if scroll past top of content
          overlay.attr('class', 'sticktop');
        } else if (scroll < containerTop) {
          overlay.attr('class', 'sticktopwindow');
        }
        if (bottomScroll > bottomhit) {
          // if scroll past bottom of content
          overlay.attr('class', 'stickbottomwindow');
        }
        // this controls the section nav
        $('.project-content h1, .project-content h2, .project-content h3').each(function (i) {
          if ($(this).position().top <= scroll - $('#content').position().top + 80) {
            $('.case-nav a.active').removeClass('active');
            $('.case-nav a').eq(i).addClass('active');
          }
        });
        // Section Indicator
        $indicator
          .height($('.active').height())
          .css('top', $('.active').position().top + 2);
        $('.case-nav a').hover(function () {
          $indicator
            .height($(this).height())
            .css('top', $(this).position().top + 2);
          $(this).css('color', 'black');
        }, function () {
          $indicator
            .height($('.active').height())
            .css('top', $('.active').position().top + 2);
          $(this).css('color', '');
        });
      });
    };
    $('#project-fixed-overlay').followTo();
  }
};
