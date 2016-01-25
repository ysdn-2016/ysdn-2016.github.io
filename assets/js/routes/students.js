
module.exports = function () {
	// Grid + List toggle
	$('#grid-view-target').on( "click", function(){
		$('.grid-view').addClass('active');
		$('.list-view').removeClass('active');
		$('.student-grid').show();
		$('.student-list').hide();
		return false;
	});

	$('#list-view-target').on( "click", function(){
		$('.list-view').addClass('active');
		$('.grid-view').removeClass('active');
		$('.student-list').show();
		$('.student-grid').hide();
		return false;
	});
}
