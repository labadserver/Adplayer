/**
 * @name AdPlayer
 * @class Main class to be associated with an ad element object. 
 * @description The <code>AdPlayer</code> class.
 * 
 * @author christopher.sancho@adtech.com
 * 
 * @example
 * &lt;div id=&quot;ad-container&quot;&gt;
 *   &lt;!-- creative --&gt;
 * &lt;/div&gt;
 * &lt;script type=&quot;text/javascript&quot;&gt;
 *   var adPlayer = new AdPlayer('placement123', 'ad-container');
 * &lt;/script&gt;
 */
var AdPlayer = (function (uid, domId, fnInit, refAdPlayer) {
  /** @private */ var _this = new AbstractPlayer(uid, null);
  /** @private */ var _queue = [];
  
  /**
   * @name AdPlayer#player
   * @field
   * @description Returns a direct reference to the parent AdPlayer within the setup hierarchy.
   * @returns {DOM Object} The direct reference to the parent AdPlayer within the setup hierarchy.
   * @see DefaultPlayer
   * @see IframePlayer
   * @see ReferencePlayer
   * @example
   * // Get reference to property
   * var adPlayerParent = adPlayer.player();  
   */
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
   * var domElement = adPlayer.adDomElement();
   * 
   * // Set property's value
   * domElement.adDomElement(document.getElementById('adplayer-container'));  
   */
  _this.adDomElement = function(dom) {
    return _player.adDomElement(dom);
  };

  /**
   * @name AdPlayer#adEventListObj
   * @field
   * @description The associated ad's event object containing a set of events
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
   * var panelEnabled = adPlayer.isPrivacyPanelEnabled();
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
   * var h = adPlayer.adHeight();
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
   * @description Provides a list containing instances of <code>PrivacyInfo</code> objects added
   *              through <code>addPrivacyInfo</code>.
   * @returns {Array - Read Only} Returns a list of <code>PrivacyInfo</code> objects
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
   * @description Adds a callback function to an <code>AdEvent</code> flow. Callback handler function 
   *              returns an <code>AdEvent</code> object instance, which contains the following:
   *              <ul>
   *                <li><code>data</code> - Object containing any data passed at the time of dispatch.</li>
   *                <li><code>type</code> - The AdEvent type passed at the time if dispatch.</li>
   *                <li><code>target</code> - Reference to the parent AdPlayer within the setup hierarchy.</li>
   *                <li><code>currentTarget</code> - Reference to the current AdPlayer from where the dispatch orignated.</li>
   *              </ul>
   *              
   * @param adEvent {AdEvent} The <code>AdEvent</code> string to listen to.
   * @param callback {Function} The callback handler to call when an <code>AdEvent</code> is dispatched. 
   * 
   * @see AdEvent
   * @see AdPlayer#track
   * 
   * @example
   * function trackEventHandler(adEvent) {
   *  Util.log(adEvent.type() + ' has been dispatched');
   *  Util.log(adEvent.data().message);
   * }
   * adPlayer.addEventListener(AdEvent.TRACK, trackEventHandler);
   * 
   * var data = new Object();
   * data.message = "Hello World!";
   * adPlayer.track(new AdEvent(AdEvent.TRACK, data), trackEventHandler);
   */
  _this.addEventListener = function(adEvent, callback) {
    queueCmd('addEventListener', [adEvent, callback, this]);
  };
  
  /** 
   * @name AdPlayer#removeEventListener
   * @function
   * @description Removes a callback function registered to an <code>AdEvent</code> flow.
   * @param adEvent {AdEvent} The <code>AdEvent</code> to listen to.
   * @param callback {Function} The callback handler being called when an <code>AdEvent</code> is dispatched. 
   * 
   * @see AdEvent
   * @see AdPlayer#track
   * 
   * @example
   * function trackEventHandler(adEvent) {
   *  // Remove callback
   *  adEvent.player().removeEventListener(AdEvent.TRACK, trackEventHandler);
   *  
   *  // Alternate
   *  // adPlayer.removeEventListener(AdEvent.TRACK, trackEventHandler); 
   *  
   *  Util.log(adEvent.type() + ' has been dispatched');
   * }
   * adPlayer.addEventListener(AdEvent.TRACK, trackEventHandler); 
   */  
  _this.removeEventListener = function(adEvent, callback, uidName) {
    queueCmd('removeEventListener', [adEvent, callback, uidName, this]);
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
   * @see PixelRequest#load
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
   * @param urlText {String} Optional - Text to represent the click-through <code>url</code>.  Defaults to "Opt Out"
   * @param enableAdChoice {Boolean} Optional - Specifies whether the privacy panel button should be enabled.
   *                                 Defaults to <code>true</code>.
   * 
   * @see PrivacyInfo
   * @see AdPlayer#privacyInfoList
   * @see AdPlayer#enableAdChoice
   * 
   * @example
   * adPlayer.addPrivacyInfo("MyAdServer",  "This is my privacy message.", "http://adplayer.aboutthisad.com", "Find out more.", true);
   */  
  _this.addPrivacyInfo = function(adServer, message, url, urlText, enableAdChoice) {
    queueCmd('addPrivacyInfo', [adServer, message, url, urlText, enableAdChoice, this]);
  };
  
  /**
   * @name AdPlayer#enableAdChoice
   * @function
   * @description Enables ad choice info button. Button calls method <code>showPrivacyInfo</code>.
   * 
   * @param openBtnTxt {String} Optional - Text displayed when privacy button moused over.  Defaults to "Get Info" 
   * @param closeTxt {String} Optional -  Text used for privacy panel close button.  Defaults to "X"
   * @param headerTxt {String} Optional - Text to append to top of privacy panel.
   * @param footerTxt {String} Optional - Text to append to bottom of privacy panel.
   * @param iconPos {String} Optional - The position of where the ad player button should be setup. 
   *          See <code>setPosition()</code> for acceptable values. 
   *
   * @see AdPlayer#setPosition
   * @see AdPlayer#showPrivacyInfo
   * @see PrivacyInfo
  */  
  _this.enableAdChoice = function(openBtnTxt, closeTxt, headerTxt, footerTxt, iconPos) {
    queueCmd('enableAdChoice', [openBtnTxt, closeTxt, headerTxt, footerTxt, iconPos, this]);
  };

  /**
   * @name AdPlayer#disableAdChoice
   * @function
   * @description Disables ad choice info button. By default, ad choice button is disabled until privacy info
   *              is added through <code>addPrivacyInfo</code>.
   * 
   * @see AdPlayer#enableAdChoice
   * @see AdPlayer#addPrivacyInfo
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
   *              Placement of the privacy panel can be modified by targeting the following css classes:
   *              <ul>
   *                <li>.top-right</li>
   *                <li>.top-right-out</li>
   *                <li>.top-left</li>
   *                <li>.top-left-out</li>
   *                <li>.bottom-right</li>
   *                <li>.bottom-right-out</li>
   *                <li>.bottom-left</li>
   *                <li>.bottom-left-out</li>
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

  /**
   * @name AdPlayer#setPosition
   * @function
   * @description Sets the css position of the adPlayer button and panel.
   *              Acceptable values:
   *              <ul>
   *                <li>top-right</li>
   *                <li>top-right-out</li>
   *                <li>top-left</li>
   *                <li>top-left-out</li>
   *                <li>bottom-right</li>
   *                <li>bottom-right-out</li>
   *                <li>bottom-left</li>
   *                <li>bottom-left-out</li>
   *              </ul>
   *              
   * @param pos {String} The postion to set the AdPlayer button and panel to. Defaults to 'top-right' 
   */ 
  _this.setPosition = function (pos) {
    queueCmd('setPosition', [pos, this]);    
  }

  /** @private */
  function init() {
    var factory  = new PlayerFactory(uid, domId, playerInit, refAdPlayer);
    function playerInit(player) {
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