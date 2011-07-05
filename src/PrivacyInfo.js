/**
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
function PrivacyInfo() {
  /**
   * @description Ad server name.
   * @type String
   */
  this.adServer = '';
  
   /**
    * @description Privacy information message. 
    * @type String
    */
   this.message = '';
   
   /**
    * @description Click-through url of privacy page.
    * @type String - URL
    */
   this.url = '';   
}