/* -----------------------------------------------------------------------------
* AdPlayer v_@VERSION@_
* 
* Author: christopher.sancho@adtech.com
* ----------------------------------------------------------------------------*/
if (typeof AdPlayerManager === 'undefined') {
  /**
   * @class Global Static Class - Manages all created <code>AdPlayer</code> instances.
   * @description Globally Manages all created <code>AdPlayer</code> instances.
   *              <code>AdPlayerManager</code> is a singleton class and ensures it
   *              is the only available <code>AdPlayerManager</code> throughout a
   *              ad delivery flow.  
   *
   * @author christopher.sancho@adtech.com
   */
  var AdPlayerManager = (function () {
    var _adPlayerList = [];
    var _callBackList = [];
    /**
     * @field
     * @description List that contains instances of <code>AdPlayer</code>
     *              added to the manager.  
     * @returns {Array - Read Only} Returns a list list of <code>AdPlayer</code> instances.
     * @see AdPlayerManager#register
     * @example
     * // Get reference to property
     * var adPlayerList = AdPlayerManager.list();
    */    
    var list = function() {
      return _adPlayerList;
    };    
    
    /**
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
    var addAdPlayer = function(adPlayer) {
      _adPlayerList.push(adPlayer);
      _dispatchCallBacks(adPlayer);
    };
    
    /**
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
    var register = function(callback) {
      _callBackList.push(callback);
    };
    
    /**
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
    var unregister = function(callback) {
      for (var i = 0; i < _callBackList.length; i++) {
        if (_callBackList[i] == callback) {
          _callBackList.shift(i, 1);
          return;
        }
      }
    };
    
    /**
     * @function
     * @description Returns an instance of an <code>AdPlayer</code> associated with
     *              a DOM element. 
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
    var getAdPlayerById = function(id) {
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
     * @function 
     * @description Returns an instance of an <code>AdPlayer</code>. A referral name,
     *              specified by a DOM element, is used as a start point of
     *              a reverse DOM search of a <code>DIV</code> element previously
     *              associated with an <code>AdPlayer</code>.
     *              
     * @param refName {String} Referral id used to mark the start point of a DOM search. 
     * @return {Adplayer} AdPlayer instance associated with id. 
     * 
     * @example
     * &lt;div id=&quot;adPlayerContainer&quot;&gt;
     *  &lt;script type=&quot;text/javascript&quot;&gt;
     *    var adPlayer = new AdPlayer(document.getElementById('adPlayerContainer'));
     *    adPlayer.addPrivacyInfo('1ST_SERVER', 'My info message.', 'http://adplayer.aboutthisad.com');
     *  &lt;/script&gt;
     *  &lt;script type=&quot;text/javascript&quot; id=&quot;adServerTag&quot;&gt;
     *    // Sample third party response
     *    AdPlayerManager.getAdPlayerByRefId("uid", function (adPlayer) {
     *      adPlayer.track(new AdEvent(AdEvent.SHOW));
     *      adPlayer.addPrivacyInfo('3RD_SERVER', 'My info message.', 'http://adplayer.aboutthisad.com');
     *    }); 
     *  &lt;/script&gt;
     * &lt;/div&gt;
     * &lt;script type=&quot;text/javascript&quot;&gt;
     *  // Outputs 1ST_SERVER & 3RD_SERVER info
     *  console.log(adPlayer.privacyInfoList());
     * &lt;/script&gt;
     */
    var getAdPlayerByRefId = function(refName, initCallBack) {
      if(!refName) {
        refName = 'refDiv';
      }
      var uAdId = new Date().getTime();
      var uName = refName + uAdId;
      
      document.write('<span id="'+uName+'" style="display:none;"></span>');
      
      /** @private */
      function refWait(refName, callback) {
        var _interval = setInterval(lookup, 100);
        var _this = this;
        function lookup(tar) {
      	  if (document.getElementById(refName)) {
            console.log('found ===> ' + refName);
      	    clearInterval(_interval);
    	    var par = document.getElementById(refName).parentNode;
            while ((par.nodeName.toLowerCase() != 'div') || !AdPlayerManager.getAdPlayerById(par.id)) {
              par = par.parentNode;
              parName = par.nodeName.toLowerCase();
              if ((parName == 'body') || (parName == 'html')) { break; }
            }
            var adPlayer = AdPlayerManager.getAdPlayerById(par.id);
            if(adPlayer) {
              adPlayer.adDomElement().removeChild(document.getElementById(refName));
              if(callback) {
            	  callback(adPlayer);
              }
              return adPlayer;
            } else {
              log('No AdPlayer found!');
            }      	   
      	  }
        }
      };
      
      if (document.getElementById(uName)) {
        if (document.getElementById(uName)) {
      	    var par = document.getElementById(uName).parentNode;
              while ((par.nodeName.toLowerCase() != 'div') || !AdPlayerManager.getAdPlayerById(par.id)) {
                par = par.parentNode;
                parName = par.nodeName.toLowerCase();
                if ((parName == 'body') || (parName == 'html')) { break; }
              }
              var adPlayer = AdPlayerManager.getAdPlayerById(par.id);
              if(adPlayer) {
                adPlayer.adDomElement().removeChild(document.getElementById(uName));
                if(initCallBack) {
                	initCallBack(adPlayer);
                }
                return adPlayer;
              } else {
                log('No AdPlayer found!');
              }  
        }
      } else {
    	  var refW = refWait(uName, initCallBack);
      }
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
  
    return {
      addAdPlayer: addAdPlayer,
      list: list,
      register: register,
      unregister: unregister,
      getAdPlayerById: getAdPlayerById,
      getAdPlayerByRefId: getAdPlayerByRefId
    };
  })();

/*@CLASS_INSERTS@*/
}