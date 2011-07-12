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