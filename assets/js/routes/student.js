module.exports = function () {
  savvior.init('[data-columns]', {
    'screen and (min-width: 1px)': { columns: 2 }
  });

  // $('.main').mousemove(function (e) {
  //   // parallax(e, document.getElementById('student-image'), 0.1);
  //   parallax(e, $('.student-shapes').get(0), 0.4);
  // });

// function parallax (e, target, layer) {
//   var layer_coeff = 10 / layer;
//   var x = ($(window).width() - target.offsetWidth) / 2 - (e.pageX - ($(window).width() / 2)) / layer_coeff;
//   var y = (e.pageY - ($(window).height() / 2)) / layer_coeff;
//   $(target).offset({ top: 80 + y, left: 240 + x });
// }
};
