module.exports = function () {
  savvior.init('[data-columns]', {
    'screen and (min-width: 1px)': { columns: 2 }
  });

  $('.student-profile').mousemove(function (e) {
    parallax(e, $('.shape-1-wrapper'), 0.6);
    parallax(e, $('.shape-2-wrapper'), 1.2);
    parallax(e, $('.shape-3-wrapper'), 0.4);
    parallax(e, $('.shape-4-wrapper'), -0.8);
    parallax(e, $('.shape-5-wrapper'), -0.4);
  });

function parallax (e, target, layer) {
  var layer_coeff = 10 / layer;
  var x = (e.pageX / 3) / layer_coeff;
  var y = (e.pageY / 2) / layer_coeff;
  $(target).css("transform", "translateX(" + x + "px) translateY(" + y + "px)");
}
};
