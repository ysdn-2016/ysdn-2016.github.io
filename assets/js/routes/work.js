var $ = require('cash-dom');
var shuffle = require('../lib/shuffle');

module.exports = function () {
  var grid = shuffle(document.querySelector('[data-columns]'));
  var $grid = $('.project-grid');
  var $projects = $('.project-preview');

  var config = {
    container: '[data-columns]',
    items: '.project-preview',
    columnClass: 'column',
    mediaQueries: [
      { query: 'screen and (max-width: 800px)', columns: 2 },
      { query: 'screen and (min-width: 800px)', columns: 3 },
    ]
  }

  var grid = new Quartz(config)

  $(document).on('mouseenter', '.project-preview', projectMouseEnter);
  $(document).on('mouseleave', '.project-preview', projectMouseLeave);

  function projectMouseEnter (e) {
    $(this).addClass('hover');
  }

  function projectMouseLeave (e) {
    $(this).removeClass('hover');
  }
};
