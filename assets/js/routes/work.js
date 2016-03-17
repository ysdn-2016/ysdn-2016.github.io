
var shuffle = require('../lib/shuffle');

module.exports = function () {

	var grid = shuffle(document.querySelector('[data-columns]'))

	savvior.init('[data-columns]', {
    'screen and (max-width: 800px)': { columns: 2 },
    'screen and (min-width: 800px)': { columns: 3 },
  });

};
