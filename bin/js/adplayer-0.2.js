/* -----------------------------------------------------------------------------
* AdPlayer v0.2.CONTRIBUTOR.071211
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

/** 
 * @description Logs a message through the console; if available.
 * @param {string} msg The message to log.
 * @param {string} ref Optional - An identifer used to reference the source of a message.
 * 
 * @example
 * // "AdPlayer(God): This is a log output."
 * log('This is a log output', 'God');
 */
log = function(msg, ref) {
  if(typeof(console) !== 'undefined' && console != null) {
    if (ref) {
      console.log('AdPlayer(' + ref + '): ' + msg);
    } else {
      console.log('AdPlayer: ' + msg);
    }
	}
};
/**
* @class Responsible for handling the loading and referencing of a URL request.
* @description A pixel is requested by dynamically generating an <code>img</code>
*              element, which is appended to the document.  After appending is complete,
*              the <code>img</code> element is cleared from the document.
* 
* @author christopher.sancho@adtech.com
* 
* @param {string} url Optional - URL of the pixel to request.
* @property {string} url URL of the pixel to request.
* 
* @example
* var pixelRequest = new URLRequest('http://my.pixel-url.com');
* pixelRequest.load();
* 
* // Alternate
* var pixelRequest2 = new URLRequest();
* pixelRequest2.url = 'http://my.pixel-url.com';
* pixelRequest2.load();
*/
function URLRequest(url) {
  /** @property {string} The URL of the pixel to request. */
  this.url;
  if (url) { this.url = url; }

  /**
   * @description Requests a pixel using the <code>url</code> property. 
   */
  this.load = function() {
    if(this.url) {
      var urlImgReq = document.createElement('img');
      urlImgReq.src = (this.url);
      urlImgReq.style.display = 'none';
      var t = document.getElementsByTagName('script')[0];
      log(this.url, 'URLRequest');
      t.parentNode.insertBefore(urlImgReq, t);

      t.parentNode.removeChild(urlImgReq); // clear
      delete urlImgReq;
      delete t;
    } else {
      log('URLRequest', 'Parameter "url" is not defined.');
    }
  };
}
/**
 * @class Contains reference to a party's ad privacy information.
 * @description Contains reference to a party's ad privacy information.
 * 
 * @see AdPlayer#addPrivacyInfo
 * 
 * @author christopher.sancho@adtech.com
 * 
 * @example
 * var myPrivacyInfo = new PrivacyInfo();
 * myPrivacyInfo.adServer = "MyAdServer";
 * myPrivacyInfo.message = "This is my privacy message.";
 * myPrivacyInfo.url = "http://adplayer.aboutthisad.com";
 */
