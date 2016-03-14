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
  } else {
    // Case Studies
    $(document).ready(function () {
      var $mainNav = $('.case-nav');
      $mainNav.prepend("<li id='indicator'></li>"),
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
      $('.case-nav').append($('#introduction'));
    });
    var windw = this;
  }

  // Sticky Function
  $.fn.followTo = function () {
    var overlay = $('#project-fixed-overlay'),
      container = $('#content'),
      windowHeight = $(window).height();
    var st, direction, lastdirection;
    var lastDir;
    var lastScrollTop = 0;
    $(window).scroll(function (event) {
      st = $(this).scrollTop();
    });

    // If overlay is bigger than container, set to height of overlay
    if (overlay.height() > container.height()) {
      $('.project--standard').css('min-height', overlay.height());
    }

    $(windw).scroll(function (e) {
      var scroll = $(window).scrollTop();
      var bottomScroll = scroll + windowHeight,
        containerTop = container.offset().top,
        bottomhit = containerTop + container.height() + (windowHeight - overlay.height());
        // overlayTop = Math.round(overlay.offset().top),
        // overlayBottom = overlayTop + Math.round(overlay.height());

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
        .css('top', $('.active').position().top);

      if (overlay.height() < windowHeight) {
        console.log("Running");
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
};
