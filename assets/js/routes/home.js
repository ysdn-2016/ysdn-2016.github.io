module.exports = function () {
  var Instafeed = require('instafeed.js');
  var stripHashtags = require('../lib/helpers/strip-hashtags');
  var truncate = require('../lib/helpers/truncate');

  var feedOptions = {
    clientId: '467ede5a6b9b48ae8e03f4e2582aeeb3',
    userId: '2228340350',
    sortBy: 'most-recent',
    template: require('../templates/insta_home.html'),
    limit: 8
  };

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
    //  parallax(e, $('.shape-11').get(0), .35);
  });

  function instagramFeed (el) {
    var feed = new Instafeed({
      accessToken: '5139102.1677ed0.e96631b309c2454493762538cccb4e1d',
      target: el,
      sort: feedOptions.sortBy,
      limit: feedOptions.limit,
      get: 'user',
      resolution: 'standard_resolution',
      userId: feedOptions.userId,
      template: feedOptions.template,
      filter: function (item) {
        // HACK: we adjust the captions in filter function 🙈
        item.caption.text = stripHashtags(item.caption.text);
        item.caption.text = truncate(item.caption.text, 200);
        return item.type === 'image';
      },
    });
    feed.run();
    return feed;
  }

  instagramFeed('home-insta');

  function parallax (e, target, layer) {
    var layer_coeff = 10 / layer;
    var x = (e.pageX - ($(window).width() / 2)) / layer_coeff;
    var y = (e.pageY - ($(window).height() / 2)) / layer_coeff;
    var rot = $(target).css('transform');
    $(target).css('transform', 'translateY(' + y + 'px) translateX(' + x + 'px)');
  }
};
