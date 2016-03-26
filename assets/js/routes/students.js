
var Fuse = require('fuse.js');
var Lazyload = require('../lib/lazyload');
var htmlEscape = require('../lib/helpers/html-escape');

var ANIMATION_END = 'webkitAnimationEnd oanimationend msAnimationEnd animationend'
var NON_ALPHABETIC = /[^A-Za-z,\s]/g

var notFalse = function (x) { return !!x };
var lastChar = function (str) { return str.charAt(str.length - 1) };

module.exports = function () {
  var $grid = $('.student-grid');
  var $search = $('.student-search-input');
  var $typeahead = $('.student-search-typeahead');
  var $shapes = $('.student-grid-shape-container');
  var $intermissions = $('.student-grid-intermission');

  // NOTE: this implementation assumes these three variables all have the
  // same indicies
  var $students = $('.student-preview');
  var students = $students.map(toStudentObject).get();

  var fuse = new Fuse(students, {
    keys: ['name', 'categories'],
    distance: 15,
    threshold: 0.10
  });

  $search.on('input change', update);
  $students.on('mouseenter', mouseEnter);
  $students.on('mouseleave', mouseLeave);
  $search.autosize({
    typeahead: $typeahead
  });

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
      $typeahead.text('');
      return;
    }

    var best = matches[0].name;
    var index = best.indexOf(lastChar(predicate)) + 1;
    var typed = best.substring(0, index);
    var ahead = best.substring(index);

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

  function stopRewind () {
    $(this).removeClass('student-preview--rewind');
  }
};

function wrap (str) {
  return '<span class="silent">' + htmlEscape(str) + '</span>';
}

function toStudentObject (i, el) {
  var $el = $(el);
  var name = $el.data('name');
  return {
    index: i,
    $el: $el,
    name: name,
    names: name.split(' '),
    categories: $el.data('categories').split(',')
  }
}