function PrivacyInfo() {
  /**
   * @description Ad server name.
   * @type String
   */
  this.adServer = '';
  
   /**
    * @description Privacy information message. 
    * @type String
    */
   this.message = '';
   
   /**
    * @description Click-through url of privacy page.
    * @type String - URL
    */
   this.url = '';   
}
/**
 * @class An AdEvent object is dispatched into the event flow whenever an ad event occurs. 
 * @description The <code>AdPlayer.track()</code> method dispatches an AdEvent object to suscribers.<br/>
 * 
 * @see AdPlayer#track
 * @see AdPlayer#addAdEvent
 * 
 * @author christopher.sancho@adtech.com
 * 
 * @property {string - Static Const} LOAD The <code>AdEvent.LOAD</code> constant defines the value of a select event string.
 * @property {string - Static Const} REMOVE The <code>AdEvent.REMOVE</code> constant defines the value of a remove event string.
 * @property {string - Static Const} SHOW The <code>AdEvent.SHOW constant</code> defines the value of a show event string.
 * @property {string - Static Const} HIDE The <code>AdEvent.HIDE constant</code> defines the value of a hide event string.
 * @property {string - Static Const} PROGRESS The <code>AdEvent.PROGRESS</code> constant defines the value of a progress event string.
 * @property {string - Static Const} TRACK The <code>AdEvent.TRACK</code> constant defines the value of a track event string.
 * @property {string - Static Const} COUNT The <code>AdEvent.COUNT</code> constant defines the value of a count event string.
 * @property {string - Static Const} CLICK The <code>AdEvent.CLICK</code> constant defines the value of a click event string.
 * @property {string - Static Const} PRIVACY_CLICK The <code>AdEvent.PRIVACY_CLICK</code> constant defines the value of a privacy click event string.
 * @property {string - Static Const} PRIVACY_OPEN The <code>AdEvent.PRIVACY_CLICK</code> constant defines the value of a privacy open event string.
 * @property {string - Static Const} PRIVACY_CLOSE The <code>AdEvent.PRIVACY_CLICK</code> constant defines the value of a privacy close event string.
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
 * adPlayer.addAdEvent(AdEvent.COUNT, countEventHandler);
 * function countEventHandler(adEvent) {
 *   log('COUNT ad event has been dispatched.');
 * }
 * 
 * // Dispatch AdEvent.COUNT event to listeners.
 * adPlayer.track(new AdEvent(AdEvent.COUNT));
 * 
 * // Example 2:
 * // Dispatch AdEvent.COUNT event to listeners w/ data containing information.
 * adPlayer.addAdEvent(AdEvent.COUNT, countEventHandler2);
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
	
  var _player;
  /**
   * @field
   * @description The <code>AdPlayer</code> instance associated with the <code>AdEvent</code> object.
   * 				<code>player</code> is set when <code>AdPlayer.track()</code> dispatches the <code>AdEvent</code> object insance.
   * @returns {AdPlayer} Returns <code>AdPlayer</code> instance associated with the an <code>AdEvent</code> instance.
   * @example
   * // Get reference to property
   * var adPlayer = adEvent.player();
   * 
   * // Set property's value
   * adEvent.player(adPlayer); 
   */
  this.player = function(val){
	  if(val) { _player = val; }
      return _player;
  };
}

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
/**
 * @class Contains reference to a party's ad privacy information.
 * @description Contains reference to a party's ad privacy information.
 * 
 * @see AdPlayer#addPrivacyInfo
 * 
 * @author christopher.sancho@adtech.com
 * 
 * @example
 * var myPrivacyInfo = new PrivacyInfo();
 * myPrivacyInfo.adServer = "MyAdServer";
 * myPrivacyInfo.message = "This is my privacy message.";
 * myPrivacyInfo.url = "http://adplayer.aboutthisad.com";
 */
function PrivacyInfo() {
  /**
   * @description Ad server name.
   * @type String
   */
  this.adServer = '';
  
   /**
    * @description Privacy information message. 
    * @type String
    */
   this.message = '';
   
   /**
    * @description Click-through url of privacy page.
    * @type String - URL
    */
   this.url = '';   
}
/**
 * @class Main class to be associated with an ad element object. 
 * @description The <code>AdPlayer</code> class.
 * 
 * @author christopher.sancho@adtech.com
 * 
 * @example
 * &lt;div id=&quot;myTagDivContainer&quot;&gt;<br/>  &lt;div&gt;-----TODO----&lt;/div&gt;<br/>  &lt;div&gt;-----TODO----&lt;/div&gt;<br/>&lt;/div&gt;
 * 
 * var myDomObj = document.getElementById('myTagDivContainer');
 * var adPlayer = new AdPlayer(myDomObj);
 */
