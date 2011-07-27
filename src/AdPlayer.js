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