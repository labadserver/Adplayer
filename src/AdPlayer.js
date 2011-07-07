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
 * function trackEventHandler(adPlayer) {
 *  log('AdEvent.TRACK' has been dispatched');
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
 * function trackEventHandler(adPlayer) {
 *  // Remove call-back
 *  adPlayer.removeAdEvent(AdEvent.TRACK, trackEventHandler);
 *  
 *  log('AdEvent.TRACK' has been dispatched');
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
 * @param callback {Function} Optional - The call-back handler to call when an <code>AdEvent</code> is dispatched.
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
 * 
 * // Adds a tracking pixel, with a call-back, and will dispatch on AdEvent.TRACK event until removed
 * function trackEventHandler(adPlayer) {
 *  log('AdEvent.TRACK' has been dispatched');
 * }
 * adPlayer.addTrackingPixel(AdEvent.TRACK, 'http://my.pixel.url', trackEventHandler);
 * 
 * // Adds a tracking pixel, with a call-back, and will dispatch only once on AdEvent.TRACK event
 * function trackEventHandler(adPlayer) {
 *  log('AdEvent.TRACK' has been dispatched');
 * }
 * adPlayer.addTrackingPixel(AdEvent.TRACK, 'http://my.pixel.url', trackEventHandler, false);
 */
AdPlayer.prototype.addTrackingPixel = function(adEvent, url, callback, repeat) {
  if (!AdEvent.check(adEvent)) { return; }
  if (repeat === undefined) { repeat = true; }
  
  if(callback) {
    this.addAdEvent(adEvent, callback);
  }
  if (url) {
    /** @private */
    defaultTrackCallBack = function(adPlayer) {
      if(adPlayer) {
        var trackingUrl = url;
        var urlReq = new URLRequest(trackingUrl);
        urlReq.load();
        if(!repeat) {
          adPlayer.removeAdEvent(adEvent, defaultTrackCallBack);
        }
      }
      return url;
    }
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
 * @param callback {Function} Optional - The call-back handler to call when an <code>AdEvent</code> is dispatched.
 * 
 * @see AdEvent
 * @see AdPlayer#addTrackingPixel
 * 
 * @example
 * // Adds a tracking pixel, with a call-back, and will dispatch on AdEvent.TRACK event
 * function trackEventHandler(adPlayer) {
 *  // Removes pixel tracking associated with callback
 *  adPlayer.removeTrackingPixel(AdEvent.TRACK, null, trackEventHandler);
 *  
 *  log('AdEvent.TRACK' has been dispatched');
 * }
 * adPlayer.addTrackingPixel(AdEvent.TRACK, 'http://my.pixel.url', trackEventHandler);
 *
 * 
 * // Remove all callbacks associated with pixel url
 * function trackEventHandler1(adPlayer) {
 *  log('AdEvent.TRACK' has been dispatched');
 * }
 * function trackEventHandler2(adPlayer) {
 *  // Removes pixel tracking associated with callback
 *  log('AdEvent.TRACK' has been dispatched');
 * }
 * adPlayer.addTrackingPixel(AdEvent.TRACK, 'http://my.pixel.url', trackEventHandler1);
 * adPlayer.addTrackingPixel(AdEvent.TRACK, 'http://my.pixel.url', trackEventHandler2);
 * 
 * function removePixels() {
 *  // Removes 'trackEventHandler1' and 'trackEventHandler2' from AdEvent.TRACK event flow
 *  adPlayer.removeTrackingPixel(AdEvent.TRACK, 'http://my.pixel.url');
 * }
 * 
 * removePixels();
 */
AdPlayer.prototype.removeTrackingPixel = function(adEvent, url, callback) {
  if (!AdEvent.check(adEvent)) { return; }
  if (this.adEventListObj()[adEvent]) {
    var tmpLen = this.adEventListObj()[adEvent].length;
    var tempLenDiff = 0;
    var index = 0;
    do {
      // Remove if callback matches and stop loop
      if (callback) {
        if (this.adEventListObj()[adEvent][index] == callback ) {
          this.adEventListObj()[adEvent].splice(index, 1);
          if (this.adEventListObj()[adEvent].length == 0) {
            delete this.adEventListObj()[adEvent];
          }
          return; 
        }
      }  
      // Run through loop and remove all tracking that matches url
      if (url) {
        if (this.adEventListObj()[adEvent][index](null)) { // remove all
          if (this.adEventListObj()[adEvent][index](null) == url) {
            this.adEventListObj()[adEvent].splice(index, 1);
            if (this.adEventListObj()[adEvent].length == 0) {
              delete this.adEventListObj()[adEvent];
              return;
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
 * @description Dispatches an <code>AdEvent</code> string to all suscribers.
 *              
 * @param adEvent {AdEvent} The <code>AdEvent</code> to listen to.
 * @param url {String - URL} Optional - URL of pixel that will be called once with track method.
 * 
 * @example
 * // Dispatches a track event to all suscribers
 * adPlayer.track(AdEvent.TRACK);
 * 
 * // Dispatches a track event to all suscribers and calls URL once.
 * adPlayer.track(AdEvent.TRACK, 'http://my.pixel.url');
 */
AdPlayer.prototype.track = function(adEvent, url) {
  if (!AdEvent.check(adEvent)) { return; }
  log(adEvent, 'track');
  if (this.adEventListObj()[adEvent]) {
    var tmpLen = this.adEventListObj()[adEvent].length;
    var tempLenDiff = 0;
    var index = 0;
    do {
      // call callback
      this.adEventListObj()[adEvent][index](this);
      
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
        parentThis.track(AdEvent.PRIVACY_CLICK);
        window.open(url);
      }
      privacyElement.innerHTML = this.privacyInfoList()[i].adServer + '<span>'+this.privacyInfoList()[i].message+'<br/><a href="javascript:privacyClick(\''+this.privacyInfoList()[i].url+'\');" target="_self">Opt Out</a></span>';
      privacyPanelList.appendChild(privacyElement);
    }
    this.isPrivacyPanelEnabled(true);
    privacyPanelClose.onclick = function() {
      parentThis.hidePrivacyInfo();      
    };
    this.track(AdEvent.PRIVACY_OPEN);
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
    this.track(AdEvent.PRIVACY_CLOSE);
  }
};