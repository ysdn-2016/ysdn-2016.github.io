
var Instafeed = require('instafeed.js');
var stripHashtags = require('../lib/helpers/strip-hashtags');
var truncate = require('../lib/helpers/truncate');
var deck = require('deck')

var GRID_PROJECT_COUNT = 3

var PIXEL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

var TEMPLATE_PIXEL = /\{\{\s*pixel\s*\}\}/g
var TEMPLATE_HREF = /\{\{\s*project\.href\s*\}\}/g
var TEMPLATE_TITLE = /\{\{\s*project\.title\s*\}\}/g
var TEMPLATE_THUMBNAIL_WIDTH = /\{\{\s*project\.thumbnail\.width\s*\}\}/g
var TEMPLATE_THUMBNAIL_HEIGHT = /\{\{\s*project\.thumbnail\.height\s*\}\}/g
var TEMPLATE_THUMBNAIL_400 = /\{\{\s*project\.thumbnail\.asset400\s*\}\}/g
var TEMPLATE_THUMBNAIL_800 = /\{\{\s*project\.thumbnail\.asset800\s*\}\}/g
var TEMPLATE_OWNER_NAME = /\{\{\s*project\.owner\.name\s*\}\}/g
var TEMPLATE_OWNER_HREF = /\{\{\s*project\.owner\.href\s*\}\}/g

module.exports = function () {

  var $header = $('.header');
  var $grids = $('[data-columns]');
  var $projects = $('.project-preview');

  var template = $('template#project-preview-template').html();
  var instagramItemCount = 0

  var feedOptions = {
    clientId: '467ede5a6b9b48ae8e03f4e2582aeeb3',
    userId: '2228340350',
    sortBy: 'most-recent',
    template: require('../templates/instagram.html'),
    limit: 8
  };

  if (window.PROJECTS.length) {
    $grids.each(function (i, el) {
      var $grid = $(el);
      var discipline = el.dataset.columns;
      var projects = PROJECTS.filter(function (p) { return p.discipline === discipline });
      var picks = shuffle(projects).slice(0, GRID_PROJECT_COUNT);
      $grid.empty();
      picks.forEach(function (project) {
        $grid.append(generateProjectPreview(project))
      });
      $grid.addClass('loaded');
    })
  }

  var grids = $grids.map(function (i, el) {
    return new Quartz(getGridConfig(el))
  }).get();

  instagramFeed('home-insta');

  $(document).on('mouseenter', '.project-preview-title', projectMouseEnter);
  $(document).on('mouseleave', '.project-preview-title', projectMouseLeave);
  $(document).on('mouseenter', '.project-preview-image', projectMouseEnter);
  $(document).on('mouseleave', '.project-preview-image', projectMouseLeave);

  function projectMouseEnter (e) {
    $(this).parents('.project-preview').addClass('hover');
  }

  function projectMouseLeave (e) {
    $(this).parents('.project-preview').removeClass('hover');
  }

  /**
  * Intro Functions
  **/
  $('.home-post-intro').on('animationstart webkitAnimationStart msAnimationStart', function (e) {
    if (e.originalEvent.animationName !== 'fade-in') return;
    $header.removeClass('header--white')
  })

  /**
   * Helper functions
   */

  function instagramFeed (el) {
    var feed = new Instafeed({
      accessToken: '5139102.1677ed0.e96631b309c2454493762538cccb4e1d',
      target: el,
      sort: feedOptions.sortBy,
      limit: feedOptions.limit * 2,
      get: 'user',
      resolution: 'standard_resolution',
      userId: feedOptions.userId,
      template: feedOptions.template,
      filter: function (item) {
        if (item.type !== 'image') return false;
        if (instagramItemCount >= feedOptions.limit) return false;
        // HACK: we adjust the captions in filter function 🙈
        item.caption.text = stripHashtags(item.caption.text);
        item.caption.text = truncate(item.caption.text, 200);
        instagramItemCount++
        return true
      },
    });
    feed.run();
    return feed;
  }

  function generateProjectPreview (project) {
    // HACK: this mess
    var rendered = template
      .replace(TEMPLATE_PIXEL, PIXEL)
      .replace(TEMPLATE_HREF, project.href)
      .replace(TEMPLATE_TITLE, project.title)
      .replace(TEMPLATE_THUMBNAIL_WIDTH, project.thumbnail.width)
      .replace(TEMPLATE_THUMBNAIL_HEIGHT, project.thumbnail.height)
      .replace(TEMPLATE_THUMBNAIL_400, project.thumbnail.asset400)
      .replace(TEMPLATE_THUMBNAIL_800, project.thumbnail.asset800)
      .replace(TEMPLATE_OWNER_NAME, project.owner.name)
      .replace(TEMPLATE_OWNER_HREF, project.owner.href)
    return rendered
  }
};

function getGridConfig (el) {
  var category = el.dataset.columns
  var className = '[data-columns="' + category + '"]'
  return {
    container: className,
    items: className + ' .project-preview',
    columnClass: 'column',
    mediaQueries: [
      { query: 'screen and (min-width: 1px)', columns: 2 }
    ]
  }
}

function shuffle (arr) {
  var obj = {}
  arr.forEach(function (p) {
    obj[p.id] = parseFloat(p.weight, 10) || 2.5;
  })
  var results = deck.shuffle(obj);
  return results.map(function (id) {
    return arr.filter(function (p) {
      return p.id === id
    })[0]
  })
}
