/**
 * @private
 * @name AbstractPostMsg
 * @class Base class for all post method implementations.
 * @description Base class for all post method implementations.
 * 
 * @author christopher.sancho@adtech.com
 */
var AbstractPostMsg = (function(){
  /** @private */ var _this = {};
  /** @private */ var json;

  /**
   * @name AbstractPostMsg#send
   * @function
   * @description Sends a string message to an object using PostMessage.
   * @param {string} msg JSON string message to send to receiver. 
   * @param {object} target The target receiver to send the message string to.
   */  
  _this.send = function(msg, target) {};
  
  /**
   * @name AbstractPostMsg#receive
   * @function
   * @description Targets and passes message to the appropriate receiver.
   * @param {string} evt PostMessage data object.
   */  
  _this.receive = function(evt) {};
  return _this;
});