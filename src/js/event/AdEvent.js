/**
 * @class An $ADP.AdEvent object is dispatched into the event flow whenever an ad event occurs. 
 * @description The <code>$ADP.AdPlayer.track()</code> method dispatches an $ADP.AdEvent object to suscribers.<br/>
 * 
 * @see $ADP.AdPlayer#track
 * @see $ADP.AdPlayer#addEventListener
 * 
 * @author christopher.sancho@adtech.com
 * 
 * @property {string - Static Const} INIT The <code>$ADP.AdEvent.INIT</code> constant defines the value of a initialize event.
 * @property {string - Static Const} LOAD The <code>$ADP.AdEvent.LOAD</code> constant defines the value of a load event.
 * @property {string - Static Const} REMOVE The <code>$ADP.AdEvent.REMOVE</code> constant defines the value of a remove event.
 * @property {string - Static Const} SHOW The <code>$ADP.AdEvent.SHOW constant</code> defines the value of a show event.
 * @property {string - Static Const} HIDE The <code>$ADP.AdEvent.HIDE constant</code> defines the value of a hide event.
 * @property {string - Static Const} PROGRESS The <code>$ADP.AdEvent.PROGRESS</code> constant defines the value of a progress event.
 * @property {string - Static Const} TRACK The <code>$ADP.AdEvent.TRACK</code> constant defines the value of a track event.
 * @property {string - Static Const} COUNT The <code>$ADP.AdEvent.COUNT</code> constant defines the value of a count event.
 * @property {string - Static Const} CLICK The <code>$ADP.AdEvent.CLICK</code> constant defines the value of a click event.
 * @property {string - Static Const} PRIVACY_CLICK The <code>$ADP.AdEvent.PRIVACY_CLICK</code> constant defines the value of a privacy click event.
 * @property {string - Static Const} PRIVACY_OPEN The <code>$ADP.AdEvent.PRIVACY_CLICK</code> constant defines the value of a privacy open event.
 * @property {string - Static Const} PRIVACY_CLOSE The <code>$ADP.AdEvent.PRIVACY_CLICK</code> constant defines the value of a privacy close event.
 *
 * @param {string} type The type of <code>$ADP.AdEvent.EVENT</code> to create.
 * @param {object} data Optional - The object containing information associated with an <code>$ADP.AdEvent</code> instance.
 *
 * @example
 * var myDomObj = document.getElementById('myTagDivContainer');
 * var adPlayer = new $ADP.AdPlayer(myDomObj);
 * 
 * // Example 1:
 * // Register countEventHandler() to $ADP.AdEvent.COUNT event.
 * adPlayer.addEventListener($ADP.AdEvent.COUNT, countEventHandler);
 * function countEventHandler(adEvent) {
 *   $ADP.Util.log('COUNT ad event has been dispatched.');
 * }
 * 
 * // Dispatch $ADP.AdEvent.COUNT event to listeners.
 * adPlayer.track(new $ADP.AdEvent($ADP.AdEvent.COUNT));
 * 
 * // Example 2:
 * // Dispatch $ADP.AdEvent.COUNT event to listeners w/ data containing information.
 * adPlayer.addEventListener($ADP.AdEvent.COUNT, countEventHandler2);
 * function countEventHandler2(adEvent) {
 *   $ADP.Util.log('COUNT ad event has been dispatched.');
 *   $ADP.Util.log('Here is data info:' + adEvent.target().data().info);
 * }
 * 
 * var data = new Object();
 * data.info = 'This is custom info';
 * adPlayer.track(new $ADP.AdEvent($ADP.AdEvent.COUNT, data));
 * 
 */
