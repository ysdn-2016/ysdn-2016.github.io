module.exports = function () {
	$('.home').mousemove(function (e) {
		// parallax(e, $('.logo').get(0), .11);
  //   parallax(e, $('.shape-1').get(0), .11);
  //   parallax(e, $('.shape-2').get(0), .2);
  //   parallax(e, $('.shape-3').get(0), .3);
  //   parallax(e, $('.shape-4').get(0), .4);
  //   parallax(e, $('.shape-5').get(0), .1);
  //   parallax(e, $('.shape-6').get(0), .2);
  //   parallax(e, $('.shape-7').get(0), .15);
  //   parallax(e, $('.shape-8').get(0), .1);
  //   parallax(e, $('.shape-9').get(0), .2);
  //   parallax(e, $('.shape-10').get(0), .15);
 	// 	parallax(e, $('.shape-11').get(0), .35);
  });

  function parallax (e, target, layer) {
    var layer_coeff = 10 / layer;
    var x = (e.pageX - ($(window).width() / 2)) / layer_coeff;
    var y = (e.pageY - ($(window).height() / 2)) / layer_coeff;
    var rot = $(target).css("transform");
    $(target).css("transform", "translateY("+ y +"px) translateX("+ x +"px)");
  }
};
