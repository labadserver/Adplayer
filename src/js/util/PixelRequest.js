/**
* @class Responsible for handling the loading and referencing of a URL request.
* @description A pixel is requested by dynamically generating an <code>img</code>
*              element, which is appended to the document.  After appending is complete,
*              the <code>img</code> element is cleared from the document.
* 
* @author christopher.sancho@adtech.com
* 
* @param {string} url Optional - URL of the pixel to request.
* @property {string} url URL of the pixel to request.
* 
* @example
* var pixelRequest = new PixelRequest('http://my.pixel-url.com');
* pixelRequest.load();
* 
* // Alternate
* var pixelRequest2 = new PixelRequest();
* pixelRequest2.url = 'http://my.pixel-url.com';
* pixelRequest2.load();
*/
var PixelRequest = (function (url) {
  /** @private */ var _this = {};
  
  /** @property {string} The URL of the pixel to request. */
  _this.url;
  if (url) { _this.url = url; }

  /**
   * @name PixelRequest#load
   * @function
   * @description Requests a pixel using the <code>url</code> property. 
   */
   _this.load = function() {
    if(_this.url) {
      var urlImgReq = new Image();
      urlImgReq.src = _this.url;
      Util.log(_this.url, 'PixelRequest');
    } else {
      Util.log('PixelRequest', 'Parameter "url" is not defined.');
    }
  };
  
  return _this;
});