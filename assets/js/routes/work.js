var shuffle = require('../lib/shuffle');

var PROJECT_CLASS = '.project-preview'

module.exports = function () {
  shuffle(document.querySelector('[data-columns]'));

  var $document = $(document);
  var $projects = $(PROJECT_CLASS);
  var $categoryLinks = $('.project-nav-category');

  var config = {
    container: '[data-columns]',
    items: PROJECT_CLASS,
    columnClass: 'column',
    mediaQueries: [
      { query: 'screen and (max-width: 800px)', columns: 2 },
      { query: 'screen and (min-width: 800px)', columns: 3 },
    ]
  }

  var grid = new Quartz(config)


  $categoryLinks.on('click', categoryLinkClick);
  $(document).on('mouseenter', '.project-preview-title', projectMouseEnter);
  $(document).on('mouseleave', '.project-preview-title', projectMouseLeave);
  $(document).on('mouseenter', '.project-preview-image', projectMouseEnter);
  $(document).on('mouseleave', '.project-preview-image', projectMouseLeave);

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
    grid.update();
  }
};
