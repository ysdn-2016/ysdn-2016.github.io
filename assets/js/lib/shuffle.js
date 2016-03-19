/**
 * Reorders the children of an element via a Fisher-Yates shuffle.
 * @see http://stackoverflow.com/a/11972692/1266426
 */
module.exports = function (el) {
  for (var i = el.children.length; i >= 0; i--) {
    var int = Math.random() * i | 0;
    el.appendChild(el.children[int]);
  }
  return el;
};
