/**
 * @private
 * @name $ADP.AbstractPostMsg
 * @class Base class for all post method implementations.
 * @description Base class for all post method implementations.
 * 
 * @author christopher.sancho@adtech.com
 */
$ADP.AbstractPostMsg = (function(){
  /** @private */ var _this = {};
  /** @private */ var json;

  /**
   * @name $ADP.AbstractPostMsg#send
   * @function
   * @description Sends a string message to an object using $ADP.PostMessage.
   * @param {string} msg JSON string message to send to receiver. 
   * @param {object} target The target receiver to send the message string to.
   */
  _this.send = function(msg, target) {};
  
  /**
   * @name $ADP.AbstractPostMsg#receive
   * @function
   * @description Targets and passes message to the appropriate receiver.
   * @param {string} evt PostMessage data object.
   */
  _this.receive = function(evt) {};
  return _this;
});