function AdPlayer(adDomElement) {
  // TODO: check setter values are valid types associated with property.

  var _domObj;
  /**
   * @field
   * @description The associated ad's parent DOM object. 
   * @returns {DOM Object} The associated ad's parent DOM object.
   * @example
   * // Get reference to property
   * var myDomElement = adPlayer.adDomElement();
   * 
   * // Set property's value
   * adPlayer.adDomElement(document.getElementById('myTagDivContainer'));  
   */
  this.adDomElement = function(dom) {
    if(dom) { _domObj = dom; }
    return _domObj;
  };
  _domObj = adDomElement;
  
  var _adEventListObj = new Object();
  /**
   * @field
   * @description The associated ad's event object containg a set of events
   *              registered to an instance of <code>AdPlayer</code>. 
   * @returns {Object - Read Only} Returns an object.
   * @see AdEvent
   * @example
   * // Get reference to property
   * var eventList = adPlayer.adEventListObj();
   */
  this.adEventListObj = function(){
      return _adEventListObj;
  };

  var _isLoaded = false;
  /**
   * @field
   * @description The associated ad's load status, which is usually set by ad or ad delivery code.
   * @returns {Boolean} Returns true or false.
   * @example
   * // Get reference to property
   * var loadStatus = adPlayer.isLoaded();
   * 
   * // Set property's value
   * adPlayer.isLoaded(true);  
   */
  this.isLoaded = function(val){
    if(val) { _isLoaded = val; }
    return _isLoaded;
  };

  var _isPrivacyPanelEnabled = false;
  /**
   * @field
   * @description Determines whether ad choice info button is enabled.
   * @returns {Boolean} Returns true or false.
   * @example
   * // Get reference to property
   * var adChoice = adPlayer.isPrivacyPanelEnabled();
   * 
   * // Set property's value
   * adPlayer.isPrivacyPanelEnabled(true);  
   */
  this.isPrivacyPanelEnabled = function(val){
    _isPrivacyPanelEnabled = val;
    //if(val) { _isPrivacyPanelEnabled = val; }
    return _isPrivacyPanelEnabled;
  };
  
  var _adWidth = null;
  /**
   * @field
   * @description The associated ad's width size, which is usually set by ad or ad delivery code.
   * @returns {Number} Returns a number.
   * @example
   * // Get reference to property
   * var w = adPlayer.adWidth();
   * 
   * // Set property's value
   * adPlayer.adWidth(300);  
   */
  this.adWidth = function(num){
    if(num) { 
      _adWidth = num;
      this.adDomElement().style.width = _adWidth + 'px';
    }
    return _adWidth;
  };
  
  var _adHeight = null;
  /**
   * @field
   * @description The associated ad's height size, which is usually set by ad or ad delivery code.
   * @returns {Number} Returns a number.
   * @example
   * // Get reference to property
   * var w = adPlayer.adHeight();
   * 
   * // Set property's value
   * adPlayer.adHeight(250);  
   */
  this.adHeight = function(num){
    if(num) { 
      _adHeight = num;
      this.adDomElement().style.height = _adHeight + 'px';
    }
    return _adHeight;
  };
  
  var _privacyInfoList = [];
  /**
   * @field
   * @description List that contains instances of <code>PrivacyInfo</code>.  
   * @returns {Array - Read Only} Returns an object.
   * @see AdPlayer#addPrivacyInfo
   * @see PrivacyInfo
   * @example
   * // Get reference to property
   * var privacyList = adPlayer.privacyInfoList();
   */
  this.privacyInfoList = function() {
    // returns a list contain a set of PrivacyInfo objects;
    return _privacyInfoList;
  };
  
  AdPlayerManager.addAdPlayer(this);
};

/** 
 * @description Adds a callback function to an <code>AdEvent</code> flow. Call-back handler function 
 *              must expect a parameter that accepts an <code>AdPlayer</code> instance.
 *              
 * @param adEvent {AdEvent} The <code>AdEvent</code> to listen to.
 * @param callback {Function} The call-back handler to call when an <code>AdEvent</code> is dispatched. 
 * 
 * @see AdEvent
 * @see AdPlayer#track
 * 
 * @example
 * function trackEventHandler(adEvent) {
 *  log(adEvent.type() + ' has been dispatched');
 * }
 * adPlayer.addAdEvent(AdEvent.TRACK, trackEventHandler);
 */
AdPlayer.prototype.addAdEvent = function(adEvent, callback) {
  if (!AdEvent.check(adEvent)) { return; }
  if(!this.adEventListObj()[adEvent]) {
    this.adEventListObj()[adEvent] = [];
  }
  // Check if the callback already exists, if not proceed.
  for (var i = 0; i < this.adEventListObj()[adEvent].length; i++) {
    if (this.adEventListObj()[adEvent][i] == callback ) {
      return;      
    }
  }
  this.adEventListObj()[adEvent].push(callback);
};


