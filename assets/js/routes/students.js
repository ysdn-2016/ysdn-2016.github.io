
var Fuse = require('fuse.js');
var Lazyload = require('../lib/lazyload');
var autosize = require('autosize-input');

var notFalse = function (x) { return !!x };

module.exports = function () {
  var $grid = $('.student-grid');
  var $search = $('.student-search-input');
  var $shapes = $('.student-grid-shape-container');
  var $intermissions = $('.student-grid-intermission');

  // NOTE: this implementation assumes these three variables all have the
  // same indicies
  var $students = $('.student-preview');
  var students = $students.map(toStudentObject).get();

  autosize($search.get(0))

  var fuse = new Fuse(students, {
    keys: ['name', 'categories'],
    distance: 15,
    threshold: 0.1
  });

  $search.on('input change', update);

  /**
   * Event Handlers
   */

  function update () {
    var predicate = $search.val();

    if (!predicate.length) {
      $students.show();
      $shapes.show();
      $intermissions.show();
      return
    }

    var matches = fuse.search(predicate);
    var count = matches.length

    $students.hide();
    $intermissions.hide();
    $shapes.hide();

    matches.forEach(function (student) {
      student.$el.show();
    })

    Lazyload.check();
  }

};

function toStudentObject (i, el) {
  var $el = $(el)
  return {
    index: i,
    $el: $el,
    name: $el.data('name').split(' '),
    categories: $el.data('categories').split(',')
  }
}
