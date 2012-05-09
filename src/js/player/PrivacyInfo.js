/**
 * @name $ADP.PrivacyInfo
 * @class
 * @description The <code>$ADP.PrivacyInfo</code> class.
 *
 * @example
 * TODO
 */
$ADP.PrivacyInfo = function (args) {
  var self = arguments.callee;
  if (!self.prototype.init) {

    /**
     * @private
     * @name $ADP.PrivacyInfo#init
     * @function
     * @description
     * @param args
     */
    self.prototype.init = function (args) {
      this.valid = args.title || args.text || args.linkText ? true : false;
      this.title = args.title;
      this.text = args.text;
      this.url = args.url;
      this.linkText = args.linkText;
    };

    /**
     * @name $ADP.PrivacyInfo#getTitle
     * @function
     * @description
     * @return  
     */
    self.prototype.getTitle = function () {
      return this.title;
    };

    /**
     * @name $ADP.PrivacyInfo#getTitle
     * @function
     * @description
     * @return  
     */
    self.prototype.getText = function () {
      return this.text;
    };

    /**
     * @name $ADP.PrivacyInfo#getURL
     * @function
     * @description
     * @return  
     */
    self.prototype.getURL = function () {
      return this.url;
    };

    /**
     * @name $ADP.PrivacyInfo#getLinkText
     * @function
     * @description
     * @return  
     */
    self.prototype.getLinkText = function () {
      return this.linkText;
    };

    /**
     * @name $ADP.PrivacyInfo#isValid
     * @function
     * @description
     * @return  
     */
    self.prototype.isValid = function () {
      return this.valid ? true : false;
    };

    /**
     * @name $ADP.PrivacyInfo#render
     * @function
     * @description
     * @return  
     */
    self.prototype.render = function () {
      var title = this.getTitle();
      var text = this.getText();
      var linkText = this.getLinkText();
      var url = this.getURL();
      var s = '';
      if (linkText) s += linkText;
      if (url) s = '<a href="' + url + '" target="_blank">' + s + '</a>';
      if (s) s += '<br />';
      if (text) s = text + '<br />' + s;
      if (title) s = title + '<br />' + s;
      return s;
    };

  }

  this.init(args);
};

