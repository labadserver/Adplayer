/**
 * @name $ADP.Message
 * @class
 * @description The <code>$ADP.Message</code> class.
 *
 * @example
 * TODO
 */
$ADP.Message = {
  /**
   * @name $ADP.Message#types
   * @field
   * @description  
   */
  types: {
    nomsg: 'NULL',
    pullOBA: 'ADP.Registry.pullOBA',
    pullOBA_ACK: 'ADP.Registry.pullOBA_ACK',
    unRegOBA: 'ADP.Registry.unRegOBA',
    unRegOBA_ACK: 'ADP.Registry.unRegOBA_ACK'
  },

  /**
   * @name $ADP.Message#create
   * @function
   * @param type
   * @param data
   * @description  
   */
  create: function (type, data) {
    var msg = {
      type: type,
      data: data
    };
    try {
      if (JSON && typeof JSON.stringify == 'function') {
        return JSON.stringify(msg);
      }
    } catch (e) {}
    return '{"type":"NULL"}';
  },

  /**
   * @name $ADP.Message#parse
   * @function
   * @param data
   * @description  
   */
  parse: function (data) {
    try {
      if (JSON && typeof JSON.stringify == 'function') {
        return JSON.parse(data);
      }
    } catch (e) {}
    return $ADP.Message.create('NULL', {});
  },

  /**
   * @name $ADP.Message#send
   * @function
   * @param trgt
   * @param typea
   * @param data
   * @description  
   */
  send: function (trgt, type, data) {
    if (trgt && trgt.postMessage) {
      var msg = $ADP.Message.create(type, data);
      trgt.postMessage(msg, '*');
    }
  }
}

