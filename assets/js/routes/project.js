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
    var windw = this;
  }

  // Sticky Function
  $.fn.followTo = function () {
    var overlay = $('#project-fixed-overlay'),
      container = $('#content'),
      windowHeight = $(window).height();

    $(windw).scroll(function (e) {
      var scroll = $(window).scrollTop();
      var bottomScroll = scroll + windowHeight,
        containerTop = container.offset().top,
        bottomhit = containerTop + container.height() + (windowHeight - overlay.height());

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

    });
  };
  $('#project-fixed-overlay').followTo();

  $(document).ready(function () {
    var getMax = function () {
      return $(document).height() - $(window).height();
    };

    var getValue = function () {
      return $(window).scrollTop();
    };

    if ('max' in document.createElement('progress')) {
      // Browser supports progress element
      var progressBar = $('progress');

      // Set the Max attr for the first time
      progressBar.attr({ max: getMax() });

      $(document).on('scroll', function () {
        // On scroll only Value attr needs to be calculated
        progressBar.attr({ value: getValue() });
      });

      $(window).resize(function () {
        // On resize, both Max/Value attr needs to be calculated
        progressBar.attr({ max: getMax(), value: getValue() });
      });
    } else {
      var progressBar = $('.progress-bar'),
        max = getMax(),
        value, width;

      var getWidth = function () {
        // Calculate width in percentage
        value = getValue();
        width = (value / max) * 100;
        width = width + '%';
        return width;
      };

      var setWidth = function () {
        progressBar.css({ width: getWidth() });
      };

      $(document).on('scroll', setWidth);
      $(window).on('resize', function () {
        // Need to reset the Max attr
        max = getMax();
        setWidth();
      });
    }
  });
};
