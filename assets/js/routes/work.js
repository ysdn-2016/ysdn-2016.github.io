var $ = require('cash-dom');
var shuffle = require('../lib/shuffle');

module.exports = function () {
  var grid = shuffle(document.querySelector('[data-columns]'));
  var $grid = $('.project-grid');
  var $projects = $('.project-preview');

  savvior.init('[data-columns]', {
    'screen and (max-width: 800px)': { columns: 2 },
    'screen and (min-width: 800px)': { columns: 3 },
  });

  $projects.on('mouseenter', projectMouseEnter);
  $projects.on('mouseleave', projectMouseLeave);

  function projectMouseEnter (e) {
    $(this).addClass('hover');
  }

  function projectMouseLeave (e) {
    $(this).removeClass('hover');
  }
};
