/* -----------------------------------------------------------------------------
* AdPlayer v0.3.1.dev.072711
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

/**
 * @name PrivacyInfo
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
var PrivacyInfo = (function () {
  /** @private */ var _this = {};
  
  /**
   * @name PrivacyInfo#adServer
   * @description Ad server name.
   * @type String
   */
  _this.adServer = '';
  
  /**
   * @name PrivacyInfo#message
   * @description Privacy information message. 
   * @type String
   */
  _this.message = '';
   
  /**
   * @name PrivacyInfo#url
   * @description Click-through url of privacy page.
   * @type String - URL
   */
  _this.url = '';
   
  return _this;
});
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
var URLRequest = (function (url) {
  /** @private */ var _this = {};
  
  /** @property {string} The URL of the pixel to request. */
  _this.url;
  if (url) { _this.url = url; }

  /**
   * @name URLRequest#load
   * @function
   * @description Requests a pixel using the <code>url</code> property. 
   */
   _this.load = function() {
    if(_this.url) {
      var urlImgReq = document.createElement('img');
      urlImgReq.src = (_this.url);
      urlImgReq.style.display = 'none';
      var t = document.getElementsByTagName('script')[0];
      log(_this.url, 'URLRequest');
      t.parentNode.insertBefore(urlImgReq, t);

      t.parentNode.removeChild(urlImgReq); // clear
      delete urlImgReq;
      delete t;
    } else {
      log('URLRequest', 'Parameter "url" is not defined.');
    }
  };
  
  return _this;
});
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
/** @private */
AbstractPlayer = (function(uid, adDomElement) {
  /** @private */ var _this = {};
  
  var _uid;
  _this.uid = function(val) {
    if(val) {
      _uid = val; 
    }
    return _uid;
  };
  _this.uid(uid); 
  
  var _domObj;
  _this.adDomElement = function(dom) {
    if(dom) {
        _domObj = dom; 
    }
    return _domObj;
  };
  _this.adDomElement(adDomElement); 
  
  var _adEventListObj = new Object();
  _this.adEventListObj = function(){
      return _adEventListObj;
  };

  var _isLoaded = false;
  _this.isLoaded = function(val){
    if(val) { _isLoaded = val; }
    return _isLoaded;
  };

  var _isPrivacyPanelEnabled = false;
  _this.isPrivacyPanelEnabled = function(val){
    if(val) { _isPrivacyPanelEnabled = val; }
    return _isPrivacyPanelEnabled;
  };
  
  var _adWidth = null;
  _this.adWidth = function(num){
    if(num) { 
      _adWidth = num;
      this.adDomElement().style.width = _adWidth + 'px';
    }
    return _adWidth;
  };
  
  var _adHeight = null;
  _this.adHeight = function(num){
    if(num) { 
      _adHeight = num;
      this.adDomElement().style.height = _adHeight + 'px';
    }
    return _adHeight;
  };
  
  var _privacyInfoList = [];
  _this.privacyInfoList = function() {
    return _privacyInfoList;
  };
  
  /* Abstract Implementation */
  _this.addEventListener = function(adEvent, callback) {}
  _this.removeEventListener = function(adEvent, callback) {}
  _this.addTrackingPixel = function(adEvent, url, repeat) {}
  _this.removeTrackingPixel = function(adEvent, url) {}
  _this.track = function(adEventObj, url) {}
  _this.addPrivacyInfo = function(adServer, message, url) {}
  _this.enableAdChoice = function() {}
  _this.disableAdChoice = function() {}
  _this.showPrivacyInfo = function() {}
  _this.hidePrivacyInfo = function() {}
  
  return _this;
});
/** @private */
var DefaultPlayer = (function (uid, adDomElement) {
  /** @private */ var _this = new AbstractPlayer(uid, adDomElement);
  
  _this.addEventListener = function(adEvent, callback) {
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

  _this.removeEventListener = function(adEvent, callback) {
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

  _this.addTrackingPixel = function(adEvent, url, repeat) {
    if (!AdEvent.check(adEvent)) { return; }
    if (repeat === undefined) { repeat = true; }
    if (url) {
      /** @private */
      function defaultTrackCallBack(evt) {
        var urlReq = new URLRequest(url);
        urlReq.load();
        if(!repeat) {
        evt.player().removeEventListener(evt.type(), defaultTrackCallBack);
        }
      }
      defaultTrackCallBack.url = url;
      defaultTrackCallBack.repeat = repeat;
      
      this.addEventListener(adEvent, defaultTrackCallBack);
    } else {
      log("Parameter 'url' must be defined", "addTrackingEvent");
    }
  };

  _this.removeTrackingPixel = function(adEvent, url) {
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

  _this.track = function(adEventObj, url, currentPlayer) {
    if (!AdEvent.check(adEventObj.type())) { return; }
    log(adEventObj.type(), 'track');
    if (this.adEventListObj()[adEventObj.type()]) {
      var tmpLen = this.adEventListObj()[adEventObj.type()].length;
      var tempLenDiff = 0;
      var index = 0;
      do {
        // call callback
        adEventObj.target(_this);
        if (currentPlayer) {
          adEventObj.currentTarget(currentPlayer);
        } else {
          adEventObj.currentTarget(currentPlayer);
        }
        
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

  _this.addPrivacyInfo = function(adServer, message, url) {
    var privacyInfo = new PrivacyInfo();
    privacyInfo.adServer = adServer;
    privacyInfo.message = message;
    privacyInfo.url = url;
    this.privacyInfoList().push(privacyInfo);
  };

  _this.privacyClickBtn;

  _this.enableAdChoice = function() {
    if (!this.isPrivacyPanelEnabled()) {
      this.privacyClickBtn = document.createElement('button');
      this.privacyClickBtn.setAttribute('class', 'privacyButton');
      this.privacyClickBtn.setAttribute('className', 'privacyButton'); // IE Fix
      this.privacyClickBtn.innerHTML = 'Get Info';
      this.adDomElement().style.position = "relative";
      this.adDomElement().appendChild(this.privacyClickBtn);
      
      var parentThis = this;
      this.privacyClickBtn.onclick = function() {
        parentThis.showPrivacyInfo();      
      }
    }
  };

  _this.disableAdChoice = function() {
    if (this.isPrivacyPanelEnabled()) {
      if(this.privacyClickBtn) {
        this.adDomElement().removeChild(this.privacyClickBtn);
      }
    }
  };

  _this.privacyPanel;

  _this.showPrivacyInfo = function() {
    if (!this.privacyPanel) {
      this.privacyPanel = document.createElement('div');
      this.privacyPanel.setAttribute('class', 'privacyPanel');
      this.privacyPanel.setAttribute('className', 'privacyPanel'); // IE fix
      var privacyPanelList = document.createElement('ul');
      var privacyPanelClose = document.createElement('button');
      var parentThis = this;
      this.privacyPanel.appendChild(privacyPanelList);
      this.privacyPanel.appendChild(privacyPanelClose);
      this.adDomElement().appendChild(this.privacyPanel);
      privacyPanelClose.innerHTML = 'Close';
      for (var i = 0; i < this.privacyInfoList().length; i++) {
        var privacyElement =  document.createElement('li');
        /** @private */
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

  _this.hidePrivacyInfo = function() {
    if (this.privacyPanel) {
      this.isPrivacyPanelEnabled(false);
      this.adDomElement().removeChild(this.privacyPanel);
      this.privacyPanel = null;
      this.track(new AdEvent(AdEvent.PRIVACY_CLOSE));
    }
  };  
  
  return _this;
});
/** @private */
    /**
     * @private
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
     *    AdPlayerManager.getAdPlayer("uid", function (adPlayer) {
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
var PlayerFactory = (function(uid, domId, adDomElement, fnInit){
  /*
   * CASES:
   * 
   * if DOM object <<<<<<<
   *    - Lookup List if the DOM has a player <<<<<<<
   *      - if yes found in LIST <<<<<<<
   *          set player pass to fnInit <<<<<<<
   *      - if not found in LIST <<<<<<<
   *          Look through DOM page <<<<<<<
   *            - Set Ref OBj for scanning <<<<<<<
   *              - wait for ref obj to load <<<<<<<
   *              - on ref object load... <<<<<<<
   *                - if found in DOM page <<<<<<<
   *                    set player pass to fnInit <<<<<<<
   *                - if not found in DOM page <<<<<<<
   *                    create a new player and pass to fnInit <<<<<<<
   * Else (NO DOM Obj) <<<<<<<
   *    - Look through DOM page
   *            - Set Ref OBj for scanning
   *              - wait for ref obj to load
   *              - on ref object load...
   *                - if found in DOM page
   *                    set player pass to fnInit
   *                - if not found in DOM page
   *                    create a new player and pass to fnInit
   */  
  
  var _isInIFrame = (window.location != window.parent.location) ? true : false;
  if (_isInIFrame) {
    // TODO: If in iFrame - change to FramePlayer 
    fnInit(new DefaultPlayer(uid, adDomElement));
    return;
  }
  
  if (adDomElement) {
    var domPlayer = AdPlayerManager.getPlayerByDomElement(adDomElement);
    if(domPlayer) {
      fnInit(domPlayer);
    } else {
      parentDomSearch(uid, domId, adDomElement, fnInit);
    }
  } else {
    parentDomSearch(uid, domId, adDomElement, fnInit);
  }
  
  function parentDomSearch(uid, domId, adDomElement, fnInit) {
    var uAdId = new Date().getTime();
    
    var dom = document.getElementById(domId);
    if (!dom) {
      log('WARNING: No valid referral element specified for "'+uid+'". Referral will be created using "document.write"', 'parentDomSearch');
      domId = 'ref'+ uAdId;
      document.write('<span id="'+domId+'"></span>');
    }
    
    function refWait(domId, readyFn) {
      var _interval = setInterval(check, 100);
      var _this = this;
      var _timeout = 0;
      function check() {
//      log('finding...'+domId);
        _timeout ++;
        if (_timeout == 100) {
          clearInterval(_interval);
          log('No Valid Ad Player could be found. Creating default...', 'refWait');
          fnInit(new DefaultPlayer(uid, adDomElement));
        }
        if (document.getElementById(domId)) {
//        log('found ===> ' + domId);
          clearInterval(_interval);
          readyFn(domId);
        }
      }
    }    
    
    function searchDom(domId){
      var par = document.getElementById(domId).parentNode;
      while (!AdPlayerManager.getAdPlayerById(par.id)) {
        par = par.parentNode;
        parName = par.nodeName.toLowerCase();
        if ((parName == 'body') || (parName == 'html')) { break; }
      }
      if(par) {
        var adPlayer = AdPlayerManager.getAdPlayerById(par.id);
        if(adPlayer) {
//          adPlayer.adDomElement().removeChild(document.getElementById(domId));
          if(fnInit) {
//          log('Found player at '+adPlayer.adDomElement().id);
            fnInit(adPlayer);
          }  
        } else {
//        log('No AdPlayer found after parent search. Creating new player for '+domId);
          fnInit(new DefaultPlayer(uid, adDomElement));
        }
      }
    }
    
    refWait(domId, searchDom);
  }

});
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
 * @name AdPlayer
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
var AdPlayer = (function (uid, domId, fnInit) {
  
  var adDomElement = document.getElementById(domId);
  /*
  if (document.getElementById(domId)) {
    var adDomElement = document.getElementById(domId);
  } else {
    log('WARNING: No valid referral element specified. Referral will be created using "document.write"', 'AdPlayer');
  }*/

  var _que = [];
  
  /** @private */ var _this = new AbstractPlayer(uid, adDomElement);
  
  var _player;
  _this.player = function() {
    return _player;
  };
  
  /**
   * @name AdPlayer#adDomElement
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
  _this.adDomElement = function(dom) {
    return _player.adDomElement(dom);
  };

  /**
   * @name AdPlayer#adEventListObj
   * @field
   * @description The associated ad's event object containg a set of events
   *              registered to an instance of <code>AdPlayer</code>. 
   * @returns {Object - Read Only} Returns an object.
   * @see AdEvent
   * @example
   * // Get reference to property
   * var eventList = adPlayer.adEventListObj();
   */  
  _this.adEventListObj = function(){
      return _player.adEventListObj();
  };

  /**
   * @name AdPlayer#isLoaded
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
  _this.isLoaded = function(val){
    return _player.isLoaded(val);
  };

  /**
   * @name AdPlayer#isPrivacyPanelEnabled
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
  _this.isPrivacyPanelEnabled = function(val){
    return _player.isPrivacyPanelEnabled(val);
  };

  /**
   * @name AdPlayer#adWidth
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
  _this.adWidth = function(num){
    return _player.adWidth(num);
  };

  /**
   * @name AdPlayer#adHeight
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
  _this.adHeight = function(num){
    return _player.adHeight(num);
  };

  /**
   * @name AdPlayer#privacyInfoList
   * @field
   * @description List that contains instances of <code>PrivacyInfo</code>.  
   * @returns {Array - Read Only} Returns an object.
   * @see AdPlayer#addPrivacyInfo
   * @see PrivacyInfo
   * @example
   * // Get reference to property
   * var privacyList = adPlayer.privacyInfoList();
   */  
  _this.privacyInfoList = function() {
    return _player.privacyInfoList();
  };
  
  /** @private */
  var _queue = [];
  
  // -------------------------------------------------------------------------------------------------
  // METHODS
  // -------------------------------------------------------------------------------------------------
  
  /** @private */
  function queueCmd(fnName, params) {
    if(!_player) {
      _queue.push(wrapFunction(_this[fnName], _this, params));
      return;
    }
    _player[fnName].apply(_this, params);
  }

  /** @private */
  function wrapFunction (fn, context, params) {
    return function() {
        fn.apply(context, params);
    };
  }    
  
  /** 
   * @name AdPlayer#addEventListener
   * @function
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
   * adPlayer.addEventListener(AdEvent.TRACK, trackEventHandler);
   */
  _this.addEventListener = function(adEvent, callback) {
    queueCmd('addEventListener', [adEvent, callback, this]);
  };
  
  /** 
   * @name AdPlayer#removeEventListener
   * @function
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
   *  adEvent.player().removeEventListener(AdEvent.TRACK, trackEventHandler);
   *  
   *  log(adEvent.type() + ' has been dispatched');
   * }
   * adPlayer.addEventListener(AdEvent.TRACK, trackEventHandler); 
   */  
  _this.removeEventListener = function(adEvent, callback) {
    queueCmd('removeEventListener', [adEvent, callback, this]);
  };

  /** 
   * @name AdPlayer#addTrackingPixel
   * @function
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
  _this.addTrackingPixel = function(adEvent, url, repeat) {
    queueCmd('addTrackingPixel', [adEvent, url, repeat, this]);
  };

  /** 
   * @name AdPlayer#removeTrackingPixel
   * @function
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
   * adPlayer.addEventListener(AdEvent.TRACK, removePixels);
   * 
   * function removePixels(adEvent) {
   *  // Removes url from TRACK event flow.
   *  adPlayer.removeTrackingPixel(AdEvent.TRACK, 'http://my.pixel.url');
   *  
   * }
   */  
  _this.removeTrackingPixel = function(adEvent, url) {
    queueCmd('removeTrackingPixel', [adEvent, url, this]);
  };

  /** 
   * @name AdPlayer#track
   * @function
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
  _this.track = function(adEventObj, url) {
    queueCmd('track', [adEventObj, url, this]);
  };

  /** 
   * @name AdPlayer#addPrivacyInfo
   * @function
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
  _this.addPrivacyInfo = function(adServer, message, url) {
    queueCmd('addPrivacyInfo', [adServer, message, url, this]);
  };


  /**
   * @name AdPlayer#enableAdChoice
   * @function
   * @description Enables ad choice info button. Button calls method <code>showPrivacyInfo</code>.
   * 
   * @see AdPlayer#showPrivacyInfo
   * @see PrivacyInfo
  */  
  _this.enableAdChoice = function() {
    queueCmd('enableAdChoice', [this]);
  };

  /**
   * @name AdPlayer#disableAdChoice
   * @function
   * @description Disables ad choice info button. By default, ad choice button is disabled.
   * 
   * @see AdPlayer#enableAdChoice
   * @see PrivacyInfo
  */  
  _this.disableAdChoice = function() {
    queueCmd('disableAdChoice', [this]);
  };
  
  /**
   * @name AdPlayer#showPrivacyInfo
   * @function
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
  _this.showPrivacyInfo = function() {
    queueCmd('showPrivacyInfo', [this]);
  };

  /**
   * @name AdPlayer#hidePrivacyInfo
   * @function
   * @description Used in conjunction with <code>showPrivacyInfo</code> to remove privacy info layer.<br/>
   *              <code>AdEvent.PRIVACY_CLOSE</code> is dispatched when method is called.
   * 
   * @see AdPlayer#showPrivacyInfo
   * @see PrivacyInfo
  */  
  _this.hidePrivacyInfo = function() {
    queueCmd('hidePrivacyInfo', [this]);
  };

  /** @private */
  function init() {
    var factory  = new PlayerFactory(uid, domId, adDomElement, playerIinit);
    function playerIinit(player) {
      _player = player;
      AdPlayerManager.addAdPlayer(_player);

      if (fnInit) {
        fnInit(_this);  
      }
      _player.track(new AdEvent(AdEvent.INIT), null, _this);      
      while (_queue.length > 0) {
        (_queue.shift())();   
      }
    }
  }  
  
  init();
  return _this;
});

}