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
*              linkText: 'linkText1'
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
    /**
     * @name $ADP.Registery#register
     * @function
     * @description The register function is used to register the privacy item for an Adplayer chain. 
     * 
     * @param {integer} id     The oba id that is used to identify this adverts unique privacy messages 
     * @param {object}  args   The Arguments 
     * @param {string}  args.domId   The domId where the privacy button must be rendered
     * @param {string}  args.header  The header message to be displayed in the privacy window
     * @param {string}  args.footer  The footer to be displayed in the information window
     * @param {array}   args.items   The array of privacy items 
     * @param {string}  args.items.title  The name of the privacy party
     * @param {string}  args.items.text   The short description 
     * @param {string}  args.items.url    The opt out or more information url
     * @param {string}  args.items.linkText  The text that should be displayed instead of the link url
     * @param {boolean} useUnshift   The unShift variable is set when the item needs to be inserted in front of the current items, This occurs when one is adding items from a parent Registry object
     *  
     */
    register: function(id, args, useUnshift) {
        if (!args) args = {};
        if (!this.data[id]) {
          this.data[id] = {items: []};
          this.data[id].timeoutId = setTimeout(function() {$ADP.Registry.createPlayer(id, {position: 'top-left'})}, this.wait);
          $ADP.Registry.locateParentRegistry(id);
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
        if(!useUnshift) {
          this.data[id].items.push(item);
        } else {
          this.data[id].items.unshift(item);
        }
      },
      
    unregister: function(id) {
        if(!this.data[id]) return;
        if (this.data[id].timeoutId)
          clearTimeout(this.data[id].timeoutId);
        delete this.data[id];
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
    locateParentRegistry: function(id) {
    		var parentWindow = window.parent, data;
    		if(parentWindow != window) {
    			while(parentWindow != window.top && !parentWindow.$ADP) {
    				parentWindow = parentWindow.parent;
    			}
    			if (!parentWindow.$ADP) { //Non friendly IFrame 
    				$ADP.Registry.askParentForPrivacyItems(id); 
    			} else { //Friendly Iframe
    				items = parentWindow.$ADP.Registry.getById(id);
    				$ADP.Registry.registerParentItems(id, items);
    				parentWindow.$ADP.Registry.unregister(id);
    			}
    		}
  	  },
  	  
  	/**
  	 * @name $ADP.Registry#askParentForPrivacyItems
  	 * @function
  	 * @description Will ask the current set target parent for the privacy item associated with the given Adplayer chain id 
  	 * @param id The Adplayer chain id
  	 */
  	askParentForPrivacyItems: function (id) {
  		if (this.data[id] && !this.data[id].iframeSearch) {
  			this.data[id].iframeSearch = { target: window.parent };
  		}
  		var obaId = id, data = this.data[id],target = data.iframeSearch.target; 
  		$ADP.Message.send(target,$ADP.Message.types.pullOBA,id);
  		data.iframeSearch.timeoutId = setTimeout(function() { $ADP.Registry.askNextParent(id);}, 300);
  	},
  	
    /**
     * @name $ADP.Registry#askNextParent
     * @function
     * @description This method is run after a timeout and will ask the next parent for privacy items of the given id. 
     * @param id  The Adplayer chain id
     */
  	askNextParent: function(id) {
  	  if (this.data[id].iframeSearch.target != this.data[id].iframeSearch.target.parent ) {
    	    this.data[id].iframeSearch.target = this.data[id].iframeSearch.target.parent;
    		  $ADP.Registry.askParentForPrivacyItems(id);
  	    }
    	},
    /**
     * @name  $ADP.Regestry#registerParentItems
     * @function
     * @description The register parent items will add all the parent privacy items to the beginning 
     *                of the current items list for the given id. This will also clear the timeout/delayed function
     *                call for asking the next parent for privacy items.
     *                has been found
     * @param id     The id of the Adplayer chain
     * @param items  The array of privacy items
     */	
  	registerParentItems: function (id,items) {
    		if (!items) items = [];
    		if (!this.data[id]) return;
    		if (this.data[id].iframeSearch && this.data[id].iframeSearch.timeoutId) {
    		  clearTimeout(this.data[id].iframeSearch.timeoutId);
    		}
    		items.reverse();
  	    for (var k in items) {
    			$ADP.Registry.register(id,items[k],true);
    		}
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
      },
      
      /**
       * @name    $ADP.Registry#generateId
       * @function
       * @description Generates a new and not used id.<br/><br/>
       *        <b>Note:</b> This method does not register any data at $ADP.Registry.
       * 
       * @returns   {Integer} Returns the generated id.
       */
      generateId: function() {
        var id;
        do {
          id = parseInt(Math.random() * 100000000);
        }
        while(this.hasId(id));
        return id;
      },
      /**
       * @name    $ADP.Registry#messageHandler
       * @function
       * @description This function will handle the pull and unregister requests made from other windows
       * 
       * @param event The window post message event object
       */ 
      messageHandler: function (event) {
        try {
          var msg = $ADP.Message.parse(event.data), src=event.source, result="";
          if (src == window) { return null;}
        
          switch(msg.type) {
            case $ADP.Message.types.pullOBA:
          	  result = $ADP.Registry.getById(msg.data);
          	  $ADP.Message.send(src, $ADP.Message.types.pullOBA_ACK, {id: msg.data, items: result});
          	  break;
            case $ADP.Message.types.unRegOBA:
          	  result = $ADP.Registry.unregister(msg.data);
          	  $ADP.Message.send(src, $ADP.Message.types.unRegOBA_ACK, {id: msg.data, result: result});
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
      /**
       * @name   $ADP.Registry#init
       * @function
       * @description The init method is called once the Adplayer library has been declared 
       *                this allows events to be registered and the execution of functions that
       *                require the complete library to have been declared and loaded.
       */
      init: function() {
        if (window.addEventListener) {
          window.addEventListener("message", $ADP.Registry.messageHandler, false);  
        } else if (window.attachEvent) {
          window.attachEvent('onmessage', $ADP.Registry.messageHandler);
        }
      }
  };

