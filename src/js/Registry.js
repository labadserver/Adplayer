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
      },
      
      /**
       * @name		$ADP.Registry#generateId
       * @function
       * @description	Generates a new and not used id.<br/><br/>
       * 				<b>Note:</b> This method does not register any data at $ADP.Registry.
       * 
       * @returns		{Integer} Returns the generated id.
       */
      generateId: function() {
      	var id;
      	do {
      		id = parseInt(Math.random() * 100000000);
      	}
      	while(this.hasId(id));
      	return id;
      }
  };

