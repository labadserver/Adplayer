/**
 * @class Static - An AdEvent string is dispatched into the event flow whenever an ad event occurs. 
 * @description The <code>AdPlayer.track()</code> method dispatches an AdEvent string to suscribers.<br/>
 *              TODO:  The dispatching of "AdEvent.EVENT" will dispatch an AdEventObject instead of a string. More details to follow...
 * 
 * @see AdPlayer#track
 * @see AdPlayer#addAdEvent
 * 
 * @author christopher.sancho@adtech.com
 * 
 * @property {string} LOAD The <code>AdEvent.LOAD</code> constant defines the value of a select event string.
 * @property {string} REMOVE The <code>AdEvent.REMOVE</code> constant defines the value of a remove event string.
 * @property {string} SHOW The <code>AdEvent.SHOW constant</code> defines the value of a show event string.
 * @property {string} HIDE The <code>AdEvent.HIDE constant</code> defines the value of a hide event string.
 * @property {string} PROGRESS The <code>AdEvent.PROGRESS</code> constant defines the value of a progress event string.
 * @property {string} TRACK The <code>AdEvent.TRACK</code> constant defines the value of a track event string.
 * @property {string} COUNT The <code>AdEvent.COUNT</code> constant defines the value of a count event string.
 * @property {string} CLICK The <code>AdEvent.CLICK</code> constant defines the value of a click event string.
 * @property {string} PRIVACY_CLICK The <code>AdEvent.PRIVACY_CLICK</code> constant defines the value of a privacy click event string.
 * @property {string} PRIVACY_OPEN The <code>AdEvent.PRIVACY_CLICK</code> constant defines the value of a privacy open event string.
 * @property {string} PRIVACY_CLOSE The <code>AdEvent.PRIVACY_CLICK</code> constant defines the value of a privacy close event string.
 *
 * @example
 * var myDomObj = document.getElementById('myTagDivContainer');
 * var adPlayer = new AdPlayer(myDomObj);
 * 
 * // Register countEventHandler() to AdEvent.COUNT event.
 * adPlayer.addAdEvent(AdEvent.COUNT, countEventHandler);
 * function countEventHandler(adPlayer) {
 *   log('COUNT ad event has been dispatched.');
 * }
 * 
 * // Dispatch AdEvent.COUNT event to listeners.
 * adPlayer.track(AdEvent.COUNT);
 */
var AdEvent = new Object();

/** @private */
var defaultAdEvents = ['LOAD', 'REMOVE', 'SHOW', 'HIDE', 'PROGRESS', 'TRACK', 'COUNT', 'CLICK', 'PRIVACY_CLICK', 'PRIVACY_OPEN', 'PRIVACY_CLOSE'];
AdEvent.list = new Object();

/**
 * @description Checks if a certain event has been mapped to the <code>AdEvent</code> class.
 * @param {string} val The string value to check.
 * @returns {Boolean} Returns true or false.
 */
AdEvent.check = function(val) {
  /* Check if an event is valid */
  for (var evt in AdEvent.list) {
    if(AdEvent.list[evt] == val) {
      return true;
    }
  }
  log('Ad Event type is not valid: ' + val, 'AdEvent');
  return false;
}

/** 
 * @description Dynamically maps a string value to the <code>AdEvent</code> class.
 * @param {string} val The string value to map.
 */
AdEvent.map = function(val) {
  AdEvent.list[val] = 'AdEvent.' + val;
  AdEvent[val] = 'AdEvent.' + val;
}

// Setup default Ad Events
for (var dae = 0; dae < defaultAdEvents.length; dae++) {
  AdEvent.map(defaultAdEvents[dae]);
}