/** 
 * @description Removes a callback function registered to an <code>AdEvent</code> flow.
 * @param adEvent {AdEvent} The <code>AdEvent</code> to listen to.
 * @param callback {Function} The call-back handler being called when an <code>AdEvent</code> is dispatched. 
 * 
 * @see AdEvent
 * @see AdPlayer#track
 * 
 * @example
 * function trackEventHandler(adEvent) {
 *  // Remove call-back
 *  adEvent.player().removeAdEvent(AdEvent.TRACK, trackEventHandler);
 *  
 *  log(adEvent.type() + ' has been dispatched');
 * }
 * adPlayer.addAdEvent(AdEvent.TRACK, trackEventHandler); 
 */
AdPlayer.prototype.removeAdEvent = function(adEvent, callback) {
  if (!AdEvent.check(adEvent)) { return; }
  if (this.adEventListObj()[adEvent]) {
    for (var i = 0; i < this.adEventListObj()[adEvent].length; i++) {
      if (this.adEventListObj()[adEvent][i] == callback ) {
        this.adEventListObj()[adEvent].splice(i, 1);
        if (this.adEventListObj()[adEvent].length == 0) {
          delete this.adEventListObj()[adEvent];
        }
        return;      
      }
    }
  }
};

/** 
 * @description A convenience function that adds a pixel URL to an <code>AdEvent</code> flow.  
 *              
 * @param adEvent {AdEvent} The <code>AdEvent</code> to listen to.
 * @param url {String - URL} URL of pixel to call when associated <code>AdEvent</code> is dispatched.
 * @param repeat {Boolean} Optional - Default is 'true.'  If set to 'false,' pixel will only fire once.
 * 
 * @see AdEvent
 * @see AdPlayer#track
 * @see URLRequest#load
 * 
 * @example
 * // Adds a tracking pixel that will dispatch on AdEvent.TRACK event
 * adPlayer.addTrackingPixel(AdEvent.TRACK, 'http://my.pixel.url');
 * 
 * // Adds a tracking pixel that will dispatch only once on AdEvent.TRACK event
 * adPlayer.addTrackingPixel(AdEvent.TRACK, 'http://my.pixel.url', null, false);
 */
AdPlayer.prototype.addTrackingPixel = function(adEvent, url, repeat) {
  if (!AdEvent.check(adEvent)) { return; }
  if (repeat === undefined) { repeat = true; }
  if (url) {
    /** @private */
    function defaultTrackCallBack(evt) {
      var urlReq = new URLRequest(url);
      urlReq.load();
      if(!repeat) {
    	evt.player().removeAdEvent(evt.type(), defaultTrackCallBack);
      }
    }
    defaultTrackCallBack.url = url;
    defaultTrackCallBack.repeat = repeat;
    
    this.addAdEvent(adEvent, defaultTrackCallBack);
  } else {
    log("Parameter 'url' must be defined", "addTrackingEvent");
  }
};

/** 
 * @description Removes a matching <code>url</code> or <code>callback</code> associated with
 *              an <code>AdEvent</code> and registered using <code>addTrackingPixel()</code>
 *              method.
 *              <ul>
 *                <li>If a <code>callback</code> and a <code>url</code> are both defined,
 *                    method will remove the <code>AdEvent</code> associated with the callback.</li>
 *                <li>If only a <code>callback</code> is defined method will remove the
 *                    <code>AdEvent</code> associated with the callback.</li>
 *                <li>If only a <code>url</code> is defined, method will remove all <code>AdEvent</code>
 *                    callbacks containing a matching <code>url</code> property.</li>
 *              </ul>
 *              
 * @param adEvent {AdEvent} The <code>AdEvent</code> to listen to.
 * @param url {String - URL} Optional - URL of pixel to call when associated <code>AdEvent</code> is dispatched.
 * 
 * @see AdEvent
 * @see AdPlayer#addTrackingPixel
 * 
 * @example
 * adPlayer.addTrackingPixel(AdEvent.TRACK, 'http://my.pixel.url');
 * adPlayer.addAdEvent(AdEvent.TRACK, removePixels);
 * 
 * function removePixels(adEvent) {
 *  // Removes url from TRACK event flow.
 *  adPlayer.removeTrackingPixel(AdEvent.TRACK, 'http://my.pixel.url');
 *  
 * }
 */
