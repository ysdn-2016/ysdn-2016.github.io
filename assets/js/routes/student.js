
module.exports = function () {

  configureGrid();

  $('.student-profile').mousemove(function (e) {
    parallax(e, $('.shape-1-wrapper'), 0.15);
    parallax(e, $('.shape-2-wrapper'), 0.3);
    parallax(e, $('.shape-3-wrapper'), 0.1);
    parallax(e, $('.shape-4-wrapper'), -0.3);
    parallax(e, $('.shape-5-wrapper'), -0.1);
  });

  function parallax (e, target, layer) {
    var layer_coeff = 10 / layer;
    var x = (e.pageX / 3) / layer_coeff;
    var y = (e.pageY / 2) / layer_coeff;
    $(target).css("transform", "translateX(" + x + "px) translateY(" + y + "px)");
  }
};


function configureGrid () {

  if (!document.querySelector('[data-columns]')) return;

  var config = {
    container: '[data-columns]',
    items: '[data-columns] .student-profile-project',
    columnClass: 'column',
    mediaQueries: [
      { query: 'screen and (min-width: 1px)', columns: 2 }
    ]
  }

  var grid = new Quartz(config)
}
