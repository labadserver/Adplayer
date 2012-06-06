/**
 * @name $ADP.PrivacyInfo
 * @class
 * @description The <code>$ADP.PrivacyInfo</code> class.
 *
 * @param {object}  args           The Arguments.
 * @param {string}  args.title     The title of the privacy information.
 * @param {string}  args.text      The detailed information of the privacy information.
 * @param {string}  args.url       The call-to-action URL for opting.
 * @param {array}   args.linkText  The URL's text representation.
 * @param {boolean} args.usePopup  default is layer and if set then popup should be used
 *
 * @example
 * TODO
 */
$ADP.PrivacyInfo = function (args) {
	return this instanceof $ADP.PrivacyInfo ? this.init(args) : new $ADP.PrivacyInfo(args);
}

$ADP.PrivacyInfo.prototype = {

    /**
     * @private
     * @name $ADP.PrivacyInfo#init
     * @function
     * @description Class constructor.
     */
    init: function (args) {
      this.valid = args.title || args.text || args.linkText ? true : false;
      this.title = args.title;
      this.text = args.text;
      this.url = args.url;
      this.linkText = args.linkText;
      this.usePopup = !!args.usePopup;
    },

    /**
     * @name $ADP.PrivacyInfo#getTitle
     * @function
     * @description Returns the title of the privacy information.
     * 
     * @return {string} The privacy information title. 
     */
    getTitle: function () {
      return this.title;
    },

    /**
     * @name $ADP.PrivacyInfo#getText
     * @function
     * @description Returns the privacy information's detailed information. 
     * 
     * @return {string} The privacy information's detailed information. 
     */
    getText: function () {
      return this.text;
    },

    /**
     * @name $ADP.PrivacyInfo#getURL
     * @function
     * @description Returns the privacy information's call-to-action URL.
     * 
     * @return {string} The privacy information's call-to-action URL. 
     */
    getURL: function () {
      return this.url;
    },

    /**
     * @name $ADP.PrivacyInfo#getLinkText
     * @function
     * @description Returns the URL's text representation.
     * 
     * @return {string} The URL's text representation. 
     */
    getLinkText: function () {
      return this.linkText;
    },

    /**
     * @name $ADP.PrivacyInfo#isValid
     * @function
     * @description Determines whether a title, text, or linkText has been defined.
     * @return {boolean} <code>true</code> / <code>false</code>
     */
    isValid: function () {
      return this.valid ? true : false;
    },
    
    /**
     * @name $ADP.PrivacyInfo#usePopup
     * @function
     * @description returns whether privacy items should be rendered in popup
     * @returns {boolean} 
     */ 
     usePopup: function () {
       return this.usePopup ? true : false;
     },
     
    /**
     * @name $ADP.PrivacyInfo#render
     * @function
     * @description Returns a HTML string representation of the privacy information.
     * 
     * @return {string} HTML wrapped string representation containing privacy information.
     * 
     * @example
     * // returns string
     * AdServer&lt;br/&gt;Opt-opt out of this ad server.&lt;br/&gt;&lt;a href=&quot;http://calltoaction.url&quot; target=&quot;_blank&quot;&gt;Opt Out&lt;/a&gt;
     */
    render: function () {
      var title = $ADP.Util.safeString(this.getTitle());
      var text = $ADP.Util.safeString(this.getText());
      var linkText = $ADP.Util.safeString(this.getLinkText());
      var url = $ADP.Util.safeString(this.getURL());
      var s = '';
      if (linkText) s += linkText;
      if (url) s = '<a href="' + url + '" target="_blank">' + s + '</a>';
      if (s) s += '<br />';
      if (text) s = text + '<br />' + s;
      if (title) s = title + '<br />' + s;
      return s;
    }

};

