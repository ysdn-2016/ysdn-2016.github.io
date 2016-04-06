
var Fuse = require('fuse.js');
var shuffle = require('../lib/shuffle');
var Lazyload = require('../lib/lazyload');

var MINIMUM_MATCHES = 2;

module.exports = function () {
  shuffle(document.querySelector('[data-columns]'));

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
