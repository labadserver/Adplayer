/**
 * @name $ADP.Message
 * @class
 * @description The <code>$ADP.Message</code> class.
 *
 * @example
 * TODO
 */
$ADP.Message = $ADP.Message || {
  /**
   * @name $ADP.Message#types
   * @field
   * @description Request types used to make requests across other browsers.<br/>
   *     <ul>
   *       <li><code>$ADP.Message.types.nomsg</code> - No message</li>
   *       <li><code>$ADP.Message.types.pullOBA</code> - Request to pull OBA information.</li>
   *       <li><code>$ADP.Message.types.pullOBA_ACK</code> - Return message for OBA information.</li>
   *       <li><code>$ADP.Message.types.unRegOBA</code> - Request to unregister OBA information.</li>
   *       <li><code>$ADP.Message.types.unRegOBA_ACK</code> - Return message for unregister request.</li>
   *     </ul>
   * @type object
   */
  types: {
    nomsg: 'NULL',
    pullOBA: 'ADP.Registry.pullOBA',
    pullOBA_ACK: 'ADP.Registry.pullOBA_ACK',
    unRegOBA: 'ADP.Registry.unRegOBA',
    unRegOBA_ACK: 'ADP.Registry.unRegOBA_ACK'
  },

  /**
   * @private
   * @name $ADP.Message#create
   * @function
   * @description Prepares data for transport by convert to string.
   * 
   * @param type {string}  The type of request to send.
   * @param data {object}  The data object to send.
   * 
   * @return String representation of object.
   * 
   * @see $ADP.Message#types
   */
  create: function (type, data) {
    var msg = {
      type: type,
      data: data
    };
    try {
      if ($ADP.Util.JSON && typeof $ADP.Util.JSON.stringify == 'function') {
        return $ADP.Util.JSON.stringify(msg);
      }
    } catch (e) {}
    return '{"type":"NULL"}';
  },

  /**
   * @private
   * @name $ADP.Message#parse
   * @function
   * @description Parses the data into a an object.
   *   
   * @param data {object}  The data to parse.
   * 
   * @return Object representation of the string message.
   */ 
  parse: function (data) {
    try {
      if ($ADP.Util.JSON && typeof $ADP.Util.JSON.parse == 'function') {
        return $ADP.Util.JSON.parse(data);
      }
    } catch (e) {}
    return $ADP.Message.create('NULL', {});
  },

  /**
   * @name $ADP.Message#send
   * @function
   * @description Sends a message to a target window using <code>postMessage</code>.
   *   
   * @param trgt {window}  The target DOM window to send the message to.
   * @param type {string}  The type of message to send.
   * @param data {object}  The data object to send.
   * 
   * @see $ADP.Message#types
   */
  send: function (trgt, type, data) {
	  try {
		if (trgt && trgt.postMessage) {
		  var msg = $ADP.Message.create(type, data);
		  trgt.postMessage(msg, '*');
		}
	  } catch (e) {}
	}
}