AdPlayer.prototype.removeTrackingPixel = function(adEvent, url) {
  if (!AdEvent.check(adEvent)) { return; }
  if (this.adEventListObj()[adEvent]) {
    var tmpLen = this.adEventListObj()[adEvent].length;
    var tempLenDiff = 0;
    var index = 0;
    do {
      // Run through loop and remove all tracking that matches url
      if (url) {
        if (this.adEventListObj()[adEvent][index].name == 'defaultTrackCallBack') {
          if (this.adEventListObj()[adEvent][index].url) { // remove all
            if (this.adEventListObj()[adEvent][index].url == url) {
              this.adEventListObj()[adEvent].splice(index, 1);
              if (this.adEventListObj()[adEvent].length == 0) {
                delete this.adEventListObj()[adEvent];
                return;
              }
            }
          }
        }
      }
      
      // check if the temp length has changed
      if(this.adEventListObj()[adEvent]) {
        tempLenDiff = tmpLen-this.adEventListObj()[adEvent].length;
        tmpLen = this.adEventListObj()[adEvent].length;
      } else {
        tmpLen = 0;
      }
      
      // if no difference then proceed to next index
      if (tempLenDiff == 0) {
        index++;
      }
    } while(index < tmpLen);
  }
};

/** 
 * @description Dispatches an <code>AdEvent</code> object to all suscribers.
 *              
 * @param adEventObj {AdEvent} The <code>AdEvent</code> instance to track.
 * @param url {String - URL} Optional - URL of pixel that will be called once with track method.
 * 
 * @example
 * // Dispatches a track event to all suscribers
 * adPlayer.track(new AdEvent(AdEvent.TRACK));
 * 
 * // Dispatches a track event to all suscribers and calls URL once.
 * adPlayer.track(new AdEvent(AdEvent.TRACK), 'http://my.pixel.url');
 */
AdPlayer.prototype.track = function(adEventObj, url) {
  if (!AdEvent.check(adEventObj.type())) { return; }
  log(adEventObj.type(), 'track');
  if (this.adEventListObj()[adEventObj.type()]) {
    var tmpLen = this.adEventListObj()[adEventObj.type()].length;
    var tempLenDiff = 0;
    var index = 0;
    do {
      // call callback
      adEventObj.player(this);
      if (url) {
        adEventObj.data().url = url;
      }
      this.adEventListObj()[adEventObj.type()][index](adEventObj);
      
      // check if the temp length has changed
      if(this.adEventListObj()[adEventObj.type()]) {
        tempLenDiff = tmpLen-this.adEventListObj()[adEventObj.type()].length;
        tmpLen = this.adEventListObj()[adEventObj.type()].length;
      } else {
        tmpLen = 0;
      }
      
      // if no difference then proceed to next index
      if (tempLenDiff == 0) {
        index++;
      }
    } while(index < tmpLen);
  }
  if (url) {
    var urlReq = new URLRequest(url);
    urlReq.load();
  }
};

/** 
 * @description Creates a <code>PrivacyInfo</code> instance and adds it to <code>privacyInfoList</code>
 *              
 * @param adServer {String} Ad server name. 
 * @param message {String} Privacy information message.
 * @param url {String - URL} Click-through url of privacy page.
 * 
 * @see PrivacyInfo
 * @see AdPlayer#privacyInfoList
 * 
 * @example
 * adPlayer.addPrivacyInfo("MyAdServer",  "This is my privacy message.", "http://adplayer.aboutthisad.com");
 */
AdPlayer.prototype.addPrivacyInfo = function(adServer, message, url) {
  var privacyInfo = new PrivacyInfo();
  privacyInfo.adServer = adServer;
  privacyInfo.message = message;
  privacyInfo.url = url;
  this.privacyInfoList().push(privacyInfo);
};

