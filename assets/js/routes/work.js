
module.exports = function () {
	var $grid = $('.project-grid')
console.log("HEY");
var windw = this;
$.fn.followTo = function() {
    var $this = this,
        $window = $(windw);
    var lastScrollTop = 0;
    var scroll;
    $(window).scroll(function(event) {
        scroll = $(window).scrollTop();
    });

    $window.scroll(function(e) {
        var myBox = $('#project-fixed-overlay');
        var myContent = $('#content'),
            bHeight = myBox.height(),
            wHeight = $(window).height(),
            cHeight = myContent.height();

        var bottomScroll = scroll + wHeight;
        var containerBottom = 140 + bHeight;
        var bTop = $('#project-fixed-overlay').offset().top;
        var holdtop = bTop;
        var spaceAtBottom = wHeight - bHeight;
        var bBottom = 140 + (cHeight + spaceAtBottom);
        var direction;
        
        
        console.log(containerBottom);
        console.log(bottomScroll);

        if (wHeight < bHeight) {
            var st = $(this).scrollTop();
            if (st > lastScrollTop) {
              direction = 'down';
              // downscroll code
              lastScrollTop = st;
            } else {
              $('#project-fixed-overlay').removeClass();
              direction = 'up';
              lastScrollTop = st;
            }
            console.log(direction);
            if (direction === 'down'){
              if (bottomScroll > containerBottom) {
                  //if you get to bottom of f window
                  $('#project-fixed-overlay').attr('class', 'stickbottom');
                  if ((140 + cHeight) <= bottomScroll) {
                      //if you scroll past bottom of content window
                      $('#project-fixed-overlay').attr('class', 'stickbottomwindow');
                  } else if (scroll < bTop) {
                      //if you reach top of f window
                      $('#project-fixed-overlay').attr('class', 'sticktop');
                  }
               }
             }
             else if (direction === 'up') {
                  if (scroll > 140) {
                      $('#project-fixed-overlay').attr('class', 'stickbottomwindow');
                      if (scroll <= bTop) {
                          $('#project-fixed-overlay').attr('class', 'sticktop');
                      }
                   }
                   if (scroll < 140) {
                      $('#project-fixed-overlay').attr('class', 'sticktopwindow');
                   }
            }
        }
        if (wHeight > bHeight) {
            if (scroll > 140) {
              //if scroll past top of content
                $('#project-fixed-overlay').attr('class', 'sticktop');
            } else if (scroll < 140) {
                $('#project-fixed-overlay').attr('class', 'sticktopwindow');
            }
            if (bBottom < bottomScroll) {
              //if scroll past bottom of content
                $('#project-fixed-overlay').attr('class', 'stickbottomwindow');
            }
        }
    });
};

$('#project-fixed-overlay').followTo();
}
