
module.exports = function () {

console.log("Running");
var windw = this;
$.fn.followTo = function() {
    var $this = this,
        $window = $(windw);
    var lastScrollTop = 0;
    var scroll;
    var lastdownposition, lastupposition;
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
        var bTop = $('#project-fixed-overlay').offset().top;
        var containerBottom = bHeight + bTop;
        var holdtop = bTop;
        var spaceAtBottom = wHeight - bHeight;
        var bBottom = 140 + (cHeight + spaceAtBottom);
        var direction;
        

        if (wHeight < bHeight) {
            var st = $(this).scrollTop();
            
            if (st > lastScrollTop) {
              direction = 'down';
              lastScrollTop = st;
              lastdownposition = bTop;
            } else {
              $('#project-fixed-overlay').removeClass();
              direction = 'up';
              lastScrollTop = st;
              lastupposition = bTop;
            }

            //Find out if the current view is wihtin content bounds (top & bottom)
            if ((scroll > 140) && (bottomScroll < (140 + cHeight))){
              //Within Bounds
              console.log("withinBounds");
              if (direction == 'up'){
                console.log("up");
                if (scroll <= bTop){
                  console.log("Stick to top");
                  $('#project-fixed-overlay').attr('class', 'sticktop');
                } else {
                  $('#project-fixed-overlay').attr('class', 'stuck');
                  $('#project-fixed-overlay').css({
                      position: 'absolute', top: (lastupposition - 140)
                  });
                }
              } else if (direction == 'down'){
                console.log("down");
                if (bottomScroll >= (bTop + bHeight)){
                  console.log("Hit bottom of box");
                  $('#project-fixed-overlay').attr('class', 'stickbottom');
                } else {
                  $('#project-fixed-overlay').attr('class', 'stuck');
                  $('#project-fixed-overlay').css({
                      position: 'absolute', top: (lastdownposition - 140)
                  });
                }
              }
            } else {
              //Outside of Bounds
              console.log("outsideBounds");
              if (scroll < 140) {
                $('#project-fixed-overlay').attr('class', 'sticktopwindow');
              } else if (bottomScroll > (140 + cHeight)) {
                $('#project-fixed-overlay').attr('class', 'stickbottomwindow');
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
