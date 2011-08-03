/* -----------------------------------------------------------------------------
* AdPlayer v_@VERSION@_
* 
* Author: christopher.sancho@adtech.com
* ----------------------------------------------------------------------------*/
if (typeof AdPlayerManager === 'undefined') {
  /**
   * @name AdPlayerManager
   * @class Global Static Class - Manages all created <code>AdPlayer</code> instances.
   * @description Globally Manages all created <code>AdPlayer</code> instances.
   *              <code>AdPlayerManager</code> is a singleton class and ensures it
   *              is the only available <code>AdPlayerManager</code> throughout a
   *              ad delivery flow.  
   *
   * @author christopher.sancho@adtech.com
   */
  var AdPlayerManager = (function () {
    /** @private */ var _this = {};
    /** @private */ var _adPlayerList = [];
    /** @private */ var _callBackList = [];
    
    /**
     * @name AdPlayerManager#list
     * @field
     * @description List that contains instances of <code>AdPlayer</code>
     *              added to the manager.  
     * @returns {Array - Read Only} Returns a list list of <code>AdPlayer</code> instances.
     * @see AdPlayerManager#register
     * @example
     * // Get reference to property
     * var adPlayerList = AdPlayerManager.list();
    */    
    _this.list = function() {
      return _adPlayerList;
    };    
    
    /**
     * @name AdPlayerManager#addAdPlayer
     * @function
     * @description Adds an <code>AdPlayer</code> instance to the management list.  When a new
     *              <code>AdPlayer</code> instance is created, it is automatically passed to
     *              this method.  Immediately following, all call-backs, registerd through
     *              <code>AdPlayerManger.register(adPlayer)</code> are dispatched and passed
     *              with the newly created <code>AdPlayer</code>.
     *              
     * @param adPlayer {AdPlayer} <code>AdPlayer</code> instance to add to management list.
     * @see AdPlayerManger#register
     * 
     * @example
     * // Add an AdPlayer instance to the manager.
     * var adPlayer = new AdPlayer(document.getElementById('myTagDivContainer'));
     * AdPlayerManager.addAdPlayer(adPlayer);
    */
    _this.addAdPlayer = function(adPlayer) {
      for (var i=0; i < _adPlayerList.length; i++) {
        if(_adPlayerList[i].adDomElement().id == adPlayer.adDomElement().id) {
          return;
        }
      }
      _adPlayerList.push(adPlayer);
      _dispatchCallBacks(adPlayer);
    };
    
    /**
     * @name AdPlayerManager#register
     * @function
     * @description Registers a function that will be called when an <code>AdPlayer</code> instance
     *              is created. Call-back handler function must expect a parameter that accepts
     *              an <code>AdPlayer</code> instance.
     * 
     * @param callback {function} The call-back handler function.
     * 
     * @example
     * function myCallBackHandler(adPlayer) {
     *   adPlayer.addPrivacyInfo('AD_SERVER', 'My message goes here.', 'http://adplayer.aboutthisad.com');
     * }
     * AdPlayerManager.register(myCallBackHandler);
     */
    _this.register = function(callback) {
      _callBackList.push(callback);
    };
    
    /**
     * @name AdPlayerManager#unregister
     * @function
     * @description Un-Registers a function added to the manager list.
     * 
     * @param callback {function} The call-back handler function.
     * 
     * @example
     * function myCallBackHandler(adPlayer) {
     *   adPlayer.addPrivacyInfo('AD_SERVER', 'My message goes here.', 'http://adplayer.aboutthisad.com');
     * }
     * AdPlayerManager.unregister(myCallBackHandler);
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
     * @name AdPlayerManager#getAdPlayerById
     * @function
     * @description Returns an instance of an <code>AdPlayer</code> associated with
     *              a DOM element id name
     * 
     * @param id {String} Id of DOM element associated with <code>AdPlayer</code>.
     * @return {Adplayer} AdPlayer instance associated with id. 
     * 
     * @example
     * &lt;div id=&quot;adPlayerContainer&quot;&gt;
     *  &lt;script type=&quot;text/javascript&quot;&gt;
     *    var adPlayer = new AdPlayer(document.getElementById('adPlayerContainer'));
     *    adPlayer.addPrivacyInfo('1ST_SERVER', 'My info message.', 'http://adplayer.aboutthisad.com');
     *  &lt;/script&gt;
     * &lt;/div&gt;
     * &lt;script type=&quot;text/javascript&quot;&gt;
     *  var adPlayer = AdPlayerManager.getAdPlayerById('adPlayerContainer');
     * &lt;/script&gt;
     */
    _this.getAdPlayerById = function(id) {
      for (var i = 0; i < _adPlayerList.length; i++) {
        if (_adPlayerList[i].adDomElement()) {
          if (_adPlayerList[i].adDomElement().id == id) {
            return _adPlayerList[i];
          }
        } else {
          log('DOM element is not properly specified.','getPlayerById');
        }
      }
      return null;
    };

    /**
     * @name AdPlayerManager#getPlayerByDomElement
     * @function
     * @description Returns an instance of an <code>AdPlayer</code> associated with
     *              a DOM element. 
     * 
     * @param dom {String} DOM element object associated with <code>AdPlayer</code>.
     * @return {Adplayer} AdPlayer instance associated with dom element. 
     * 
     * @example
     * &lt;div id=&quot;adPlayerContainer&quot;&gt;
     *  &lt;script type=&quot;text/javascript&quot;&gt;
     *    var adPlayer = new AdPlayer(document.getElementById('adPlayerContainer'));
     *    adPlayer.addPrivacyInfo('1ST_SERVER', 'My info message.', 'http://adplayer.aboutthisad.com');
     *  &lt;/script&gt;
     * &lt;/div&gt;
     * &lt;script type=&quot;text/javascript&quot;&gt;
     *  var adPlayer = AdPlayerManager.getPlayerByDomElement('adPlayerContainer');
     * &lt;/script&gt;
     */
    _this.getPlayerByDomElement = function(dom) {
      for (var i = 0; i < _adPlayerList.length; i++) {
        if (_adPlayerList[i].adDomElement()) {
          if (_adPlayerList[i].adDomElement() == dom) {
            return _adPlayerList[i];
          }
        } else {
          log('DOM element is not properly specified.','getPlayerByDomElement');
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
  
    return _this;
  })();

/*@CLASS_INSERTS@*/
}