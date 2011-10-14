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
* var pixelRequest = new URLRequest('http://my.pixel-url.com');
* pixelRequest.load();
* 
* // Alternate
* var pixelRequest2 = new URLRequest();
* pixelRequest2.url = 'http://my.pixel-url.com';
* pixelRequest2.load();
*/
var URLRequest = (function (url) {
  /** @private */ var _this = {};
  
  /** @property {string} The URL of the pixel to request. */
  _this.url;
  if (url) { _this.url = url; }

  /**
   * @name URLRequest#load
   * @function
   * @description Requests a pixel using the <code>url</code> property. 
   */
   _this.load = function() {
    if(_this.url) {
      var urlImgReq = document.createElement('img');
      urlImgReq.src = (_this.url);
      urlImgReq.style.display = 'none';
      var t = document.getElementsByTagName('script')[0];
      log(_this.url, 'URLRequest');
      t.parentNode.insertBefore(urlImgReq, t);

      t.parentNode.removeChild(urlImgReq); // clear
      delete urlImgReq;
      delete t;
    } else {
      log('URLRequest', 'Parameter "url" is not defined.');
    }
  };
  
  return _this;
});