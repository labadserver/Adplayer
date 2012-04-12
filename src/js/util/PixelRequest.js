/**
* @class Responsible for handling the loading and referencing of a pixel request.
* @description Responsible for handling the loading and referencing of a pixel request.
* @author christopher.sancho@adtech.com
* @param {string} url Optional - URL of the pixel to request.
* @property {string} url URL of the pixel to request.
* @example
* var pixelRequest = new $ADP.PixelRequest('http://my.pixel-url.com');
* pixelRequest.load();
* 
* // Alternate
* var pixelRequest2 = new $ADP.PixelRequest();
* pixelRequest2.url = 'http://my.pixel-url.com';
* pixelRequest2.load();
*/
$ADP.PixelRequest = (function (url) {
  /** @private */ var _this = {};
  
  /** @property {string} The URL of the pixel to request. */
  _this.url;
  if (url) { _this.url = url; }

  /**
   * @name $ADP.PixelRequest#load
   * @function
   * @description Requests a pixel using the <code>url</code> property.
   */
   _this.load = function() {
    if(_this.url) {
      var urlImgReq = new Image();
      urlImgReq.src = _this.url;
      $ADP.Util.log(_this.url, '$ADP.PixelRequest');
    } else {
      $ADP.Util.log('$ADP.PixelRequest', 'Parameter "url" is not defined.');
    }
  };
  
  return _this;
});