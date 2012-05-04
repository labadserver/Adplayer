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
          return (this.header || 'Datenschutzbestimmungen')
            + '<hr />';
        };
      self.prototype.getFooter = function() {
          var footer = this.footer || '';
          if (footer) footer = '<hr />' + footer;
          return footer;
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
            alert('No obaId specified for $ADP.Player.inject into ' + domId);
            return;
          }
          if (!domId) {
            // FIXME: not working yet in iframe case (transfer still missing)
            // alert('No domId available for ' + obaId);
            return;
          }
          var container = document.getElementById(domId);
          if (container) {
            var privacy_info = '';
            for (var i = 0; i < items.length; i++) {
              var item = items[i];
              try {
                privacy_info += item.render() + '<br />\n';
              }
              catch(e) {
                alert(e.message)
              }
              
            }
            if (privacy_info) privacy_info = header + privacy_info + footer;

            var aligned = position == 'top-right' ? 'right' : 'left';
            container.innerHTML =
                '<div id="oba-wrapper-' + obaId + '" style="position:absolute;top:0px;' + aligned + ':0px;z-index:99999999;font-size:11px;line-height:1.2;font-family:Verdana;">'
              + '<img id="oba-button-' + obaId + '" src="./oba_icon_15x20.jpg" style="cursor:pointer;position:absolute;z-index:1;top:0px;' + aligned + ':0px;width:15px;height:20px;border-style:none;" />'
              + '<div id="oba-panel-' + obaId + '" style="display:none;white-space:nowrap;position:absolute;z-index:3;top:0px;' + aligned + ':0px;padding:10px 10px 5px 5px;background-color:#fff;border:2px solid black;">'
                + '<div id="oba-close-' + obaId + '" style="cursor:pointer;position:absolute;top:0px;right:0px;padding:1px;">X</div>'
                + privacy_info
              + '<\/div>'
              + '<\/div>';
            var button = document.getElementById('oba-button-' + obaId);
            if (button) button.onclick = function() {
                  var panel = document.getElementById('oba-panel-' + obaId);
                  if (panel) panel.style.display = 'block';
                };
            var close = document.getElementById('oba-close-' + obaId);
            if (close) close.onclick = function() {
                  var panel = document.getElementById('oba-panel-' + obaId);
                  if (panel) panel.style.display = 'none';
                };
          }
          else {
            if (this.attempts > this.maxAttempts) {
              alert('Too many attempts for ' + obaId + ', ' + domId);
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

