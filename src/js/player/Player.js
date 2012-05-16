/** 
 * @name $ADP.Player
 * @class
 * @description The <code>$ADP.Player</code> class.
 *
 * @param id    See {@link $ADP.Registry#register}
 * @param args  See {@link $ADP.Registry#register}
 *
 * @example
 * TODO
 */
$ADP.Player = function (id, args) {
  var self = arguments.callee;
  if (!self.prototype.init) {

    /**
     * @private
     * @name $ADP.Player#attempts
     * @field
     * @description Used to keep track of current attempts being made.
     * 
     * @type integer 
     */
    self.prototype.attempts = 0;

    /**
     * @name $ADP.Player#maxAttempts
     * @field
     * @description The maximum amount of attempts to wait for the <code>Player</code>'s container
     *     to be available in the DOM.
     *
     * @default 50
     * @type integer
     */
    self.prototype.maxAttempts = 50;

    /**
     * @private
     * @name $ADP.Player#init
     * @function
     * @description Class constructor.
     */
    self.prototype.init = function (id, args) {
      this.id = id;
      this.domId = args.domId;
      this.header = args.header;
      this.footer = args.footer;
      this.publisherInfo = args.publisherInfo;
      this.position = args.position || 'top-right';
      this.items = [];
      var items = args.items || [];
      for (var i = 0; i < items.length; i++) {
        var privacyInfo = new $ADP.PrivacyInfo(items[i]);
        if (privacyInfo.isValid()) this.items.push(privacyInfo);
      }
      this.usePopup = !!args.usePopup;
      $ADP.Util.log(id,'Popup: '+this.usePopup);
    };

    /**
     * @name $ADP.Player#getId
     * @function
     * @description Returns the OBA id that is used to identify this player's unique privacy messages.
     * 
     * @returns {integer}  The player's OBA id.
     */
    self.prototype.getId = function () {
      return this.id;
    };

    /**
     * @name $ADP.Player#getDOMId
     * @function
     * @description Returns the OBA DOM id that is used to identify this player's unique privacy messages.
     *
     * @returns {integer}  The player's OBA DOM id.
     */
    self.prototype.getDOMId = function () {
      return this.domId;
    };

    /**
     * @name $ADP.Player#getPosition
     * @function
     * @description Returns the position of the OBA button.
     *
     * @returns {string}  The OBA button position. <b>Default:</b> top-right
     */
    self.prototype.getPosition = function () {
      return this.position || 'top-right';
    };

    /**
     * @name $ADP.Player#getHeader
     * @function
     * @description Returns the player's header message displayed in the privacy window.
     *
     * @returns {string}  The player's header message. <b>Default:</b> Datenschutzbestimmungen
     */
    self.prototype.getHeader = function () {
      return (this.header || 'Datenschutzbestimmungen');
    };

    /**
     * @name $ADP.Player#getFooter
     * @function
     * @description Returns the player's footer message displayed in the privacy window.
     *
     * @returns {string} The player's footer message. <b>Default:</b> <i>empty string</i>
     */
    self.prototype.getFooter = function () {
      return (this.footer || '');
    };
    
    /**
     * @name $ADP.Player#getPublisherInfo
     * @function
     * @description Returns the player's publisher info message displayed in the privacy window.
     *
     * @returns {string}  The player's publisher message. <b>Default:</b> <i>empty string</i>
     */
    self.prototype.getPublisherInfo = function () {
      return (this.publisherInfo || '');
    };
    
    /**
     * @name $ADP.Player#getPrivacyButtonText
     * @function
     * @description Returns the text displayed when hovering the privacy button.
     * @todo: localization still has to be done, decission about dealing with special html characters
     * 
     * @returns {string}  The player's privacy button text. <b>Default:</b> <i>Datenschutzinfo</i>
     */
    self.prototype.getPrivacyButtonText = function () {
      return 'Datenschutzinfo';
    };
    
    /**
     * @name $ADP.Player#getCloseButtonText
     * @function
     * @description Returns the text displayed inside the privacy panel.
     * @todo: localization still has to be done, decission about dealing with special html characters
     * 
     * @returns {string}  The privacy panel's close button text. <b>Default:</b> <i>Schlie&szlig;en</i>
     */
    self.prototype.getCloseButtonText = function () {
      return 'Schlie&szlig;en';
    };
    
    /**
     * @name $ADP.Player#usePopupForPrivacyInfo
     * @function
     * @description Returns whether the privacy info should be displayed in a popup window.
     *
     * @returns {boolean}  
     */
    self.prototype.usePopupForPrivacyInfo = function () {
      return this.usePopup ? true : false;
    };

    /**
     * @name $ADP.Player#hasPrivacyInfo
     * @function
     * @description Returns boolean determining whether the player contains any privacy information.
     *
     * @returns {boolean} <code>true</code> / <code>false</code> 
     * 
     * @see $ADP.PrivacyInfo
     */
    self.prototype.hasPrivacyInfo = function () {
      return Boolean(this.items.length);
    };

    /**
     * @name $ADP.Player#getPrivacyInfos
     * @function
     * @description Returns a list containing the player's privacy information.
     *
     * @returns {array} The list containing privacy information. 
     * 
     * @see $ADP.PrivacyInfo
     */
    self.prototype.getPrivacyInfos = function () {
      return this.items;
    };

    /**
     * @private
     * @name $ADP.Player#inject
     * @function
     * @description Assumes arguments have been predefined at instantiation and
     *     initializes player setup when invoked.
     * 
     * @see $ADP.Registry#createPlayer
     */
    self.prototype.inject = function () {
      var obaId = this.getId();
      var domId = this.getDOMId();
      var position = this.getPosition();
      if (!obaId) {
        // No obaId specified for $ADP.Play/er.inject into ' + domId
        return;
      }
      if (!domId) {
        if (window == window.top && document.body) return;
        var iframeButton = document.createElement('DIV');
        iframeButton.id = domId = 'iframe-button-' + Math.round(Math.random() * 9999);
        iframeButton.style.height = '0px';
        iframeButton.style.position = 'relative';
        document.body.insertBefore(iframeButton, document.body.firstChild);
      }
      var container = iframeButton || document.getElementById(domId);
      if (container) {
        container.innerHTML = '<div id="adp-wrapper-' + obaId + '" class="adp-wrapper adp-' + position + '" style="z-index:99999999;">' + '<div id="adp-admarker-' + obaId + '" class="adp-admarker" >' + '<div id="adp-admarker-icon-' + obaId + '" class="adp-admarker-icon adp-' + position + '" onClick="$ADP.Registry.playerCmd('+obaId+',\'showPrivacy\');"><\/div>' + '<div id="adp-admarker-text-' + obaId + '" class="adp-admarker-text adp-' + position + '"  onClick="$ADP.Registry.playerCmd('+obaId+',\'showPrivacy\');">' + this.getPrivacyButtonText() + '<\/div>' + '<\/div>';
      } else {
        if (this.attempts > this.maxAttempts) {
          $ADP.Util.log('Too many attempts for ' + obaId + ', ' + domId);
          return;
        } else {
          ++this.attempts;
          var that = this;
          setTimeout(function () {
            that.inject()
          }, 100);
        }
      }
    };
    
    self.prototype.getPanelHTML = function() {
      var obaId = this.getId();
      var position = this.getPosition();
      var header = this.getHeader();
      var footer = this.getFooter();
      var publisherInfo = this.getPublisherInfo();
      var closeButtonText = this.getCloseButtonText();
      var items = this.getPrivacyInfos();
      var usePopup = this.usePopupForPrivacyInfo();
      var closeAction = !usePopup ?"$ADP.Registry.playerCmd("+obaId+",'hidePrivacy');":'window.close();';
      var privacy_info = '';
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        try {
          privacy_info += item.render() + '<br />\n';
        } catch (e) {}
      }
      
      var panelContent = '';
      if(header != '') panelContent = panelContent.concat('<div class="adp-panel-header">' + header + '<\/div>');
      if(publisherInfo != '') panelContent = panelContent.concat('<div class="adp-panel-publisherinfo">' + publisherInfo + '<\/div>');
      panelContent = panelContent.concat('<div class="adp-panel-info">' + privacy_info + '<\/div>');
      if(footer != '') panelContent = panelContent.concat('<div class="adp-panel-footer">' + footer + '<\/div>');
      
      var HTML = '<div id="adp-panel-close-' + obaId + '" class="adp-panel-close" onClick="'+closeAction+'">' + closeButtonText + '<\/div>' + panelContent + '<\/div>';
      return HTML;
    };
    
    /**
     * @name $ADP.Player#showPrivacy
     * @function
     * @description Will show the privacy information
     * @param {integer} obaid
     */
    self.prototype.showPrivacy = function() {
      var position = this.getPosition();
      var obaId = this.getId();
      var usePopup = this.usePopupForPrivacyInfo();
      function renderInLayer() {
        var panel = document.getElementById('adp-panel-' + obaId);
        if (!panel) {
          var wrapper = document.getElementById('adp-wrapper-'+obaId);
          if(!wrapper) return;
          var panel = document.createElement('DIV');
          panel.id='adp-panel-' + obaId;
          panel.className='adp-panel adp-' + position;
          panel.display='block';
          panel.innerHTML = this.getPanelHTML();
          wrapper.appendChild(panel);
        } else panel.style.display = 'block';
      }
      if (!usePopup) {
        renderInLayer.apply(this);
      } else {
        var title = "Privacy Information";
        var styles = document.styleSheets;
        var popwin = "";
        try{ 
          popwin = window.open('',title,'width=400,height=400');
        } catch(e) {popwin = window.open('about:blank');}
        if(!popwin) { renderInLayer.apply(this); }
        else {
          popwin.resizeTo(400,400);
          var popdoc = popwin.document;
          window.popwin = popwin;
          popdoc.write('<html><head><title>'+title+'</title>');
          for (var k in styles)
            if (styles[k].href) popdoc.write('<link rel="stylesheet" href="'+styles[k].href+'">');
          popdoc.write('</head><body>');
          popdoc.write(this.getPanelHTML());
          popdoc.write('</body></html>');
          popdoc.close();        
        }
      }
    };

    /**
     * @name $ADP.Player#hidePrivacy
     * @function
     * @description hides the privacy information
     * @param {integer} obaid
     */
    self.prototype.hidePrivacy = function() {
      var obaId = this.getId();
      var panel = document.getElementById('adp-panel-' + obaId);
      if (panel) panel.style.display = 'none';
    };    
  }

  this.init(id, args);
};
