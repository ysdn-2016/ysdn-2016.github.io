module.exports = function () {
  // Grid + List toggle
  $('#grid-view-target').on('click', function () {
    $('.grid-view').addClass('active');
    $('.list-view').removeClass('active');
    $('.student-grid').show();
    $('.student-list').hide();
    return false;
  });

  $('#list-view-target').on('click', function () {
    $('.list-view').addClass('active');
    $('.grid-view').removeClass('active');
    $('.student-list').show();
    $('.student-grid').hide();
    return false;
  });

  // Category filtering logic
  $('.category-target').on('click', function () {
    $('.category-target').removeClass('active');
    $(this).addClass('active');
    $('.student').show(); // Reset any filtered rows
    return false;
  });

  $('.category-com-target').on('click', function () {
    $('.student').not('.communication').hide();
  });
};
