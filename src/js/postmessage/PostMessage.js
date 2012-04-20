/**
 * @name $ADP.PostMessage
 * @class Static class for PostMessage communication.
 * @description Static class for PostMessage communication. Implementation
 *              only supports postMessage for "modern-based" browsers.  No alternate 
 *              communication ability is setup for older browsers at this time using
 *              a data funnel solution similar to postMessage.  Please see the 
 *              <code>apstub.html</code> for other iframe communication techniques.</br>
 * @property {string - Static Const} OUTGOING The <code>$ADP.PostMessage.Outgoing</code> constant defines the value of an 'outgoing' message.
 * @property {string - Static Const} INCOMING The <code>$ADP.PostMessage.Incoming</code> constant defines the value of an 'incoming' message.
 * @property {string - Static Const} FUNCTION The <code>$ADP.PostMessage.Function</code> constant defines the value of a 'function' message.
 * @author christopher.sancho@adtech.com
 */
$ADP.PostMessage = (function () {
  /** @private */ var _this = {};
  /** @private */ var _postMsg;

  _this.OUTGOING = 'ADP_PostMessage.Outgoing';
  _this.INCOMING = 'ADP_PostMessage.Incoming';
  _this.FUNCTION = 'ADP_PostMessage.Function: ';
  
  /**
   * @private
   * @name $ADP.PostMessage#init
   * @function
   * @description Detects whether current window supports postMessage.
   */
  function init() {
    if (typeof(window.postMessage) == typeof(Function)) {
      _postMsg = new $ADP.PostMsgDefault();
    } else {
      _postMsg = new $ADP.AbstractPostMsg();
    }
  }

  /**
   * @name $ADP.PostMessage#send
   * @function
   * @description Stringifies a JSON object and sends it to the appropriate 
   *              PostMessage channel detected at initialization.
   * @param {string} msg JSON string message to send to receiver. 
   * @param {object} target The target receiver to send the message string to.
   * @see $ADP.Util#jsonStringify
   */  
  _this.send = function(obj, target) {
    obj.pmsgid = new Date().getTime(); 
    $ADP.Util.jsonStringify(obj, null, function(msg){
      _postMsg.send(msg, target);
    });
  };
  
  init();
  return _this;
})();