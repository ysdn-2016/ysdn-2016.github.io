
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
      $students.show();
      $shapes.show();
      $intermissions.show();
      $footer.show();
      $noResults.addClass('hidden');
      $typeahead.text('');
      prompt = '';
      autosize();
      return;
    }

    var matches = fuse.search(predicate);
    var count = matches.length;

    $students.hide();
    $intermissions.hide();
    $shapes.hide();
    $footer.hide();

    matches.forEach(function (match) {
      match.item.$el.show();
    });

    Lazyload.check();

    if (matches.length < MINIMUM_MATCHES) {
      $noResultsPrompt.text('Not who');
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
