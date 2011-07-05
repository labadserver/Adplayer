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
function URLRequest(url) {
  /** @property {string} The URL of the pixel to request. */
  this.url;
  if (url) { this.url = url; }

  /**
   * @description Requests a pixel using the <code>url</code> property. 
   */
  this.load = function() {
    if(this.url) {
      var urlImgReq = document.createElement('img');
      urlImgReq.src = (this.url);
      urlImgReq.style.display = 'none';
      var t = document.getElementsByTagName('script')[0];
      log(this.url, 'URLRequest');
      t.parentNode.insertBefore(urlImgReq, t);

      t.parentNode.removeChild(urlImgReq); // clear
      delete urlImgReq;
      delete t;
    } else {
      log('URLRequest', 'Parameter "url" is not defined.');
    }
  };
}