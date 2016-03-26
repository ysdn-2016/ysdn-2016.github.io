
var Fuse = require('fuse.js');
var Lazyload = require('../lib/lazyload');
var htmlEscape = require('../lib/helpers/html-escape');
var splitName = require('../lib/helpers/split-name');

var ANIMATION_END = 'webkitAnimationEnd oanimationend msAnimationEnd animationend'
var NON_ALPHABETIC = /[^A-Za-z,\s\-]/g

var notFalse = function (x) { return !!x };
var lastChar = function (str) { return str.charAt(str.length - 1) };

module.exports = function () {
  var $window = $(window);
  var $grid = $('.student-grid');
  var $search = $('.student-search-input');
  var $typeahead = $('.student-search-typeahead');
  var $shapes = $('.student-grid-shape-container');
  var $intermissions = $('.student-grid-intermission');
  var $students = $('.student-preview');

  var students = $students.map(toStudentObject).get();
  var fuse = new Fuse(students, {
    keys: [
      { name: 'name', weight: 0.7 },
      { name: 'invertedName', weight: 0.5 },
      { name: 'firstName', weight: 0.2 },
      { name: 'lastName', weight: 0.2 },
      // { name: 'categories', weight: 0.1 }
    ],
    distance: 0,
    threshold: 0.1
  });
  var prompt = '';

  /**
   * Register Events
   */

  $search.on('input change', update);
  $search.on('keyup', keyUp);
  $students.on('mouseenter', mouseEnter);
  $students.on('mouseleave', mouseLeave);

  $search.autosize({ typeahead: $typeahead });

  /**
   * Event Handlers
   */

  function update () {
    var predicate = $search.val();

    if (NON_ALPHABETIC.test(predicate)) {
      predicate = predicate.replace(NON_ALPHABETIC, '');
      $search.val(predicate);
    }

    if (!predicate.length) {
      $students.show();
      $shapes.show();
      $intermissions.show();
      $typeahead.text('');
      return;
    }

    var matches = fuse.search(predicate);
    var count = matches.length;

    $students.hide();
    $intermissions.hide();
    $shapes.hide();

    matches.forEach(function (student) {
      student.$el.show();
    });

    Lazyload.check();

    if (!matches.length) {
      prompt = ''
      $typeahead.text('');
      return;
    }

    var match = matches[0];
    var name = match.name
    var searchingLastName = match.firstName.toLowerCase().indexOf(predicate.toLowerCase()) !== 0
    prompt = searchingLastName
      ? formatInvertedName(match.firstName, match.lastName)
      : name;

    var index = prompt.toLowerCase().indexOf(lastChar(predicate.toLowerCase())) + 1;
    var typed = prompt.substring(0, index);
    var ahead = prompt.substring(index);

    var html = wrap(typed) + ahead;
    $typeahead.html(html);
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
      // ENTER
      case 13:
        $search.val(prompt);
        update();
        break;
      case 27:
        $search.val('');
        update();
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
