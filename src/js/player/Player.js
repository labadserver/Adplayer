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
      this.position = args.position || 'top-right';
      this.items = [];
      var items = args.items || [];
      for (var i = 0; i < items.length; i++) {
        var privacyInfo = new $ADP.PrivacyInfo(items[i]);
        if (privacyInfo.isValid()) this.items.push(privacyInfo);
      }
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
      var header = this.getHeader();
      var footer = this.getFooter();
      var items = this.getPrivacyInfos();
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
        var privacy_info = '';
        for (var i = 0; i < items.length; i++) {
          var item = items[i];
          try {
            privacy_info += item.render() + '<br />\n';
          } catch (e) {}

        }

        var panelContent = '<div class="adp-panel-header">' + header + '<\/div>' + '<div class="adp-panel-info">' + privacy_info + '<\/div>' + '<div class="adp-panel-footer">' + footer + '<\/div>';

        container.innerHTML = '<div id="adp-wrapper-' + obaId + '" class="adp-wrapper adp-' + position + '" style="z-index:99999999;">' + '<div id="adp-admarker-' + obaId + '" class="adp-admarker">' + '<div id="adp-admarker-icon-' + obaId + '" class="adp-admarker-icon adp-' + position + '"><\/div>' + '<div id="adp-admarker-text-' + obaId + '" class="adp-admarker-text adp-' + position + '">Datenschutzinfo<\/div>' + '<\/div>' + '<div id="adp-panel-' + obaId + '" class="adp-panel adp-' + position + '" style="display:none;">' + '<div id="adp-panel-close-' + obaId + '" class="adp-panel-close">Schlie&szlig;en<\/div>' + panelContent + '<\/div>' + '<\/div>';

        // add event handler            
        var adMarkerIcon = document.getElementById('adp-admarker-icon-' + obaId);
        if (adMarkerIcon) adMarkerIcon.onclick = function () {
          var panel = document.getElementById('adp-panel-' + obaId);
          if (panel) panel.style.display = 'block';
        }
        var adMarkerText = document.getElementById('adp-admarker-text-' + obaId);
        if (adMarkerText) adMarkerText.onclick = function () {
          var panel = document.getElementById('adp-panel-' + obaId);
          if (panel) panel.style.display = 'block';
        };
        var close = document.getElementById('adp-panel-close-' + obaId);
        if (close) close.onclick = function () {
          var panel = document.getElementById('adp-panel-' + obaId);
          if (panel) panel.style.display = 'none';
        };
      } else {
        if (this.attempts > this.maxAttempts) {
          //Too many attempts for ' + obaId + ', ' + domId
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

  }

  this.init(id, args);
};