AdPlayer.prototype.privacyClickBtn;

/**
 * @description Enables ad choice info button. Button calls method <code>showPrivacyInfo</code>.
 * 
 * @see AdPlayer#showPrivacyInfo
 * @see PrivacyInfo
*/
AdPlayer.prototype.enableAdChoice = function() {
  if (!this.isPrivacyPanelEnabled()) {
    this.privacyClickBtn = document.createElement('button');
    this.privacyClickBtn.setAttribute('class', 'privacyButton');
    this.privacyClickBtn.innerHTML = 'Get Info';
    this.adDomElement().style.position = "relative";
    this.adDomElement().appendChild(this.privacyClickBtn);
    
    var parentThis = this;
    this.privacyClickBtn.onclick = function() {
      parentThis.showPrivacyInfo();      
    }
  }
};

/**
 * @description Disables ad choice info button. By default, ad choice button is disabled.
 * 
 * @see AdPlayer#enableAdChoice
 * @see PrivacyInfo
*/
AdPlayer.prototype.disableAdChoice = function() {
  if (this.isPrivacyPanelEnabled()) {
    if(this.privacyClickBtn) {
      this.adDomElement().removeChild(this.privacyClickBtn);
    }
  }
};

AdPlayer.prototype.privacyPanel;

/**
 * @description Convenience function that creates a layer that displays the privacy info added to <code>privacyInfoList</code>. <br/>
 *              <code>AdEvent.PRIVACY_CLOSE</code> is dispatched when method is called. <br/>
 *              Layer should be styled to preference using css.
 *              <ul>
 *                <li>.privacyPanel</li>
 *                <li>.privacyPanel ul</li>
 *                <li>.privacyPanel ul li</li>
 *                <li>.privacyPanel button</li>
 *              </ul>
 * 
 * @see AdPlayer#privacyInfoList
 * @see PrivacyInfo
*/
AdPlayer.prototype.showPrivacyInfo = function() {
  if (!this.privacyPanel) {
    this.privacyPanel = document.createElement('div');
    this.privacyPanel.setAttribute('class', 'privacyPanel');
    var privacyPanelList = document.createElement('ul');
    var privacyPanelClose = document.createElement('button');
    var parentThis = this;
    this.privacyPanel.appendChild(privacyPanelList);
    this.privacyPanel.appendChild(privacyPanelClose);
    this.adDomElement().appendChild(this.privacyPanel);
    privacyPanelClose.innerHTML = 'Close';
    for (var i = 0; i < this.privacyInfoList().length; i++) {
      var privacyElement =  document.createElement('li');
      privacyClick = function(url) {
        var data = new Object();
        data.url = url;
        parentThis.track(new AdEvent(AdEvent.PRIVACY_CLICK, data));
        window.open(url);
      }
      privacyElement.innerHTML = this.privacyInfoList()[i].adServer + '<span>'+this.privacyInfoList()[i].message+'<br/><a href="javascript:privacyClick(\''+this.privacyInfoList()[i].url+'\');" target="_self">Opt Out</a></span>';
      privacyPanelList.appendChild(privacyElement);
    }
    this.isPrivacyPanelEnabled(true);
    privacyPanelClose.onclick = function() {
      parentThis.hidePrivacyInfo();      
    };
    this.track(new AdEvent(AdEvent.PRIVACY_OPEN));
  }
};

/**
 * @description Used in conjunction with <code>showPrivacyInfo</code> to remove privacy info layer.<br/>
 *              <code>AdEvent.PRIVACY_CLOSE</code> is dispatched when method is called.
 * 
 * @see AdPlayer#showPrivacyInfo
 * @see PrivacyInfo
*/
AdPlayer.prototype.hidePrivacyInfo = function() {
  if (this.privacyPanel) {
    this.isPrivacyPanelEnabled(false);
    this.adDomElement().removeChild(this.privacyPanel);
    this.privacyPanel = null;
    this.track(new AdEvent(AdEvent.PRIVACY_CLOSE));
  }
};

}