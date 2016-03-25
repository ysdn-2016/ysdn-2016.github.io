/* quartz-layout v0.1.11 - 2015-07-08T03:45:03.235Z - https://github.com/r-park/quartz */
!function(t,e){"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?module.exports=e():t.Quartz=e()}(this,function(){"use strict";function t(t){this.columnClass=t.columnClass,this.columnCount=t.columnCount,this.yIndices=[],this.container="string"==typeof t.container?i.querySelector(t.container):t.container,this.items=this.toArray("string"==typeof t.items?i.querySelectorAll(t.items):t.items),t.mediaQueries&&e.matchMedia?this.bindMediaQueries(t.mediaQueries):this.update(),this.initialized=!0}var e=window,i=document,n=Array.isArray;return t.prototype={append:function(t){"undefined"==typeof t.length&&(t=[t]);var e=this.columnCount,i=this.createColumnFragments(),n=this.container,s=this.getItemHeights(t),r=n.children;this.refreshYIndices(),this.distributeItemsToColumns(i,t,s);for(var o=0;e>o;o++)r[o].appendChild(i[o]);this.items=this.items.concat(this.toArray(t))},prepend:function(t){t=this.toArray(t);var e=this.createColumns(),i=this.getItemHeights(t),n=this.getExistingItemHeights(),s=i.concat(n);t=t.concat(this.items),this.resetYIndices(),this.clearContainer(),this.distributeItemsToColumns(e.childNodes,t,s),this.container.appendChild(e),this.items=t},remove:function(t){"undefined"==typeof t.length&&(t=[t]);for(var e,i=this.items,n=t.length;n--;)e=i.indexOf(t[n]),-1!==e&&i.splice(e,1);this.update()},removeAll:function(){this.items.length=0,this.update()},update:function(t){t&&(this.columnCount=t);var e,i=this.createColumns(),n=this.items;this.resetYIndices(),n.length?(e=this.initialized?this.getExistingItemHeights():this.getItemHeights(n),this.clearContainer(),this.distributeItemsToColumns(i.childNodes,n,e)):this.clearContainer(),this.container.appendChild(i)},clearContainer:function(){for(var t=this.container;t.firstChild;)t.removeChild(t.firstChild)},createColumnFragments:function(){for(var t=[],e=this.columnCount;e--;)t.push(i.createDocumentFragment());return t},createColumns:function(){for(var t,e=this.columnCount,n=this.columnClass,s=i.createDocumentFragment();e--;)t=i.createElement("div"),t.className=n,s.appendChild(t);return s},createTestColumn:function(){var t=this.container.firstChild,n=i.createElement("div");return n.className=this.columnClass,n.style.position="absolute",n.style.left="-10000px",n.style.top="-10000px",n.style.width=t&&t.className===this.columnClass?e.getComputedStyle(t).width:this.container.offsetWidth/this.columnCount+"px",n},distributeItemsToColumns:function(t,e,i){for(var n,s=e.length,r=this.yIndices,o=0;s>o;o++)n=this.getColumnIndex(),r[n]+=i[o],t[n].appendChild(e[o])},getColumnIndex:function(){var t=Math.min.apply(Math,this.yIndices);return this.yIndices.indexOf(t)},getExistingItemHeights:function(){var t=this.items,i=[];if(t.length)for(var n=e.getComputedStyle(t[0]),s=parseInt(n.marginBottom,10),r=0,o=t.length;o>r;r++)i.push(t[r].offsetHeight+s);return i},getItemHeights:function(t){var i=this.createTestColumn(),n=[],s=0,r=t.length;for(s;r>s;s++)i.appendChild(t[s]);this.container.appendChild(i);var o=e.getComputedStyle(t[0]),h=parseInt(o.marginBottom,10);for(s=0;r>s;s++)n.push(t[s].offsetHeight+h);return this.container.removeChild(i),n},refreshYIndices:function(){var t=this.container.children,e=t.length,i=this.yIndices;if(e){i.length=0;for(var n=0;e>n;n++)i.push(t[n].offsetHeight)}},resetYIndices:function(){var t=this.columnCount,e=this.yIndices;for(e.length=0;t--;)e.push(0)},toArray:function(t){if(n(t))return t;var e=t.length;if("number"==typeof e){for(var i=new Array(e);e--;)i[e]=t[e];return i}return[t]},bindMediaQueries:function(t){for(var i,n,s,r=!1,o=0,h=t.length;h>o;o++)i=t[o],n=e.matchMedia(i.query),s=this.bindToMediaQueryList(n,i,this),!r&&n.matches&&(r=!0,s(n))},bindToMediaQueryList:function(t,e,i){var n=function(t){t.matches&&i.update(e.columns)};return t.addListener(n),n}},t});