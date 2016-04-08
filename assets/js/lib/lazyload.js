var Layzr = require('layzr.js');

var Lazyload = Layzr({
  normal: 'data-src',
  retina: 'data-retina-src',
  threshold: 200
});

Lazyload.on('src:before', function (image) {
  image.addEventListener('load', function () {
    image.setAttribute('lazyloaded', true);
  });
});

document.addEventListener('DOMContentLoaded', function () {
  Lazyload.update().check().handlers(true);
});

module.exports = Lazyload;
