/*
	$Revision: 1.2 $Date: 2012/04/25 09:36:43 $
	Author: ingrid.graefen@sevenonemedia.de
*/

/*
	// structure of OBA.Registry.data
	// plain data, no reference to other OBA objects
	{
		123: {
				timeoutId: 7,
				domId: oba123,
				header: 'Header',
				footer: 'Footer',
				items: [
						{
							title:    'title1',
							text:     'text1',
							url:      'url1',
							linkText: 'linkText1'
						},
						{
							title:    'title2',
							text:     'text2',
							url:      'url2',
							linkText: 'linkText2'
						}
					]
			}
	}
*/

if (!window.$ADP) $ADP = {};

$ADP.Registry = {
		data: {},
		wait: 2000,
		register: function(id, args) {
				if (!args) args = {};
				if (!this.data[id]) {
					this.data[id] = {items: []};
					this.data[id].timeoutId = setTimeout(function() {$ADP.Registry.createPlayer(id, {position: 'top-left'})}, this.wait);
				}
				var item = {};
				for (var k in args) {
					switch (k) {
						case 'domId':
						case 'header':
						case 'footer':
							this.data[id][k] = args[k]; // last one wins
							break;
						case 'title':
						case 'text':
						case 'url':
						case 'linkText':
							item[k] = args[k];
							break;
						default:
							// invalid => ignore
							break;
					}
				}
				this.data[id].items.push(item);
			},
		unregister: function(id) {
				if (this.data[id].timeoutId)
					clearTimeout(this.data[id].timeoutId);
				delete this.data[id];
			},
		transfer: function(id) {
				this.unregister(id);
			},
		getById: function(id) {
				var items = [];
				if (this.data[id]) items = this.data[id].items || [];
				return items;
			},
		getDOMId: function(id) {
				if (this.data[id]) return this.data[id].domId;
			},
		hasId: function(id) {
				return this.data[id] ? true : false;
			},
		createPlayer: function(id, args) {
				if (!args) args = {};
				var header = args.header;
				var footer = args.footer;
				var domId  = args.domId;
				var position = args.position || 'top-right';
				if (this.data[id]) {
					if (this.data[id].timeoutId)
						clearTimeout(this.data[id].timeoutId);
					if (domId) this.data[id].domId = domId; // last one wins
					domId = this.getDOMId(id);
				}

				var items = this.getById(id);
				var player = new $ADP.Player(id, {domId: domId, position: position, header: header, footer: footer, items: items});
				player.inject();

				return player;
			}
	};

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

$ADP.PrivacyInfo = function(args) {
		var self = arguments.callee;
		if (!self.prototype.init) {
			self.prototype.init = function(args) {
					this.valid    = args.title || args.text || args.linkText ? true : false;
					this.title    = args.title;
					this.text     = args.text;
					this.url      = args.url;
					this.linkText = args.linkText;
				};
			self.prototype.getTitle = function() {
					return this.title;
				};
			self.prototype.getText = function() {
					return this.text;
				};
			self.prototype.getURL = function() {
					return this.url;
				};
			self.prototype.getLinkText = function() {
					return this.linkText;
				};
			self.prototype.isValid = function() {
					return this.valid ? true : false;
				};
			self.prototype.render = function() {
					var title    = this.getTitle();
					var text     = this.getText();
					var linkText = this.getLinkText();
					var url      = this.getURL();
					var s = '';
					if (linkText) s += linkText;
					if (url) s = '<a href="' + url + '" target="_blank">' + s + '</a>';
					if (s) s += '<br />';
					if (text)  s = text + '<br />' + s;
					if (title) s = title + '<br />' + s;
					return s;
				};
		}

		this.init(args);
	};
