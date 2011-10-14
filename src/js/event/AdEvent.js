/**
 * @class An AdEvent object is dispatched into the event flow whenever an ad event occurs. 
 * @description The <code>AdPlayer.track()</code> method dispatches an AdEvent object to suscribers.<br/>
 * 
 * @see AdPlayer#track
 * @see AdPlayer#addEventListener
 * 
 * @author christopher.sancho@adtech.com
 * 
 * @property {string - Static Const} INIT The <code>AdEvent.INIT</code> constant defines the value of a initialize event.
 * @property {string - Static Const} LOAD The <code>AdEvent.LOAD</code> constant defines the value of a load event.
 * @property {string - Static Const} REMOVE The <code>AdEvent.REMOVE</code> constant defines the value of a remove event.
 * @property {string - Static Const} SHOW The <code>AdEvent.SHOW constant</code> defines the value of a show event.
 * @property {string - Static Const} HIDE The <code>AdEvent.HIDE constant</code> defines the value of a hide event.
 * @property {string - Static Const} PROGRESS The <code>AdEvent.PROGRESS</code> constant defines the value of a progress event.
 * @property {string - Static Const} TRACK The <code>AdEvent.TRACK</code> constant defines the value of a track event.
 * @property {string - Static Const} COUNT The <code>AdEvent.COUNT</code> constant defines the value of a count event.
 * @property {string - Static Const} CLICK The <code>AdEvent.CLICK</code> constant defines the value of a click event.
 * @property {string - Static Const} PRIVACY_CLICK The <code>AdEvent.PRIVACY_CLICK</code> constant defines the value of a privacy click event.
 * @property {string - Static Const} PRIVACY_OPEN The <code>AdEvent.PRIVACY_CLICK</code> constant defines the value of a privacy open event.
 * @property {string - Static Const} PRIVACY_CLOSE The <code>AdEvent.PRIVACY_CLICK</code> constant defines the value of a privacy close event.
 *
 * @param {string} type The type of <code>AdEvent.EVENT</code> to create.
 * @param {object} data Optional - The object containing information associated with an <code>AdEvent</code> instance.
 *
 * @example
 * var myDomObj = document.getElementById('myTagDivContainer');
 * var adPlayer = new AdPlayer(myDomObj);
 * 
 * // Example 1:
 * // Register countEventHandler() to AdEvent.COUNT event.
 * adPlayer.addEventListener(AdEvent.COUNT, countEventHandler);
 * function countEventHandler(adEvent) {
 *   log('COUNT ad event has been dispatched.');
 * }
 * 
 * // Dispatch AdEvent.COUNT event to listeners.
 * adPlayer.track(new AdEvent(AdEvent.COUNT));
 * 
 * // Example 2:
 * // Dispatch AdEvent.COUNT event to listeners w/ data containing information.
 * adPlayer.addEventListener(AdEvent.COUNT, countEventHandler2);
 * function countEventHandler2(adEvent) {
 *   log('COUNT ad event has been dispatched.');
 *   log('Here is its info:' + adEvent.data.info);
 * }
 * 
 * var data = new Object();
 * data.info = 'This is custome info';
 * adPlayer.track(new AdEvent(AdEvent.COUNT, data));
 * 
 */
function AdEvent(type, data) {
  var _type = '';
  /**
   * @field
   * @description The type of <code>AdEvent.EVENT</code> to create.
   * @returns {string} Returns the <code>AdEvent</code> type.
   * @example
   * // Get reference to property
   * var evtType = adEvent.type();
   * 
   * // Set property's value
   * adEvent.type(AdEvent.LOAD);  
   */
  this.type = function(val){
    if(val) { _type = val; }
    return _type;
  };
  if (type) { _type = type; }
  
  var _currentTarget = {};
  this.currentTarget = function(val){
    if(val) { _currentTarget = val; }
      return _currentTarget;
  };  
  
  var _data = new Object();
  /**
   * @field
   * @description The object containing information associated with an <code>AdEvent</code> instance.
   * @returns {object} Returns an object containing information assoicated with the <code>AdEvent</code> instance.
   * @example
   * // Get reference to property
   * var data = adEvent.data();
   * 
   * // Set property's value
   * var o = new Object();
   * o.hello = "Hello";
   * adEvent.data(o);
   */
  this.data = function(val){
    if(val) { _data = val; }
      return _data;
  };
  if (data) { _data = data; }
  
  var _target;
  /**
   * @field
   * @description The <code>AdPlayer</code> instance associated with the <code>AdEvent</code> object.
   *        <code>player</code> is set when <code>AdPlayer.track()</code> dispatches the <code>AdEvent</code> object insance.
   * @returns {AdPlayer} Returns <code>AdPlayer</code> instance associated with the an <code>AdEvent</code> instance.
   * @example
   * // Get reference to property
   * var adPlayer = adEvent.player();
   * 
   * // Set property's value
   * adEvent.player(adPlayer); 
   */
  this.target = function(val){
    if(val) { _target = val; }
      return _target;
  };
}

/** @private */
var defaultAdEvents = ['INIT', 'LOAD', 'REMOVE', 'SHOW', 'HIDE', 'PROGRESS', 'TRACK', 'COUNT', 'CLICK', 'PRIVACY_CLICK', 'PRIVACY_OPEN', 'PRIVACY_CLOSE'];
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