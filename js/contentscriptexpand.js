

/**
 * Adds a style element with the given CSS
 * @param {!Element} oldElem The element to replace.
 * @param {string} css The CSS requested from the link tag.
 * 
 *
gdocscse.ContentScriptExpand.prototype.replaceWithCssStyle_ =
    function(oldElem, css) {
  var cssEl = document.createElement('style');
  cssEl.innerHTML = css;
  oldElem.parentNode.replaceChild(cssEl, oldElem);
};*/

var gdocscse = gdocscse || {};


/**
 * Content Script to expand CSS style links for saving as HTML.
 * @constructor
 */
gdocscse.ContentScriptExpand = function() {
  /**
   * Number of pending links to expand.
   * @type {number}
   * 
   */
  this.numPending_ = 0;
};

/**
 * Initializes this content script.
 */
var contentScriptExpand = new gdocscse.ContentScriptExpand();
contentScriptExpand.init();
chrome.extension.sendMessage(null, "hi");

