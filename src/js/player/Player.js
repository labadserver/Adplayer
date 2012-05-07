/**
* @name $ADP.Player
* @class
* @description The <code>$ADP.Player</code> class.
*
* @example
* TODO
*/
$ADP.Player = function(id, args) {
    var self = arguments.callee;
    if (!self.prototype.init) {
      self.prototype.attempts = 0;
      self.prototype.maxAttempts = 50;
      self.prototype.init = function(id, args) {
          this.id       = id;
          this.domId    = args.domId;
          this.header   = args.header;
          this.footer   = args.footer;
          this.position = args.position || 'top-right';
          this.items    = [];
          var items = args.items || [];
          for (var i = 0; i < items.length; i++) {
            var privacyInfo = new $ADP.PrivacyInfo(items[i]);
            if (privacyInfo.isValid())
              this.items.push(privacyInfo);
          }
        };
      self.prototype.getId = function() {
          return this.id;
        };
      self.prototype.getDOMId = function() {
          return this.domId;
        };
      self.prototype.getPosition = function() {
          return this.position || 'top-right';
        };
      self.prototype.getHeader = function() {
    	  return (this.header || 'Datenschutzbestimmungen');
        };
      self.prototype.getFooter = function() {
          return (this.footer || '');
        };
      self.prototype.hasPrivacyInfo = function() {
          return this.items.length;
        };
      self.prototype.getPrivacyInfos = function() {
          return this.items;
        };
      self.prototype.inject = function() {
          var obaId    = this.getId();
          var domId    = this.getDOMId();
          var position = this.getPosition();
          var header   = this.getHeader();
          var footer   = this.getFooter();
          var items    = this.getPrivacyInfos();
          if (!obaId) {
            // No obaId specified for $ADP.Play/er.inject into ' + domId
            return;
          }
          if (!domId) {
            if (window == window.top && document.body) return;
            var iframeButton = document.createElement('DIV');
            iframeButton.id = domId = 'iframe-button-'+Math.round(Math.random()*9999);
            iframeButton.style.height='0px';
            iframeButton.style.position='relative';
            document.body.insertBefore(iframeButton,document.body.firstChild);
          }
          var container = iframeButton || document.getElementById(domId);
          if (container) {
            var privacy_info = '';
            for (var i = 0; i < items.length; i++) {
              var item = items[i];
              try {
                privacy_info += item.render() + '<br />\n';
              }
              catch(e) {}
              
            }
            
            var panelContent =
                '<div class="adp-panel-header">' + header + '<\/div>'
              + '<div class="adp-panel-info">' + privacy_info + '<\/div>'
              + '<div class="adp-panel-footer">' + footer + '<\/div>';

            container.innerHTML =
                '<div id="adp-wrapper-' + obaId + '" class="adp-wrapper adp-' + position + '" style="z-index:99999999;">'
              +   '<div id="adp-admarker-' + obaId + '" class="adp-admarker">'
              +     '<div id="adp-admarker-icon-' + obaId + '" class="adp-admarker-icon adp-' + position + '"><\/div>'
              +     '<div id="adp-admarker-text-' + obaId + '" class="adp-admarker-text adp-' + position + '">Datenschutzinfo<\/div>'
              +   '<\/div>'
              +   '<div id="adp-panel-' + obaId + '" class="adp-panel adp-' + position + '" style="display:none;">'
              +     '<div id="adp-panel-close-' + obaId + '" class="adp-panel-close">Schlie&szlig;en<\/div>'
              +     panelContent
              +   '<\/div>'
              + '<\/div>';
            
            // add event handler            
            var adMarkerIcon = document.getElementById('adp-admarker-icon-' + obaId);
            if (adMarkerIcon) adMarkerIcon.onclick = function() {
              var panel = document.getElementById('adp-panel-' + obaId);
              if (panel) panel.style.display = 'block';
            }
            var adMarkerText = document.getElementById('adp-admarker-text-' + obaId);
            if (adMarkerText) adMarkerText.onclick = function() {
              var panel = document.getElementById('adp-panel-' + obaId);
              if (panel) panel.style.display = 'block';
            };
            var close = document.getElementById('adp-panel-close-' + obaId);
            if (close) close.onclick = function() {
              var panel = document.getElementById('adp-panel-' + obaId);
              if (panel) panel.style.display = 'none';
            };
          }
          else {
            if (this.attempts > this.maxAttempts) {
              //Too many attempts for ' + obaId + ', ' + domId
              return;
            }
            else {
              ++this.attempts;
              var that = this;
              setTimeout(function() {that.inject()}, 100);
            }
          }
        };
    }
    this.init(id, args);
  };

