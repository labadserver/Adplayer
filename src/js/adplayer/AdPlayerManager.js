if (typeof $ADP === 'undefined') {

var $ADP = {};
  
/*@CLASS_INSERTS@*/
  
/**
 * @name $ADP.AdPlayerManager
 * @class Global Static Class - Manages all created <code>$ADP.AdPlayer</code> instances.
 * @description Globally Manages all created <code>$ADP.AdPlayer</code> instances.
 *              <code>$ADP.AdPlayerManager</code> is a singleton class and ensures it
 *              is the only available <code>$ADP.AdPlayerManager</code> throughout an
 *              ad delivery flow.</br>
 * @author christopher.sancho@adtech.com
 */
$ADP.AdPlayerManager = (function () {
  /** @private */ var _this = {};
  /** @private */ var _adPlayerList = [];
  /** @private */ var _callBackList = [];
  /** @private */ var _queue = [];

  /** @private */ function init() {}
  
  /**
   * @name $ADP.AdPlayerManager#list
   * @field
   * @description List that contains instances of <code>$ADP.AdPlayer</code>
   *              added to the manager.  
   * @returns {array - read only} Returns a list list of <code>$ADP.AdPlayer</code> instances.
   * @see $ADP.AdPlayerManager#register
   * @example
   * // Get reference to property
   * var adPlayerList = $ADP.AdPlayerManager.list();
   */
  _this.list = function() {
    return _adPlayerList;
  };

  /**
   * @private
   * @name $ADP.AdPlayerManager#factoryList
   * @field
   * @description Currently used by as universal list for verifying iframe identification incoming post-messaging.  
   * @returns {array - read only} Returns a list of <code>$ADP.PlayerFactory</code> instances.
   */
  var _factoryList = [];
  _this.factoryList = function() {
    return _factoryList;
  };    
  
  /**
   * @private
   * @name $ADP.AdPlayerManager#domIdList
   * @field
   * @description Currently used by as universal list for tracking DOM IDs associated with an AdPlayer.
   * @returns {Array - Read Only} Returns a list of <code>DOM</code> id values.
   */
  var _domIdList = [];
  _this.domIdList = function() {
    return _domIdList;
  }; 
  
  /**
   * @name $ADP.AdPlayerManager#addAdPlayer
   * @function
   * @description Adds an <code>$ADP.AdPlayer</code> instance to the management list.  When a new
   *              <code>$ADP.AdPlayer</code> instance is created, it is automatically passed to
   *              this method.  Immediately following, all call-backs, registerd through
   *              <code>AdPlayerManger.register(adPlayer)</code> are dispatched and passed
   *              with the newly created <code>$ADP.AdPlayer</code>.
   * @param {adplayer} adPlayer <code>$ADP.AdPlayer</code> instance to add to management list.
   * @see AdPlayerManger#register
   * @example
   * // Add an AdPlayer instance to the manager.
   * var adPlayer = new $ADP.AdPlayer(document.getElementById('myTagDivContainer'));
   * $ADP.AdPlayerManager.addAdPlayer(adPlayer);
   */
  _this.addAdPlayer = function(adPlayer) {
    for (var i=0; i < _adPlayerList.length; i++) {
      if (typeof _adPlayerList[i].adDomElement !== 'undefined') {
        if(_adPlayerList[i].adDomElement().id == adPlayer.adDomElement().id) {
          return;
        }
      }
    }
    _adPlayerList.push(adPlayer);
    _dispatchCallBacks(adPlayer);
  };
  
  /**
   * @name $ADP.AdPlayerManager#register
   * @function
   * @description Registers a function that will be called when an <code>$ADP.AdPlayer</code> instance
   *              is created. Call-back handler function must expect a parameter that accepts
   *              an <code>$ADP.AdPlayer</code> instance.
   * @param {function} callback The call-back handler function.
   * @example
   * function myCallBackHandler(adPlayer) {
   *   adPlayer.addPrivacyInfo('AD_SERVER', 'My message goes here.', 'http://adplayer.aboutthisad.com');
   * }
   * $ADP.AdPlayerManager.register(myCallBackHandler);
   */
  _this.register = function(callback) {
    _callBackList.push(callback);
  };
  
  /**
   * @name $ADP.AdPlayerManager#unregister
   * @function
   * @description Un-Registers a function added to the manager list.
   * @param {function} callback The call-back handler function.
   * @example
   * function myCallBackHandler(adPlayer) {
   *   adPlayer.addPrivacyInfo('AD_SERVER', 'My message goes here.', 'http://adplayer.aboutthisad.com');
   * }
   * $ADP.AdPlayerManager.unregister(myCallBackHandler);
   */
  _this.unregister = function(callback) {
    for (var i = 0; i < _callBackList.length; i++) {
      if (_callBackList[i] == callback) {
        _callBackList.shift(i, 1);
        return;
      }
    }
  };
  
  /**
   * @name $ADP.AdPlayerManager#getAdPlayerById
   * @function
   * @description Returns an instance of an <code>$ADP.AdPlayer</code> associated with
   *              a DOM element id name
   * @param {string} id Id of DOM element associated with <code>$ADP.AdPlayer</code>.
   * @return {adplayer} AdPlayer instance associated with id. 
   * @example
   * &lt;div id=&quot;adPlayerContainer&quot;&gt;
   *  &lt;script type=&quot;text/javascript&quot;&gt;
   *    var adPlayer = new $ADP.AdPlayer(document.getElementById('adPlayerContainer'));
   *    adPlayer.addPrivacyInfo('1ST_SERVER', 'My info message.', 'http://adplayer.aboutthisad.com');
   *  &lt;/script&gt;
   * &lt;/div&gt;
   * &lt;script type=&quot;text/javascript&quot;&gt;
   *  var adPlayer = $ADP.AdPlayerManager.getAdPlayerById('adPlayerContainer');
   * &lt;/script&gt;
   */
  _this.getAdPlayerById = function(id) {
    for (var i = 0; i < _adPlayerList.length; i++) {
      if (typeof _adPlayerList[i].adDomElement !== 'undefined') {
        if (_adPlayerList[i].adDomElement().id == id) {
          return _adPlayerList[i];
        }
      } else {
        $ADP.Util.log('DOM element is not properly specified.','getPlayerById');
      }
    }
    return null;
  };

  /**
   * @name $ADP.AdPlayerManager#getPlayerByDomElement
   * @function
   * @description Returns an instance of an <code>$ADP.AdPlayer</code> associated with
   *              a DOM element. 
   * @param {string} dom DOM element object associated with <code>$ADP.AdPlayer</code>.
   * @return {adplayer} AdPlayer instance associated with dom element. 
   * @example
   * &lt;div id=&quot;adPlayerContainer&quot;&gt;
   *  &lt;script type=&quot;text/javascript&quot;&gt;
   *    var adPlayer = new $ADP.AdPlayer(document.getElementById('adPlayerContainer'));
   *    adPlayer.addPrivacyInfo('1ST_SERVER', 'My info message.', 'http://adplayer.aboutthisad.com');
   *  &lt;/script&gt;
   * &lt;/div&gt;
   * &lt;script type=&quot;text/javascript&quot;&gt;
   *  var adPlayer = $ADP.AdPlayerManager.getPlayerByDomElement('adPlayerContainer');
   * &lt;/script&gt;
   */
  _this.getPlayerByDomElement = function(dom) {
    for (var i = 0; i < _adPlayerList.length; i++) {
      if (_adPlayerList[i].adDomElement()) {
        if (_adPlayerList[i].adDomElement() == dom) {
          return _adPlayerList[i];
        }
      } else {
        $ADP.Util.log('DOM element is not properly specified.','getPlayerByDomElement');
      }
    }
    return null;
  };    

  /**
   * @name $ADP.AdPlayerManager#getPlayerByUID
   * @function
   * @description Returns an instance of an <code>$ADP.AdPlayer</code> associated with
   *              a UID string. 
   * @param {string} uid UID string associated with <code>$ADP.AdPlayer</code>.
   * @return {adplayer} AdPlayer instance associated with dom element. 
   * @example
   * 
   */
  _this.getPlayerByUID = function (uid) {
    for (var i = 0; i < _adPlayerList.length; i++) {
      if (_adPlayerList[i].uid()) {
        if (_adPlayerList[i].uid() == uid) {
          return _adPlayerList[i];
        }
      }
    }
    return null;
  };    

  /**
   * @private
   * @description Dispatches all call-back function handlers added to the list.
   */
  function _dispatchCallBacks(adPlayer) {
    var tmpLen = _callBackList.length;
    var tempLenDiff = 0;
    var index = 0;
    do {
      // call callback
      if(typeof _callBackList[index] == 'function') {
        _callBackList[index](adPlayer);
      }
      
      // check if the temp length has changed
      if(_callBackList > 0) {
        tempLenDiff = tmpLen-_callBackList.length;
        tmpLen = _callBackList.length;
      } else {
        tmpLen = 0;
      }
      
      // if no difference then proceed to next index
      if (tempLenDiff == 0) {
        index++;
      }
    } while(index < tmpLen);
  };
  
  init();
  return _this;
})();

}