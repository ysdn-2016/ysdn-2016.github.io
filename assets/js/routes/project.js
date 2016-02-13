var slugify = require('slug-component');

module.exports = function () {
  if ($('.project--standard')[0]) {
    // Standard Project
    $('iframe').prependTo('#gallery .project-assets');

    // Find all YouTube videos
    var $allVideos = $('iframe'),
      // The element that is fluid width
      $fluidEl = $('.project-assets');
    console.log($allVideos);
    // Figure out and save aspect ratio for each video
    $allVideos.each(function () {
      $(this)
        .data('aspectRatio', this.height / this.width)
        // and remove the hard coded width/height
        .removeAttr('height')
        .removeAttr('width');
    });
    // When the window is resized
    $(window).resize(function () {
      var newWidth = $fluidEl.width();
      // Resize all videos according to their own aspect ratio
      $allVideos.each(function () {
        var $el = $(this);
        $el
          .width(newWidth)
          .height(newWidth * $el.data('aspectRatio'));
      });
    // Kick off one resize to fix all videos on page load
    }).resize();

    var windw = this;

    // Sticky Function
    $.fn.followTo = function () {
      var overlay = $('#project-fixed-overlay'),
        container = $('#content');
      var lastScrollTop = 0,
        scroll,
        lastdownposition,
        lastupposition,
        overlayHeight = overlay.height(),
        containerTop = container.offset().top,
        direction;

      // When scrolling
      $(windw).scroll(function (e) {
        scroll = $(window).scrollTop();
        console.log('scroll' + scroll);
        var windowHeight = $(window).height(),
          bottomScroll = scroll + windowHeight,
          containerHeight = container.height(),
          overlayTop = overlay.offset().top,
          overlayBottom = overlayHeight + overlayTop,
          bottomhit = containerTop + containerHeight + (windowHeight - overlayHeight);

        // if the window is smaller than the overlay itself
        if (windowHeight < overlayHeight) {
          console.log('Overlay is bigger');
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
                  position: 'absolute',
                  top: (lastupposition - containerTop)
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
                  position: 'absolute',
                  top: (lastdownposition - containerTop)
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
          console.log('Overlay is smaller');
          console.log('bottomScroll' + bottomScroll);
          console.log('bottomhit' + bottomhit);
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
    // Case Studies

    $(document).ready(function () {
      var $mainNav = $('.case-nav');
      $mainNav.append("<li id='indicator'></li>"),
      $indicator = $('#indicator');
      $('.project-content p img').unwrap();
      $('.project-content img:first-of-type').appendTo('.project-header');
      $('.project-content').find('h1, h3, h5').each(function () {
        var $self = $(this);
        var currentId = $self.attr('id');
        if (!currentId) {
          currentId = slugify($self.text());
          $self.attr('id', currentId);
        }
        $self.contents().clone().appendTo('.case-nav').wrap("<a href='#" + currentId + "' class='new'></a>");
      });
      $('.case-nav a:first-of-type').addClass('active');
      $('.case-nav a').click(function (e) {
        e.preventDefault();
        $('html, body').animate({
          scrollTop: $($(this).attr('href')).offset().top - 80
        }, 500);
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
        windowHeight = $(window).height(),
        direction;

      $(windw).scroll(function (e) {
        scroll = $(window).scrollTop();
        var bottomScroll = scroll + windowHeight,
          overlayHeight = overlay.height(),
          containerTop = container.offset().top,
          containerHeight = container.height(),
          overlayTop = overlay.offset().top,
          overlayBottom = overlayHeight + overlayTop,
          bottomhit = containerTop + containerHeight + (windowHeight - overlayHeight);

        if (scroll > 400) {
          $('.title').css({
            'display': 'none'
          });
        } else {
          $('.title').css({
            'display': 'block'
          });
        }

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
        $('.project-content h1, .project-content h3, .project-content h5').each(function (i) {
          if ($(this).position().top <= scroll - $('#content').position().top + 80) {
            $('.case-nav a.active').removeClass('active');
            $('.case-nav a').eq(i).addClass('active');
          }
        });
        // Section Indicator
        $indicator
          .height($('.active').height())
          .css('top', $('.active').position().top);
      });
    };
    $('#project-fixed-overlay').followTo();
  }
};
