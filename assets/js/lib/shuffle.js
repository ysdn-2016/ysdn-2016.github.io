
var deck = require('deck');

module.exports = function (el) {
  var children = toArray(el.children);
  var elements = toIdElementMap(children);
  var shuffled = deck.shuffle(toDeck(children));
  shuffled.forEach(function (id) {
    el.appendChild(elements[id].el)
  })
  return el;
};

function toArray (obj) {
  return [].slice.call(obj)
}

function toIdElementMap (arr) {
  return arr.map(function (el) {
    return {
      id: el.dataset.id,
      el: el
    }
  })
}

function toDeck (arr) {
  var obj = {}
  arr.forEach(function (el, i) {
    obj[i] = parseFloat(el.dataset.weight, 10);
  })
  return obj
}
