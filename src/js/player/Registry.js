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
$ADP.Registry = {
  data: {},
  wait: 2000,
  
  header: 'Diese Werbung basiert auf der anonymen Erhebung und Verarbeitung Ihres Nutzungsverhaltens. In der vorliegenden Anzeige werden Nutzungsdaten erhoben bzw. verwendet, um Werbung f&uuml;r Sie zu optimieren. Wenn Sie keine nutzungsbasierte Werbung mehr von den hier gelisteten Anbietern erhalten wollen, k&ouml;nnen Sie die Datenerhebung beim jeweiligen Anbieter direkt deaktivieren, falls sie nicht bereits bei dem/den unten genannten Anbieter(n) einen  Widerspruch vorgenommen haben. Eine Deaktivierung bedeutet aber nicht, dass Sie k&uuml;nftig keine Werbung mehr erhalten, sondern lediglich, dass die Auslieferung der konkreten Kampagne nicht anhand anonym erhobener Nutzungsdaten ausgerichtet ist.',
  footer: 'Wenn Sie mehr &uuml;ber nutzungsbasierte Online-Werbung erfahren wollen, klicken Sie <a href="http://www.youronlinechoices.com/de/" target="_blank">hier</a>. Dort k&ouml;nnen Sie sich dar&uuml;ber hinaus auch bei weiteren Anbietern die Erhebung der Nutzungsinformationen deaktivieren bzw. aktivieren und den Status der Aktivierung bei unterschiedlichen Anbietern <a href="http://meine-cookies.org/cookies_verwalten/praeferenzmanager-beta.html" target="_blank">einsehen</a>.',
  publisherInfo: undefined,

  /**
   * @name $ADP.Registry#register
   * @function
   * @description Registers the privacy item for an AdPlayer chain. 
   * 
   * @param {integer} id The OBA id that is used to identify this player's unique privacy messages 
   * @param {object}  args   The Arguments 
   * @param {string}  args.domId   The domId where the privacy button must be rendered
   * @param {string}  args.title  The name of the privacy party
   * @param {string}  args.text   The short description 
   * @param {string}  args.url    The opt out or more information url
   * @param {string}  args.linkText  The text that should be displayed instead of the link url
   * @param {boolean} args.usePopup  Boolean to display privacy info in a popup 
   * @param {boolean} useUnshift   The unShift variable is set when the item needs to be inserted in
   *     front of the current items, This occurs when one is adding items from a parent Registry object
   *  
   */
  register: function (id, args, useUnshift) {
    if (!args) args = {};
    if (!this.data[id]) {
      this.data[id] = {
        items: []
      };
      this.data[id].timeoutId = setTimeout(function () {
        $ADP.Registry.createPlayer(id, {
          position: 'top-left'
        })
      }, this.wait);
      $ADP.Registry.locateParentRegistry(id);
    }
    var item = {};
    for (var k in args) {
      switch (k) {
        case 'domId':
          this.data[id][k] = args[k]; // last one wins
          break;
        case 'title':
        case 'text':
        case 'url':
        case 'linkText':
        case 'usePopup':
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
    if (this.data[id].timeoutId) clearTimeout(this.data[id].timeoutId);
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
   * @private
   * @name $ADP.Registry#locateParentRegistry
   * @function
   * @description Locates the top most parent registry in the delivery chain.
   */
  locateParentRegistry: function (id) {
    var parentWindow = window.parent,
      data;
    if (parentWindow != window) {
      while (parentWindow != window.top && !parentWindow.$ADP) {
        parentWindow = parentWindow.parent;
      }
      if (!parentWindow.$ADP) { //Non friendly IFrame
        if (!window.postMessage) {
          $ADP.Registry.loadPrivacyItemsFromName(id);
        } else {
          $ADP.Registry.askParentForPrivacyItems(id);
        }
      } else { //Friendly Iframe
        items = parentWindow.$ADP.Registry.getById(id);
        if(items.length) {
          $ADP.Registry.registerParentItems(id, items);
          parentWindow.$ADP.Registry.unregister(id);
        } else {
          $ADP.Registry.loadPrivacyItemsFromName(id);
        }
      }
    }
  },

  /**
   * @private
   * @name $ADP.Registry#askParentForPrivacyItems
   * @function
   * @description Asks the current set target parent for the privacy item associated
   *     with the given Adplayer chain id.
   * 
   * @param id  The Adplayer chain id.
   */
  askParentForPrivacyItems: function (id) {
    if (this.data[id] && !this.data[id].iframeSearch) {
      this.data[id].iframeSearch = {
        target: window.parent
      };
    }
    var obaId = id,
      data = this.data[id],
      target = data.iframeSearch.target;

    $ADP.Message.send(target, $ADP.Message.types.pullOBA, id);
    data.iframeSearch.timeoutId = setTimeout(function () {
      $ADP.Registry.askNextParent(id);
    }, 300);
  },

  /**
   * @private
   * @name $ADP.Registry#askNextParent
   * @function
   * @description Runs after a timeout and will ask the next parent for
   *     privacy items of the given id. if no parent returns the required items then try load privacy information
   *     from the window.name 
   * 
   * @param id  The AdPlayer chain id.
   */
  askNextParent: function (id) {
    if (this.data[id].iframeSearch.target != this.data[id].iframeSearch.target.parent) {
      this.data[id].iframeSearch.target = this.data[id].iframeSearch.target.parent;
      $ADP.Registry.askParentForPrivacyItems(id);
    } else {
      $ADP.Registry.loadPrivacyItemsFromName(id);
    }
  },
  
  /**
   * @private
   * @name  $ADP.Registry#registerParentItems
   * @function
   * @description Adds all the parent privacy items to the beginning of the current items list for
   *     the given id. This will also clear all invoked <code>askNextParent</code> methods that are
   *     currently in progress fir this Adplayer chain id.
   *
   * @param id     The id of the Adplayer chain.
   * @param items  The array of privacy items.
   * 
   * @see $ADP.Registry#askNextParent
   */
  registerParentItems: function (id, items) {
    if (!items) items = [];
    if (!this.data[id]) return;
    if (this.data[id].iframeSearch && this.data[id].iframeSearch.timeoutId) {
      clearTimeout(this.data[id].iframeSearch.timeoutId);
    }
    items.reverse();
    for (var k in items) {
      $ADP.Registry.register(id, items[k], true);
    }
  },
  /**
   * @name $ADP.Registry#loadPrivacyItemsFromName
   * @function
   * @description The fallback method of retrieving the privacy information
   * @param id
   */
  loadPrivacyItemsFromName: function (id) {
    if (!window.name) return;
    try {
      var items = $ADP.Util.JSON.parse($ADP.Util.atob(window.name.replace(/^[^-]+\-([A-Za-z0-9\+\/]+=?=?=?)$/,'$1')));
      if (items.length) {
        this.registerParentItems(id,items);
      }
    } catch(e) {}
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
    var header = this.header;
    var footer = this.footer;
    var publisherInfo = this.publisherInfo || '';
    var domId = args.domId;
    var position = args.position || 'top-right';
    var usePopup = args.usePopup || false;
    if (!this.data[id]) this.data[id]={domId: null, items:[]};
    
    if (this.data[id].timeoutId) clearTimeout(this.data[id].timeoutId);
    if (domId) this.data[id].domId = domId; // last one wins
    domId = this.getDOMId(id);
    
    var items = this.getById(id);
    for (var k in items) {
      if(items[k].usePopup && items[k].usePopup == true) {
        usePopup = true; 
      }
    }

    var player = new $ADP.Player(id, {
      domId: domId,
      position: position,
      header: header,
      footer: footer,
      publisherInfo: publisherInfo,
      items: items,
      usePopup: usePopup
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
          $ADP.Message.send(src, $ADP.Message.types.unRegOBA_ACK, {
            id: msg.data,
            result: result
          });
          break;
        case $ADP.Message.types.pullOBA_ACK:
          if (msg.data.id && msg.data.items && msg.data.items.length) {
            $ADP.Registry.registerParentItems(msg.data.id, msg.data.items);
            $ADP.Message.send(src, $ADP.Message.types.unRegOBA, msg.data.id);
          }
          break;
        case $ADP.Message.types.unRegOBA_ACK:
          break;
      }
    } catch (e) {}
  },
  
  playerCmd: function(id,cmd,args) {
    if(!cmd) return;
    if(!this.data[id] && !this.data[id].player) return;
    if(!args) args=[];
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

