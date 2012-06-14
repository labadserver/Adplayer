/**
 * @name $ADP.Registry
 * @class
 * @description The <code>$ADP.Registry</code> class.
 *
 * @example
 * TODO
 *
 *  // structure of OBA.Registry.data
 *  // plain data, no reference to other OBA objects
 *  {
 *    123: {
 *        timeoutId: 7,
 *        domId: oba123,
 *        header: 'Header',
 *        footer: 'Footer',
 *        items: [
 *            {
 *              title:    'title1',
 *              text:     'text1',
 *              url:      'url1',
 *              linkText: 'linkText1',
 *              usePopupForPrivacyinfo: true
 *            },
 *            {
 *              title:    'title2',
 *              text:     'text2',
 *              url:      'url2',
 *              linkText: 'linkText2'
 *            }
 *          ]
 *      }
 *  }
 *
 */
$ADP.Registry = $ADP.Registry || {
  data: {},
  wait: 2000,

  LAST: 'LAST',
  MAIN: 'MAIN',
  POPUP: 'POPUP',
  FRIENDLY_IFRAME: 'FRIENDLY_IFRAME',
  FOREIGN_IFRAME: 'FOREIGN_IFRAME',
  POSTMESSAGE_SEARCH: 'POSTMESSAGE_SEARCH',
  
  header: '<strong class="adp-header-strong">Informationen zu nutzungsbasierter Online-Werbung</strong><br/>In der vorliegenden Anzeige werden Ihre Nutzungsdaten anonym erhoben bzw. verwendet, um Werbung f&uuml;r Sie zu optimieren. Wenn Sie keine nutzungsbasierte Werbung mehr von den hier gelisteten Anbietern erhalten wollen, k&ouml;nnen Sie die Datenerhebung beim jeweiligen Anbieter direkt deaktivieren. Eine Deaktivierung bedeutet nicht, dass Sie k&uuml;nftig keine Werbung mehr erhalten, sondern lediglich, dass die Auslieferung der konkreten Kampagne nicht anhand anonym erhobener Nutzungsdaten ausgerichtet ist.',
  footer: 'Wenn Sie mehr &uuml;ber nutzungsbasiere Online-Werbung erfahren wollen, klicken Sie <a href="http://meine-cookies.org" target="_blank">hier</a>. Dort k&ouml;nnen Sie dar&uuml;ber hinaus auch bei weiteren Anbietern die Erhebung der Nutzungsinformationen deaktivieren bzw. aktivieren und den Status der Aktivierung bei unterschiedlichen Anbietern <a href="http://meine-cookies.org/cookies_verwalten/praeferenzmanager-beta.html" target="_blank">einsehen</a>.',
  publisherInfo: undefined,

  /**
   * @name $ADP.Registry#register
   * @function
   * @description Registers the privacy item for an AdPlayer chain. 
   * 
   * @param {integer} id The OBA id that is used to identify this player's unique privacy messages 
   * @param {object}  args   The Arguments
   * @param {string}  args.header   The header text
   * @param {string}  args.footer   The footer text 
   * @param {string}  args.domId   The domId where the privacy button must be rendered
   * @param {string}  args.title  The name of the privacy party
   * @param {string}  args.text   The short description 
   * @param {string}  args.url    The opt out or more information url
   * @param {string}  args.linkText  The text that should be displayed instead of the link url
   * @param {boolean} args.usePopup  Boolean to display privacy info in a popup
   * @param {boolean} args.renderCloseButton  Boolean to display close-button in a popup 
   *  
   */
  register: function (id, args) {
    this._register(id, args, false);
  },
  
  /**
   * @name $ADP.Registry#_register
   * @function
   * @description Internal register function that registers the privacy item for an AdPlayer chain. 
   * 
   * @param {integer} id The OBA id that is used to identify this player's unique privacy messages 
   * @param {object}  args   The Arguments
   * @param {string}  args.header   The header text
   * @param {string}  args.footer   The footer text 
   * @param {string}  args.domId   The domId where the privacy button must be rendered
   * @param {string}  args.title  The name of the privacy party
   * @param {string}  args.text   The short description 
   * @param {string}  args.url    The opt out or more information url
   * @param {string}  args.linkText  The text that should be displayed instead of the link url
   * @param {boolean} args.usePopup  Boolean to display privacy info in a popup
   * @param {boolean} args.renderCloseButton  Boolean to display close-button in a popup 
   * @param {boolean} useUnshift   The unShift variable is set when the item needs to be inserted in
   *     front of the current items, This occurs when one is adding items from a parent Registry object
   * 
   */
  _register: function (id, args, useUnshift) {
    if (!args) args = {};
    if (!this.data[id]) {
      this.data[id] = {
        items: []
      };
    }
    var item = {};
    for (var k in args) {
      switch (k) {
        case 'domId':
          this.data[id][k] = args[k]; // last one wins
          break;
        case 'header':
        case 'footer':
        case 'title':
        case 'text':
        case 'url':
        case 'linkText':
        case 'usePopup':
        case 'renderCloseButton':
          item[k] = args[k];
          break;
        default:
          // invalid => ignore
          break;
      }
    }
    if (!useUnshift) {
      this.data[id].items.push(item);
    } else {
      this.data[id].items.unshift(item);
    }
  },

  /**
   * @name $ADP.Registry#unregister
   * @function
   * @description Unregisters the privacy item for an AdPlayer chain.
   * 
   * @param {integer} id The OBA id that is used to identify this player's unique privacy messages.
   */
  unregister: function (id) {
    if (!this.data[id]) return;
    delete this.data[id];
  },
  
  /**
   * @name $ADP.Registry#getById
   * @function
   * @description Returns the current list of registry item by id.
   * 
   * @param {integer} id  The OBA id that is used to identify this player's unique privacy messages.
   * 
   * @return {array} The current list of registry items.
   */
  getById: function (id) {
    var items = [];
    if (this.data[id]) items = this.data[id].items || [];
    return items;
  },
  
  /**
   * @name $ADP.Registry#pullById
   * @function
   * @description Will return and unregister the privacy messages for the supplied OBA id.
   * 
   * @param {integer} id the OBA id that is used to identify this player's unique privacy messages.
   * 
   * @return {array} The current list of registry items.
   */
  pullById: function (id) {
    var items = this.getById(id);
    this.unregister(id);
    return items;
  },
  
  /**
   * @name $ADP.Registry#getDOMId
   * @function
   * @description Returns the player's OBA DOM id.
   * 
   * @param {integer} id  The OBA DOM id that is used to identify this player's unique privacy messages.
   * 
   * @return {integer} The player's OBA DOM id.
   */
  getDOMId: function (id) {
    if (this.data[id]) {
      return this.data[id].domId;
    }
  },
  
  /**
   * @name $ADP.Registry#hasId
   * @function
   * @description Returns a boolean that determines if an id has been set.
   * @param {integer} id The OBA id that is used to identify this player's unique privacy messages.
   * @return {boolean} <code>true</code> / <code>false</code>
   */
  hasId: function (id) {
    return this.data[id] ? true : false;
  },
  
  setPublisherInfo: function(info) {
    if(typeof this.publisherInfo === 'undefined') {
      this.publisherInfo = info;
    }
  },

  /**
   * @name  $ADP.Registry#checkParentAccess
   * @function
   * @description Check how we can access to given window
   *
   * @param window
   */
  checkParentAccess: function (window) {
	  var type;
      var adpAccess = function(win) { try { return Boolean(win.$ADP) } catch(e) { return false; } };
	  try {
		  if(window.parent.location.href == undefined) {
			  type = this.FOREIGN_IFRAME;
		  }
		  else
		  {
			  if (adpAccess(window.parent)) {
		        type = this.FRIENDLY_IFRAME;
		      } else {
		        type = this.POSTMESSAGE_SEARCH;
		      }
		  }
  	  } catch (e) {
		  type = this.FOREIGN_IFRAME;
  	  }
  	  return type;
  },

  /**
   * @name  $ADP.Registry#getWindowChain
   * @function
   * @description Collect Informations from all Parents in the Chain
   *
   * @param id
   */
  getWindowChain: function(id) {
	  if(!this.data[id].windowChain) {
		  var type = this.checkParentAccess(window.parent);
	      var chain = {1: {type: type, window: window, parent: window.parent}};
		  
	      if(window != window.parent) {
	    	  var doLoop = true;
	    	  var i = 2;
	    	  var nextWindow = window.parent;
	    	  var type;
	    	  while(doLoop) {
		    	  if(nextWindow == nextWindow.parent) {
		    		  type = this.checkParentAccess(nextWindow.parent);
		    		  chain[i] = {type:type, window: nextWindow};
		    		  doLoop = false;
		    	  }  
		    	  else
		    	  {
		    		  type = this.checkParentAccess(nextWindow.parent);
		    		  chain[i] = {type: type, window: nextWindow, parent:nextWindow.parent};
			          nextWindow = nextWindow.parent;
		    	  }
		    	  i++;
	    	  }
	    	  if(window.opener) {
	    		  type = this.checkParentAccess(window.opener);
	    		  chain[i] = {type: type, window: window, parent:window.opener};
	    	  }
	      }
	      else if(window.opener) {
    		  type = this.checkParentAccess(window.opener);
    		  chain[2] = {type: type, window: window, parent:window.opener};	    	  
	      }
	      this.data[id].windowChain = chain;
	  }
	  return this.data[id].windowChain;
  },
  
  /**
   * @name  $ADP.Registry#checkAndReducePostMessageCounter
   * @function
   * @description Reduce the postMessageCounter. Calls $ADP.Registry.submitPrivacy() if Counter == 0
   *
   * @param id
   */
  checkAndReducePostMessageCounter: function(id) {
	  this.data[id].postMessageCounter--;

	  if(this.data[id].postMessageCounter == 0) {
		  clearTimeout(this.data[id].postMessageTimeout);
	      this.submitPrivacy(id);
      }
  },
  
  /**
   * @private
   * @name  $ADP.Registry#registerParentItems
   * @function
   * @description Adds all the parent privacy items to the beginning of the current items list for
   *     the given id. This will also clear all invoked <code>tryNextParent</code> methods that are
   *     currently in progress fir this Adplayer chain id.
   *
   * @param id     The id of the Adplayer chain.
   * @param items  The array of privacy items.
   * 
   * @see $ADP.Registry#tryNextParent
   */
  registerParentItems: function (id, items) {
    if (!items) items = [];
    if (!this.data[id]) return;
    if (this.data[id].iframeSearch && this.data[id].iframeSearch.timeoutId) {
      clearTimeout(this.data[id].iframeSearch.timeoutId);
    }
    items.reverse();
    for (var k in items) {
      $ADP.Registry._register(id, items[k], true);
    }
  },
  
  /**
   * @name  $ADP.Registry#createPlayer
   * @function
   * @description This method is used to create the player for the given player id 
   * 
   * @param id     The id of the Adplayer chain
   * @param items  The array of privacy items
   */
  createPlayer: function (id, args) {
    if (!args) args = {};
    var header = args.header || this.header;
    var footer = args.footer || this.footer;
    var publisherInfo = this.publisherInfo || '';
    var domId = args.domId;
    var position = args.position || 'top-right';
    var usePopup = args.usePopup || true;
    var renderCloseButton = args.renderCloseButton == false ? false : true;
    if (!this.data[id]) this.data[id]={domId: null, items:[]};
    
    if (domId) this.data[id].domId = domId; // last one wins
    domId = this.getDOMId(id);
    
  var player = $ADP.Player(id, {
    domId: domId,
    position: position,
    header: header,
    footer: footer,
    publisherInfo: publisherInfo,
    usePopup: usePopup,
    renderCloseButton: renderCloseButton
  });
  player.inject();
  this.data[id].player = player;
  
  return player;
  },

  /**
   * @name    $ADP.Registry#generateId
   * @function
   * @description Generates a new and unused id.<br/><br/>
   *        <b>Note:</b> This method does not register any data at $ADP.Registry.
   * 
   * @returns   {Integer} Returns the generated id.
   */
  generateId: function () {
    var id;
    do {
      id = parseInt(Math.random() * 100000000);
    }
    while (this.hasId(id));
    return id;
  },
  
  /**
   * @private
   * @name    $ADP.Registry#messageHandler
   * @function
   * @description Handles the pull and unregister requests made from other windows.
   * 
   * @param event The window post message event object.
   */
  messageHandler: function (event) {
    try {
      var msg = $ADP.Message.parse(event.data),
        src = event.source,
        result = "";
      if (src == window) {
        return null;
      }

      switch (msg.type) {
        case $ADP.Message.types.pullOBA:
          result = $ADP.Registry.getById(msg.data);
          $ADP.Message.send(src, $ADP.Message.types.pullOBA_ACK, {
            id: msg.data,
            items: result
          });
          break;
        case $ADP.Message.types.unRegOBA:
          result = $ADP.Registry.unregister(msg.data);
//          $ADP.Message.send(src, $ADP.Message.types.unRegOBA_ACK, {
//            id: msg.data,
//            result: result
//          });
          break;
        case $ADP.Message.types.pullOBA_ACK:
            if (msg.data.id && msg.data.items && msg.data.items.length) {
	          $ADP.Registry.registerParentItems(msg.data.id, msg.data.items);
	          $ADP.Message.send(src, $ADP.Message.types.unRegOBA, msg.data.id);
	          
	          $ADP.Registry.checkAndReducePostMessageCounter(msg.data.id);
	        }
          break;
//        case $ADP.Message.types.unRegOBA_ACK:     	
//            break;
      }
    } catch (e) {$ADP.Util.log("Received Message",event," Rejected ",e);}
  },
  
  /**
   * @name $ADP.Registry#getItems
   * @function
   * @description Convertes items in $ADP.PrivacyInfo() an return these
   * 
   * @param id
   * 
   */
  getItems: function(id) {
	  var rawItems = this.data[id].items;
	  var items = [];
      for (var i = 0; i < rawItems.length; i++) {
    	  
    	if(rawItems[i].usePopup == false) {
    	  this.data[id].player.usePopup = false;
    	}
    	if(rawItems[i].renderCloseButton == false) {
    	  this.data[id].player.renderCloseButton = false;
      	}
    	
        var privacyInfo = $ADP.PrivacyInfo(rawItems[i]);
        if (privacyInfo.isValid()) items.push(privacyInfo);
      }
      return items;
  },
  
  /**
   * @name $ADP.Registry#collectPrivacy
   * @function
   * @description Collect Privacy Information from parents
   * 
   * @param id
   * 
   */
  collectPrivacy: function (id) {
	  var usePopup = true;
	  if(this.data[id].items && this.data[id].items.length) {
		  for(var i in this.data[id].items) {
			  if(this.data[id].items[i].usePopup == false) {
				  usePopup = false;
			  }
		  }
	  }
	  
	  if(usePopup) {
		if(this.data[id].player.popup) { this.data[id].player.popup.close() }
		
		try{
		  var randomPopupName = 'adp_info_' + Math.floor(Math.random()*100001);
		  popwin = window.open('',randomPopupName,'width=400,height=500,scrollbars=yes,location=0,menubar=0,toolbar=0,status=0');
		} catch(e) {popwin = window.open('about:blank');}
		
		this.data[id].player.popup = popwin;
	  }
		
	  if(this.data[id].player.items && this.data[id].player.items.length) {
		this.submitPrivacy(id);
	  } else {
		var chain = this.getWindowChain(id);
		
		var windowsInitWithPostMessage = [];
		
		for(var k in chain) {
			var items;
			if(!chain[k].parent || chain[k].parent == window) {}
			else if(chain[k].type == this.FOREIGN_IFRAME || chain[k].type == this.POSTMESSAGE_SEARCH) {
				  windowsInitWithPostMessage.push(chain[k]);
			}
			else {
				if(chain[k].window && chain[k].window.name) {
					try {
						items = $ADP.Util.JSON.parse($ADP.Util.atob(chain[k].window.name.replace(/^[^-]+\-([A-Za-z0-9\+\/]+=?=?=?)$/,'$1')));
					} catch (e) {}
				}
				
				if(!items) {
					try {
						items = chain[k].parent.$ADP.Registry.getById(id);
					} catch (e) {}
				}
				
				if(items.length) {
					$ADP.Registry.registerParentItems(id, items);
				}
			}
		}
		
		if(windowsInitWithPostMessage && windowsInitWithPostMessage.length) {
			if(window.postMessage) {
			  this.initByPostMessage(id, windowsInitWithPostMessage);
			} else {
			  this.initByWindowName(id, windowsInitWithPostMessage);
			}
		}
		else {
			this.submitPrivacy(id);
		}
	}
  },
  
  initByPostMessage: function(id, windows) {
    for(k in windows) {
	  if(this.data[id].postMessageCounter) {
    	this.data[id].postMessageCounter++;
	  }
      else {
    	this.data[id].postMessageCounter = 1;
      }
      $ADP.Message.send(windows[k].parent, $ADP.Message.types.pullOBA, id);
	}
	
    this.data[id].postMessageTimeout = setTimeout(function () {
  	  $ADP.Registry.submitPrivacy(id);
    }, 1000);	
  },
  
  initByWindowName: function(id, windows) {
	for(k in windows) {
	  if(!windows[k].window.name) return;
	    try {
		  var items = $ADP.Util.JSON.parse($ADP.Util.atob(windows[k].window.name.replace(/^[^-]+\-([A-Za-z0-9\+\/]+=?=?=?)$/,'$1')));
		  if (items.length) {
		    this.registerParentItems(id,items);
		  }
	  } catch(e) {}
	}
	this.submitPrivacy(id);
  },
  
  /**
   * @name $ADP.Registry#submitPrivacy
   * @function
   * @description submit PrivacyInformations to the Player
   * 
   * @param id
   * 
   */
  submitPrivacy: function (id) {
    if(!this.data[id] && !this.data[id].player) return;
    

	if(!this.data[id].player.items || this.data[id].player.items.length) {
	  this.data[id].player.items = this.getItems(id);
	}
    this.data[id].player['showPrivacy'].apply(this.data[id].player,[]);
  },
  
  /**
   * @name
   * @function
   * @description
   * 
   * @param id
   * @param cmd
   * @param args
   * 
   */
  playerCmd: function(id,cmd,args) {
    if(!cmd) return;
    if(!this.data[id] && !this.data[id].player) return;
    if(!args) args=[];
    
    this.data[id].player.items = this.getItems(id);
    
    if (typeof this.data[id].player[cmd] == 'function') {
      this.data[id].player[cmd].apply(this.data[id].player,args);
    }
  },

  /**
   * @private
   * @name   $ADP.Registry#init
   * @function
   * @description The <code>init</code> method is called once the <code>AdPlayer</code> library
   *     has been declared.  This allows events to be registered and functions to be properly
   *     executed once the library has completely loaded.
   */
  init: function () {
	if (window.addEventListener) {
	  window.addEventListener("message", $ADP.Registry.messageHandler, false);
	} else if (window.attachEvent) {
	  window.attachEvent('onmessage', $ADP.Registry.messageHandler);
	}
  }
};