$ADP.AdEvent = function (type, data) {
  /**
   * @name $ADP.AdEvent#type
   * @field
   * @description The type of <code>$ADP.AdEvent.EVENT</code> to create.
   * @returns {string} Returns the <code>$ADP.AdEvent</code> type.
   * @example
   * // Get reference to property
   * var evtType = adEvent.type();
   * 
   * // Set property's value
   * adEvent.type($ADP.AdEvent.LOAD);  
   */
  var _type = '';
  this.type = function(val){
    if(val) { _type = val; }
    return _type;
  };
  if (type) { _type = type; }
  
  /**
   * @name $ADP.AdEvent#currentTarget 
   * @field
   * @description The current <code>$ADP.AdPlayer</code> instance associated with the <code>$ADP.AdEvent</code> object. The current target
   *           usually refers to the original AdPlayer dispatching the event. 
   *           <code>currentTarget</code> is set when <code>$ADP.AdPlayer.track()</code> dispatches the <code>$ADP.AdEvent</code> object insance. 
   * @returns {adplayer} Returns <code>$ADP.AdPlayer</code> instance associated with the an <code>$ADP.AdEvent</code> instance.
   * @example
   * // Get reference to property
   * var adPlayer = adEvent.currentTarget();
   * 
   * // Set property's value
   * adEvent.currentTarget(adPlayer);
  */
  var _currentTarget = {};
  this.currentTarget = function(val){
    if(val) { _currentTarget = val; }
    return _currentTarget;
  };  
  
  /**
   * @field
   * @description The object containing information associated with an <code>$ADP.AdEvent</code> instance.
   * @returns {object} Returns an object containing information assoicated with the <code>$ADP.AdEvent</code> instance.
   * @example
   * // Get reference to property
   * var data = adEvent.data();
   * 
   * // Set property's value
   * var o = new Object();
   * o.hello = "Hello";
   * adEvent.data(o);
   */
  var _data = new Object();
  this.data = function(val){
    if(val) { _data = val; }
    return _data;
  };
  if (data) { _data = data; }
  
  /**
   * @field
   * @description The <code>$ADP.AdPlayer</code> instance associated with the <code>$ADP.AdEvent</code> object.
   *              <code>target</code> is set when <code>$ADP.AdPlayer.track()</code> dispatches the <code>$ADP.AdEvent</code> object insance.
   * @returns {adplayer} Returns <code>$ADP.AdPlayer</code> instance associated with the an <code>$ADP.AdEvent</code> instance.
   * @example
   * // Get reference to property
   * var adPlayer = adEvent.target();
   * 
   * // Set property's value
   * adEvent.target(adPlayer); 
   */
  var _target;
  this.target = function(val){
    if(val) { _target = val; }
      return _target;
  };
}

/** @private */
$ADP.adEventSetup = (function () {
  /** @private */
  var defaultAdEvents = ['INIT', 'LOAD', 'REMOVE', 'SHOW', 'HIDE', 'PROGRESS', 'TRACK', 'COUNT', 'CLICK', 'PRIVACY_CLICK', 'PRIVACY_OPEN', 'PRIVACY_CLOSE'];
  $ADP.AdEvent.list = new Object();
  
  /**
   * @description Checks if a certain event has been mapped to the <code>$ADP.AdEvent</code> class.
   * @function
   * @param {string} val The string value to check.
   * @returns {Boolean} Returns true or false.
   */
  $ADP.AdEvent.check = function(val) {
    /* Check if an event is valid */
    for (var evt in $ADP.AdEvent.list) {
      if($ADP.AdEvent.list[evt] == val) {
        return true;
      }
    }
    $ADP.Util.log('Ad Event type is not valid: ' + val, '$ADP.AdEvent');
    return false;
  }
  
  /** 
   * @description Dynamically maps a string value to the <code>$ADP.AdEvent</code> class.
   * @function
   * @param {string} val The string value to map.
   */
  $ADP.AdEvent.map = function(val) {
    $ADP.AdEvent.list[val] = '$ADP.AdEvent.' + val;
    $ADP.AdEvent[val] = '$ADP.AdEvent.' + val;
  }
  
  /* Setup default Ad Events */
  for (var dae = 0; dae < defaultAdEvents.length; dae++) {
    $ADP.AdEvent.map(defaultAdEvents[dae]);
  }
})();