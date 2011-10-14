/**
 * @name PrivacyInfo
 * @class Contains reference to a party's ad privacy information.
 * @description Contains reference to a party's ad privacy information.
 * 
 * @see AdPlayer#addPrivacyInfo
 * 
 * @author christopher.sancho@adtech.com
 * 
 * @example
 * var myPrivacyInfo = new PrivacyInfo();
 * myPrivacyInfo.adServer = "MyAdServer";
 * myPrivacyInfo.message = "This is my privacy message.";
 * myPrivacyInfo.url = "http://adplayer.aboutthisad.com";
 */
var PrivacyInfo = (function () {
  /** @private */ var _this = {};
  
  /**
   * @name PrivacyInfo#adServer
   * @description Ad server name.
   * @type String
   */
  _this.adServer = '';
  
  /**
   * @name PrivacyInfo#message
   * @description Privacy information message. 
   * @type String
   */
  _this.message = '';
   
  /**
   * @name PrivacyInfo#url
   * @description Click-through url of privacy page.
   * @type String - URL
   */
  _this.url = '';
  
  /**
   * @name PrivacyInfo#urlText
   * @description Text for click-through url of privacy page.
   * @type String
   */
  _this.urlText = '';  
   
  return _this;
});