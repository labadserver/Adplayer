/*
	$Revision: 1.3 $Date: 2012/05/02 08:08:01 $
	Author: ingrid.graefen@sevenonemedia.de
*/

/*
	// structure of $ADP.Registry.data
	// plain data, no reference to other $ADP objects
	{
		123: {
				timeoutId: 7,
				domId: 'oba123',
				header: 'Header',
				footer: 'Footer',
				display: 'layer', // layer|popup|iframe
				fallback: false, // true|false, only passed internally
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

if (!window.$ADP) {
	$ADP = {};

	$ADP.Registry = {
		data: {},
		wait: 2000,

		// window types
		MAIN: 'MAIN',
		POPUP: 'POPUP',
		FRIENDLY_IFRAME: 'FRIENDLY_IFRAME',
		FOREIGN_IFRAME: 'FOREIGN_IFRAME',
		
		/*
			properties for args
			- domId
			- header
			- footer
			- display
			- position
			- fallback
			- title
			- text
			- url
			- linkText
		*/
		register: function(id, args) {
			if (!args) args = {};
			if (!this.data[id])
				this.initFromMaster(id);

			if (!this.data[id]) {
				this.data[id] = {items: []};
				this.data[id].timeoutId = setTimeout(
					function() {
						$ADP.Registry.createInstance(
									id, {position: 'top-left', fallback: true}
								)
							},
					this.wait
				);
			}
			else if (!this.data[id].items) {
				this.data[id].items = [];
			}
			
			var item = {};
			for (var k in args) {
				// Do not clobber existing data with empty value
				if (!args[k]) continue;
				switch (k) {
					case 'domId':
					case 'header':
					case 'footer':
					case 'position':
						// last one with non-empty info wins
						this.data[id][k] = args[k];
						break;
					case 'display':
						// popup wins, for other options last one wins
						if (!this.data[id][k] == 'popup') this.data[id][k] = k;
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
			if (!this.data[id]) return;
			if (this.data[id].timeoutId)
				clearTimeout(this.data[id].timeoutId);
			delete this.data[id];
		},
		// Note: unregister is executed
		// Whoever executes transferData takes responsibility for display of privacy info
		transferData: function(id) {
			var data = this.data[id];
			if (data) {
				this.unregister(id);
				delete data.timeoutId;
			}
			return data || {};
		},
		initFromMaster: function(id) {
			var windowType = this.getWindowType();
			switch (windowType) {
				case this.FRIENDLY_IFRAME:
					this.initByCopyFromParent(id);
					break;
				case this.FOREIGN_IFRAME:
					this.initByPostMessageFromParent(id);
					break;
				case this.POPUP:
					this.initByPostMessageFromOpener(id);
					break;
			}
		},
		initByCopyFromParent: function(id) {
			try {
				var data = parent.$ADP.Registry.transferData(id);
				this.data[id] = {}; // Important: initialization prevents endless register recursion
				var items = data.items || []; // copy items for later use in register
				delete data.items;
				delete data.domId; // domId is useless because the related container lives in parent
				this.register(id, data); // registers general properties
				for (var k in items) {
					this.register(id, items[k]); // registers item properties
				}
			}
			catch(e) {
				alert('Error with $ADP.Registry.initByCopyFromParent: ' + e.message);
			}
		},
		initByPostMessageFromParent: function(id) {
			// FIXME: not yet implemented
		},
		getWindowType: function() {
			if (!this.windowType) {
				var type = this.MAIN;
				if (window == parent) {
					if (window.opener) {
						try {
							if (window.opener.$ADP) type = this.POPUP;
						}
						catch (e) {}
					}
				}
				else {
					try {
						var x = parent.location.href; // dies if foreign
						if (parent.$ADP) type = this.FRIENDLY_IFRAME;
					}
					catch(e) {
						type = this.FOREIGN_IFRAME;
					}
				}
				this.windowType = type;
			}
			return this.windowType;
		},
		getItems: function(id) {
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
		createInstance: function(id, args) {
			if (!args) args = {};
			this.register(id, args);
			
			var data = this.data[id];
			if (!data) {
				alert('$ADP.Registry.createInstance: no data available for ' + id);
				return;
			}

			if (data.timeoutId)
				clearTimeout(this.data[id].timeoutId);

			var instance = new $ADP.Instance(
					id,
					{
						domId:    data.domId,
						position: data.position,
						header:   data.header,
						footer:   data.footer,
						display:  data.display,
						items:    this.getItems(id) || []
					}
				);
			instance.inject();

			return instance;
		}
	};

	$ADP.Instance = function(id, args) {
		var self = arguments.callee;
		if (!self.prototype.init) {
			// Class methods for setting onclick in HTML
			// (events are lost if ads are moved via innerHTML)
			self.show = function(id) {
				var elem = document.getElementById(id);
				if (elem) elem.style.display = 'block';
			};
			self.hide = function(id) {
				var elem = document.getElementById(id);
				if (elem) elem.style.display = 'none';
			};

			// instance properties and methods
			self.prototype.attempts = 0;
			self.prototype.maxAttempts = 50;

			self.prototype.init = function(id, args) {
				this.id       = id;
				this.domId    = args.domId;
				this.header   = args.header;
				this.footer   = args.footer;
				this.display  = args.display;
				this.position = args.position;
				this.fallback = args.fallback;
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
			self.prototype.getWrapperId = function() {
				return 'oba-wrapper-' + this.getId();
			};
			self.prototype.getPosition = function() {
				return this.position || 'top-right';
			};
			self.prototype.getDisplay = function() {
				return this.display || 'layer';
			};
			self.prototype.getHeader = function() {
				return this.header || 'Datenschutzbestimmungen';
			};
			self.prototype.getFooter = function() {
				return this.footer || '';
			};
			self.prototype.isFallback = function() {
				return this.fallback ? true : false;
			};
			self.prototype.hasPrivacyInfo = function() {
				return this.items.length;
			};
			self.prototype.getPrivacyItems = function() {
				return this.items;
			};
			self.prototype.inject = function() {
				if (!this.hasPrivacyInfo()) return;

				var obaId = this.getId();
				if (!obaId) {
					alert('No obaId specified for $ADP.Instance.inject into ' + domId);
					return;
				}

				var domId = this.getDOMId();
				if (!domId) {
					if (this.isFallback()) {
						// No error - fallback feature not always possible
					}
					else {
						alert('No domId available for ' + obaId);
					}
					return;
				}

				var position = this.getPosition();
				var header   = this.getHeader();
				var footer   = this.getFooter();
				var items    = this.getPrivacyItems();

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
					if (privacy_info) privacy_info = header + '<hr />' + privacy_info + '<hr />' + footer;

					var aligned = position == 'top-right' ? 'right' : 'left';
					var wrapperId = 'oba-wrapper-' + obaId;
					var panelId   = 'oba-panel-' + obaId;
					var closeId   = 'oba-close-' + obaId;
					var buttonId  = 'oba-button-' + obaId;

					// FIXME: handle different display methods (layer|popup|iframe)
					// Note: define events in html, i.e. onclick="doSomething()"
					// because events are lost when ad is copied via innerHTML
					var content =
						  '<div id="' + wrapperId + '" style="position:absolute;top:0px;' + aligned + ':0px;z-index:99999999;font-size:11px;line-height:1.2;font-family:Verdana;">'
						+ '<img onclick="$ADP.Instance.show(\'' + panelId + '\')" id="' + buttonId + '" src="./oba_icon_15x20.jpg" style="cursor:pointer;position:absolute;z-index:1;top:0px;' + aligned + ':0px;width:15px;height:20px;border-style:none;" />'
						+ '<div id="' + panelId + '" style="display:none;white-space:nowrap;position:absolute;z-index:3;top:0px;' + aligned + ':0px;padding:10px 10px 5px 5px;background-color:#fff;border:2px solid black;">'
							+ '<div onclick="$ADP.Instance.hide(\'' + panelId + '\')" id="' + closeId + '" style="cursor:pointer;position:absolute;top:0px;right:0px;padding:1px;">X</div>'
							+ privacy_info
						+ '<\/div>'
						+ '<\/div>';
					container.innerHTML = content;
				}
				else {
					if (this.attempts > this.maxAttempts) {
						alert(this.attempts + ' unsuccessful attempts for ' + obaId + ' into #' + domId + ' ' + (window == parent ? 'main' : 'iframe'));
						return;
					}
					else {
						++this.attempts;
						var that = this;
						setTimeout(function() {that.inject()}, 100);
					}
				}
			};
			self.prototype.show = function() {
				self.show(this.getWrapperId());
			};
			self.prototype.hide = function() {
				self.hide(this.getWrapperId());
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
				var code = '';
				if (linkText) code += linkText;
				if (url) code = '<a href="' + url + '" target="_blank">' + code + '</a>';
				if (code) code += '<br />';
				if (text) code = text + '<br />' + code;
				if (title) code = title + '<br />' + code;
				return code;
			};
		}

		this.init(args);
	};
}