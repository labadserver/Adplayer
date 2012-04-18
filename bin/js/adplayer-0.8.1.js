/*
   -------------------------------------------------------------------------------------------
   AdPlayer v0.8.1 (dev.041812)
   Author: christopher.sancho@adtech.com, felix.ritter@adtech.com
   -------------------------------------------------------------------------------------------
  
   This file is part of AdPlayer v0.8.1 (dev.041812).
   AdPlayer is free software: you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation, either version 3 of the License, or
   (at your option) any later version.
 
   AdPlayer is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.
 
   You should have received a copy of the GNU General Public License
   along with AdPlayer.  If not, see <http://www.gnu.org/licenses/>.
  
  --------------------------------------------------------------------------------------------
*/
if (typeof $ADP === 'undefined') {

var $ADP = {};
  
/**
 * @name $ADP.Util
 * @class Static class for all common methods.
 * @description The $ADP.Util class provides common methods used across AdPlayer.
 * 
 * @author christopher.sancho@adtech.com, marius.naumann@bauermedia.com
 */
$ADP.Util = (function () {
  /** @private */ var _this = {};
  
  /**
   * @name $ADP.Util#jsonUrl
   * @field
   * @description Location of the external JSON framework script needed for browsers 
   *              that do not natively support JSON. By default, <code>$ADP.Util.jsonUrl</code>
   *              is set to look for the script in a relative path: </code>js/json2.min.js</code>
   * @example
   * // Get reference to property
   * $ADP.Util.log($ADP.Util.jsonUrl);
   * 
   * // Set property's value
   * $ADP.Util.jsonUrl = "http://new.uri.of.json.script";  
   */
  _this.jsonUrl = 'js/json2.min.js';
  
  /**
   * @name $ADP.Util#cssPrefix
   * @field
   * @description Prefix for stylesheet ids and class names to allow unique descriptors.  
   *              By default, <code>$ADP.Util.cssPrefix</code> is set to <code>adplayer</code>.
   * @example
   * // Get reference to property
   * $ADP.Util.log($ADP.Util.cssPrefix);
   * 
   * // Set property's value
   * $ADP.Util.cssPrefix = "anotherPrefix";  
   */
  _this.cssPrefix = 'adplayer';
  
  /**
   * @name $ADP.Util#cssPrefixed
   * @function
   * @description Generates and returns a prefixed version of the given class name. This method uses the
   *              <code>$ADP.Util.cssPrefix</code> property and a dash (-) as delimiter.
   * @param {string} className The original class name without prefix.
   * 
   * @example
   * // Result: 'adplayer-myClassName'
   *  $ADP.Util.cssPrefixed('myClassName');
   */
  _this.cssPrefixed = function(className) {
    return _this.cssPrefix + '-' + className;
  };
  
  /**
   * @name $ADP.Util#isIE
   * @field
   * @description Returns <code>true</code> if browser is Internet Explorer. 
   * @example
   * if ($ADP.Util.isIE) {
   *  $ADP.Util.log('The current browser is Internet Explorer.');
   * }
   */
  _this.isIE  = (navigator.appVersion.indexOf("MSIE") != -1) ? true : false;

  /**
   * @name $ADP.Util#isOpera
   * @field
   * @description Returns <code>true</code> if browser is Opera. 
   * @example
   * if ($ADP.Util.isOpera) {
   *  $ADP.Util.log('The current browser is Opera.');
   * }
   */
  _this.isOpera = (navigator.userAgent.indexOf("Opera") != -1) ? true : false;      

  /**
   * @name $ADP.Util#isFF
   * @field
   * @description Returns <code>true</code> if browser is Firefox. 
   * @example
   * if ($ADP.Util.isFF) {
   *  $ADP.Util.log('The current browser is Firefox.');
   * }
   */  
  _this.isFF = (navigator.userAgent.indexOf("Firefox") != -1) ? true : false;    
  
  /**
   * @name $ADP.Util#log
   * @function
   * @description Logs a message through the console; if available.
   * @param {string} msg The message to log.
   * @param {string} ref Optional - An identifer used to reference the source of a message.
   * @example
   * // "AdPlayer(Parent): This is a log output."
   *  $ADP.Util.log('This is a log output', 'Parent');  
   */
  _this.log = function(msg, ref) {
    if(typeof(console) !== 'undefined' && console != null) {
      if (ref) {
        console.log('AdPlayer(' + ref + '): ' + msg);
      } else {
        console.log('AdPlayer: ' + msg);
      }
    }
  };

  /**
   * @name $ADP.Util#setClassName
   * @function
   * @description Sets a cross-browser compatible class attribute to a DOM object. 
   * @param {dom} domObj DOM object that class attribute will be set. 
   * @param {string} className Value of the class attribute.
   * @example
   * var a = document.getElementById('dom-container');
   * $ADP.Util.setClassName(a, 'ad-container');  
   */ 
  _this.setClassName = function (domObj, className) {
    domObj.setAttribute('class', className);
    if (_this.isIE) { domObj.setAttribute('className', className); } // IE Fix        
  }

  /**
   * @name $ADP.Util#ready
   * @function
   * @description Executes a callback function when an object, being returned in a <code>testFn</code>, is valid.
   * @param {function} testFn Function that returns object to test against. Note: Implemented to avoid use of eval();
   * @param {object} context Context of where <code>readyFn</code> & <code>errorFn</code> are located. 
   * @param {function} readyFn Function called when object being tested returns <code>true</code>.
   * @param {array} readyParams Array of parameters to pass at the time <code>readyFn</code> is called.
   * @param {function} errorFn Function called when object being tested can not be found. 
   *                           Method times out at a count of 100 at 100ms intervals.
   * @param {Array} errorParams Array of parameters to pass at the time <code>errorFn</code> is called.
   * @example
   * function onReady(msg, num) {
   *   $ADP.Util.log(msg + ':' + num);
   * }
   * 
   * function onError(msg) {
   *   $ADP.Util.log(msg);
   * }
   * 
   * $ADP.Util.ready(function(){return testObj;}, this, onReady, ['Hello World!', 100], onError, ['Error...']);
   */
  _this.ready = function(testFn, context, readyFn, readyParams, errorFn, errorParams) {
    function waitTimer(fn, cTxt, rdyFn, rdyPar, errFn, errPar) {
      var _timeout = 0;
      function check() {
        _timeout++;
        if (_timeout == 100) {
          clearInterval(_interval);
          errFn.apply(cTxt, errorParams);
          return;
        }
        if (fn()) {
          clearInterval(_interval);
          rdyFn.apply(cTxt, rdyPar);
          return;
        }
      }
      var _interval = setInterval(check, 100);
    }  
    waitTimer(testFn, context, readyFn, readyParams, errorFn, errorParams);
  }
  
  /** @private List containing IDs of scripts being currently loaded. **/
  var _loadList = [];

  /**
   * @name $ADP.Util#loadScript
   * @function
   * @description Loads an external script & executes a callback function when an object, located in the 
   *              external script & is returned in a <code>testFn</code>, is valid. 
   * @param {string} objId Id used to identify script. Note: Implemented to avoid use of eval();
   * @param {function} objReturnFn  Function that returns object to check against. Note: Implemented to avoid use of eval();
   * @param {url} scriptSrc The url of the script to load.
   * @param {string} callback The handler to be executed when script load is complete.
   * @example
   * $ADP.Util.loadScript('ExtScriptObj', function(){return ExtScriptObj;}, 'http://the.script.url/extobj.js', 
   *   function(){
   *      $ADP.Util.log('External script is done loading.');
   *   }
   * );
   */  
  _this.loadScript = function (objId, objReturnFn, scriptSrc, callback) {
    var jsIntv;
    var obj;

    /** If script is not currently being loaded, attempt to load. **/
    var init = function() {
      if (checkList(objId)) {
        function wait() {
          if(!checkList(objId)) {
            clearInterval(waitIntv);
            setScript();
          }
        }
        var waitIntv = setInterval(wait, 100);
      } else {
        _loadList.push(objId);
        setScript();
      }
    }

    /** Attempts to create script element if object does not exist. **/
    var setScript = function() {
      if(!checkObj()) {
        var js = document.createElement('script');
        js.setAttribute('type', 'text/javascript');
        js.setAttribute('src', scriptSrc);
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(js, s); 
        jsIntv = setInterval(setObj, 100);
      } else {
        setObj();
      } 
    }

    /** Remove from check list executes callback. **/
    var setObj = function() {
      if(checkObj()) {
        clearInterval(jsIntv);
        removeFromList(objId);      
        callback();
      }
    };

    /** Checks if function returns valid object. **/
    var checkObj = function() { 
      try { 
          if(objReturnFn()) {
          return true;
        }
       } catch (e) {
        return false;
       }
    };

    /**
     * Checks loadList for curreent IDs.
     * @param {string} id String ID to check.
     * @return Boolean
     */
     var checkList = function(id) {
       for(var i=0; i < _loadList.length; i++) {
         if (id == _loadList[i]) {
           return true;
         }
       }
       return false;
     };
     
     /**
     * Removes an ID from loadList.
     * @param {string} id The string ID to remove.
     */
     var removeFromList = function(id) {
       for(var i=0; i < _loadList.length; i++) {
         if (id == _loadList[i]) {
           _loadList = _loadList.slice(i, 1);
           return;
         }
       }
     };    
    
    init();
  }

  /**
   * @name $ADP.Util#jsonParse
   * @function
   * @description  Method first checks if JSON is natively available in the browser. If not,
   *               it will attempt to load an external JSON framework script.
   *               Finally it will initialize a callback when a successful parse is complete.
   * @param {string} txt A valid JSON string to parse.
   * @param {function} reviver Function called for every key value from parsed result. 
   * @param {function} rdyFn Callback function called and passed the parsed JSON object. 
   * @see $ADP.Util#jsonUrl
   * @example
   * var str = '{"hello":"world"}';
   * $ADP.Util.jsonParse(str, null, 
   *   function(json) {
   *     $ADP.Util.log(json.hello);
   *   }
   * );
   */  
  _this.jsonParse = function(txt, reviver, rdyFn) {
    function safeCall(txt, reviver, rdyFn) {
      try {
        rdyFn(JSON.parse(txt, reviver));  
      } catch (e) {}
    }
    if(typeof JSON !== 'undefined') {
      safeCall(txt, reviver, rdyFn);
    } else {
      _this.loadScript('JSON', function(){return JSON;}, _this.jsonUrl, 
        function() {
          safeCall(txt, reviver, rdyFn);
        }
      );
    }
  }

  /**
   * @name $ADP.Util#jsonStringify
   * @function
   * @description  Method first checks if JSON is natively available in the browser. If not,
   *               it will attempt to load an external JSON framework script.
   *               Finally it will initialize a callback when a successful stringify is complete.
   * @param {object} obj An object to convert to a JSON string.
   * @param {function} replacer Function called for every object values. 
   * @param {function} rdyFn Callback function called and passed the JSON string. 
   * @see $ADP.Util#jsonUrl
   * @example
   * var obj = new Object();
   * ob.hello = "world";
   * $ADP.Util.jsonStringify(obj, null, 
   *   function(str) {
   *     $ADP.Util.log(str);
   *   }
   * );
   */  
  _this.jsonStringify = function(obj, replacer, rdyFn) {
    if(typeof JSON !== 'undefined') {
       rdyFn(JSON.stringify(obj, replacer));  
    } else {
      _this.loadScript('JSON', function(){return JSON;}, _this.jsonUrl, 
        function() {
           rdyFn(JSON.stringify(obj, replacer));  
        }
      );
    }
  }

  return _this;
})();


/**
 * @private
 * @name $ADP.AbstractPostMsg
 * @class Base class for all post method implementations.
 * @description Base class for all post method implementations.
 * 
 * @author christopher.sancho@adtech.com
 */
$ADP.AbstractPostMsg = (function(){
  /** @private */ var _this = {};
  /** @private */ var json;

  /**
   * @name $ADP.AbstractPostMsg#send
   * @function
   * @description Sends a string message to an object using $ADP.PostMessage.
   * @param {string} msg JSON string message to send to receiver. 
   * @param {object} target The target receiver to send the message string to.
   */
  _this.send = function(msg, target) {};
  
  /**
   * @name $ADP.AbstractPostMsg#receive
   * @function
   * @description Targets and passes message to the appropriate receiver.
   * @param {string} evt PostMessage data object.
   */
  _this.receive = function(evt) {};
  return _this;
});
/**
 * @private
 * @name $ADP.PostMsgDefault
 * @class 
 * @description Handles communication for postMessage supported browsers.
 * @author christopher.sancho@adtech.com
 */
$ADP.PostMsgDefault = (function(){
  /** @private */ var _this = new $ADP.AbstractPostMsg();
  
  /**
   * @private
   * @function 
   * @description Attaches a message listener on initialization.
   */  
  function init() {
    if (window.addEventListener) {  // all browsers except IE before version 9
      window.addEventListener ("message", _this.receive, false);
    }
    else {
      if (window.attachEvent) {   // IE before version 9
        window.attachEvent("onmessage", _this.receive);
      }
    }
  }

  /*
   * Override concrete implementation 
   */
  
  _this.send = function(msg, target) {
    target.postMessage(msg, "*");
  };

  _this.receive = function(evt) {
    $ADP.Util.jsonParse(evt.data, null, function(json){      
      if(json.postType == $ADP.PostMessage.OUTGOING) {
        for (var i=0; i < document.getElementsByTagName('iframe').length; i++){
          if(document.getElementsByTagName('iframe')[i].contentWindow == evt.source) {
            var iframe = document.getElementsByTagName('iframe')[i];
            $ADP.PostMessageHandler.domRefPlayerWait(iframe, json);          
            break;
          }      
        }
      } else if (json.postType == $ADP.PostMessage.INCOMING){
        $ADP.PostMessageHandler.inMsgHandler(json)
      }      
    });
  };
  

  init();
  return _this;
});
/**
 * @private
 * @name $ADP.PostMessageHandler
 * @class 
 * @description Handles both incoming and outgoing messages from <code>$ADP.PostMessage</code>.
 * @author christopher.sancho@adtech.com
 */
$ADP.PostMessageHandler = (function () {
  /** @private */ var _this = {};

  /**
   * @name $ADP.PostMessageHandler#domRefPlayerWait
   * @function
   * @description Waits for DOM element to become available and then determines if iframe
   *              verification is needed or message can be processed.
   * @param {dom} dom DOM object this needs to be checked.
   * @param {object} json JSON object to check or pass through.
   */
  _this.domRefPlayerWait = function (dom, json) {
    _this.dom = dom;
    _this.json = json;
    
    function iframeVerify(dom, json) {
      var obj = new Object();
      obj.postType = $ADP.PostMessage.INCOMING;
      obj.uid = json.uid;
      obj.fn = 'iframePlayerVerify';      
      var player = _this.getPlayerByDomSearch(dom);
      if (player) {
        if (json.fn == "iframePlayerVerify") {
          obj.params = true;
          $ADP.PostMessage.send(obj, dom.contentWindow);   
          return;
        }
        readyTest(dom, json, player);
      } else {
        obj.params = false;
        $ADP.PostMessage.send(obj, dom.contentWindow);          
      }
    }
    function iframeVerifyErr() {
      $ADP.Util.log('Could not verify a parent iframe AdPlayer.');
    }
    $ADP.Util.ready(function(){return _this.dom;}, this, iframeVerify, [_this.dom, _this.json], iframeVerifyErr, null);
  }

  /**
   * @name $ADP.PostMessageHandler#getPlayerByDomSearch
   * @function
   * @description Attempts to locate a parent AdPlayer from a DOM reference point.
   * @param {dom} dom DOM object that needs to be checked.
   */
  _this.getPlayerByDomSearch = function (dom) {
    var par = dom.parentNode;
    while (!$ADP.AdPlayerManager.getAdPlayerById(par.id)) {
      par = par.parentNode;
      parName = par.nodeName.toLowerCase();
      if ((parName == 'body') || (parName == 'html')) { break; }
    }
    if(par) {
      var adPlayer = $ADP.AdPlayerManager.getAdPlayerById(par.id);
      if(adPlayer) {
        $ADP.Util.log('Found player at '+adPlayer.adDomElement().id);
          return(adPlayer);
      } else {
        $ADP.Util.log('No AdPlayer found after parent search for "' + dom.id + '."');
        return null;
      }
    }     
  }    

  /**
   * @name $ADP.PostMessageHandler#readyTest
   * @function
   * @description Parses JSON object and executes requests.
   * @param {dom} iframe Target iframe to communicate with.
   * @param {object} json JSON object.
   * @param {adplayer} player Current AdPlayer.
   */
  function readyTest(iframe, json, player) {
    if (player) {
      var params = json.params.split(',');
      for (var t=0; t < params.length; t++) {
        // Checks if it contains a function, which is needs to be properly wrapped and send off
        switch (json.fn){
          case 'addEventListener':
            if (unescape(params[t]).match($ADP.PostMessage.FUNCTION)) {
              var funcN = unescape(params[t]).slice($ADP.PostMessage.FUNCTION.length);
              function funcMe (evt) {
                var obj = new Object();
                obj.postType = $ADP.PostMessage.INCOMING;
                obj.uid = json.uid;
                obj.fn = funcN;
                obj.evtType = evt.type();
                obj.uidName = json.uidName;
                $ADP.PostMessage.send(obj, iframe.contentWindow);
              }
              funcMe.uidName = json.uidName;
              params[t] = funcMe;
            }
            break;
        }
      }
      
      switch (json.fn){
        case 'removeEventListener':
            params.push(json.uidName.toString());
          break;
        case 'track':
          adEvtObj = new $ADP.AdEvent(params[0]);
          adEvtObj.target(player);
          adEvtObj.currentTarget(player);
          player.track(new $ADP.AdEvent(params[0]), params[1]);
          return;
          break;
      }

      player[json.fn].apply(player, params);
    }
  }      
  
  /**
   * @name $ADP.PostMessageHandler#inMsgHandler
   * @function
   * @description Handles specific incoming messages.
   * @param {object} json JSON object evaluate.
   */
  _this.inMsgHandler = function (json) {
    switch (json.fn){
      case 'iframePlayerVerify':
        var factoryPlayer; 
        for (var i = 0; i < $ADP.AdPlayerManager.factoryList().length; i++) {
          if ($ADP.AdPlayerManager.factoryList()[i].uid() == json.uid) {
            factoryPlayer = $ADP.AdPlayerManager.factoryList()[i];
            break;
          }
        }
        if (factoryPlayer) {
          factoryPlayer.setIframePlayerType(json);
        }
        return;
      break;      
      case 'defaultTrackCallBack':
      break;
    default: 
      var func = (new Function( "return( " + json.fn + " );" ))();
      var player = $ADP.AdPlayerManager.getPlayerByUID(json.uid);  
      // Need to target the current player and send back
      if (player) {
        var event = new $ADP.AdEvent(json.evtType);
        event.target(player);
        func(event);
      }
      break;
    }
  }
  
  return _this;
})();
/**
 * @name $ADP.PostMessage
 * @class Static class for PostMessage communication.
 * @description Static class for PostMessage communication. Implementation
 *              only supports postMessage for "modern-based" browsers.  No alternate 
 *              communication ability is setup for older browsers at this time using
 *              a data funnel solution similar to postMessage.  Please see the 
 *              <code>apstub.html</code> for other iframe communication techniques.</br>
 * @property {string - Static Const} OUTGOING The <code>$ADP.PostMessage.Outgoing</code> constant defines the value of an 'outgoing' message.
 * @property {string - Static Const} INCOMING The <code>$ADP.PostMessage.Incoming</code> constant defines the value of an 'incoming' message.
 * @property {string - Static Const} FUNCTION The <code>$ADP.PostMessage.Function</code> constant defines the value of a 'function' message.
 * @author christopher.sancho@adtech.com
 */
$ADP.PostMessage = (function () {
  /** @private */ var _this = {};
  /** @private */ var _postMsg;

  _this.OUTGOING = 'PostMessage.Outgoing';
  _this.INCOMING = 'PostMessage.Incoming';
  _this.FUNCTION = 'PostMessage.Function: ';
  
  /**
   * @private
   * @name $ADP.PostMessage#init
   * @function
   * @description Detects whether current window supports postMessage.
   */
  function init() {
    if (typeof(window.postMessage) == typeof(Function)) {
      _postMsg = new $ADP.PostMsgDefault();
    } else {
      _postMsg = new $ADP.AbstractPostMsg();
    }
  }

  /**
   * @name $ADP.PostMessage#send
   * @function
   * @description Stringifies a JSON object and sends it to the appropriate 
   *              PostMessage channel detected at initialization.
   * @param {string} msg JSON string message to send to receiver. 
   * @param {object} target The target receiver to send the message string to.
   * @see $ADP.Util#jsonStringify
   */  
  _this.send = function(obj, target) {
    obj.pmsgid = new Date().getTime(); 
    $ADP.Util.jsonStringify(obj, null, function(msg){
      _postMsg.send(msg, target);
    });
  };
  
  init();
  return _this;
})();
/**
 * @private
 * @name $ADP.PrivacyInfoButton
 * @class 
 * @description Handles display of privacy information button for current <code>$ADP.AdPlayer</code> instance.
 * @param {function} callback Function to execute when button is clicked.
 * @param {string} openBtnTxt Optional - Text to use for button.
 * @author christopher.sancho@adtech.com
 */
$ADP.PrivacyInfoButton = (function (callback, openBtnTxt) {
  /** @private */ var _this = {};
  /** @private */ var _openBtnIcon;
  /** @private */ var _openBtnTxtObj;
  /** @private */ var _privBtnClassName = 'privacyButton';

  /**
   * @name $ADP.PrivacyInfoButton#button
   * @field
   * @description DOM object of current privacy button.
   * @example
   */ 
  _this.button;
  
  /**
   * @name $ADP.PrivacyInfoButton#openBtnTxt
   * @field 
   * @description 
   * @param {string} val
   * @example
   * // Get reference to property
   * var txt = privacyButton.openBtnTxt();
   * 
   * // Set property's value
   * privacyButton.openBtnTxt('Open');  
   */ 
  var _openBtnTxt = 'Get Info';
  _this.openBtnTxt = function(val) {
    if(val) {
      _openBtnTxt = val;
      if (_openBtnTxtObj) {
        _openBtnTxtObj.innerHTML = _openBtnTxt;
      }
    }
    return _openBtnTxt;
  } 

  /**
   * @private
   * @function
   * @description Creates DOM elements along with its attributes.  
   */
  function init() {
    _this.openBtnTxt(openBtnTxt);
    
    _this.button = document.createElement('div');
    $ADP.Util.setClassName(_this.button, $ADP.Util.cssPrefixed(_privBtnClassName));
    
    _openBtnIcon = document.createElement('div');
    $ADP.Util.setClassName(_openBtnIcon, $ADP.Util.cssPrefixed('icon'));
    _this.button.appendChild(_openBtnIcon);
    
    _openBtnTxtObj = document.createElement('div');
    $ADP.Util.setClassName(_openBtnTxtObj, $ADP.Util.cssPrefixed('text'));
    _openBtnTxtObj.style.display = "none";
    _this.button.appendChild(_openBtnTxtObj);
    _openBtnTxtObj.innerHTML = _this.openBtnTxt();
       
    _this.button.onclick = callback;
    
    _openBtnIcon.onmouseover = function() {
      _openBtnTxtObj.style.display = "block";
    };
    _openBtnIcon.onmouseout = function() {
      _openBtnTxtObj.style.display = "none";
    };
  }

  /**
   * @name $ADP.PrivacyInfoButton#setPosition
   * @function
   * @description Sets the position of the button relative to its parent DOM element.
   * @param {string} pos Position where to set panel.</br>  
   *                 Valid values:
   *                 <ul>
   *                   <li>top-left</li>
   *                   <li>top-right</li>
   *                   <li>top-left-out</li>
   *                   <li>top-right-out</li>
   *                   <li>bottom-left</li>
   *                   <li>bottom-right</li>
   *                   <li>bottom-left-out</li>
   *                   <li>bottom-right-out</li>
   *                 </ul>
   */
  _this.setPosition = function (pos) {
    _this.button.setAttribute('style', '');
    _openBtnIcon.setAttribute('style', '');
    _openBtnTxtObj.setAttribute('style', 'display: none;');
    
    _this.button.style.position = "absolute";
    _this.button.style.zIndex = "99999999";
    _openBtnIcon.style.position = "absolute";
    _openBtnTxtObj.style.position = "absolute";
    _openBtnTxtObj.style.fontSize = "12px";
    _openBtnTxtObj.style.fontWeight = "bold";
    _openBtnTxtObj.style.width = "100px";
    
    switch (pos) {
      case "bottom-left-out":
        _this.button.style.bottom = "0px";
        _this.button.style.left = "0px";
        
        _openBtnIcon.style.left = "0px";
        _openBtnIcon.style.top = "0px";        
        
        _openBtnTxtObj.style.left = "16px";
        _openBtnTxtObj.style.top = "3px";
        _openBtnTxtObj.style.textAlign = "left";
      break;
      case "bottom-left":
        _this.button.style.bottom = "20px";
        _this.button.style.left = "0px";
        
        _openBtnIcon.style.left = "0px";
        _openBtnIcon.style.top = "0px";        
        
        _openBtnTxtObj.style.left = "16px";
        _openBtnTxtObj.style.top = "3px";
        _openBtnTxtObj.style.textAlign = "left";
        break;
      case "bottom-right-out":
        _this.button.style.bottom = "0px";
        _this.button.style.right = "0px";
        
        _openBtnIcon.style.right = "0px";
        _openBtnIcon.style.top = "0px";
        
        _openBtnTxtObj.style.right = "20px";
        _openBtnTxtObj.style.top = "3px";
        _openBtnTxtObj.style.textAlign = "right";
        break;        
      case "bottom-right":
        _this.button.style.bottom = "20px";
        _this.button.style.right = "0px";
        
        _openBtnIcon.style.right = "0px";
        _openBtnIcon.style.top = "0px";
        
        _openBtnTxtObj.style.right = "20px";
        _openBtnTxtObj.style.top = "3px";
        _openBtnTxtObj.style.textAlign = "right";
        break; 
      case "top-right-out":
        _this.button.style.top = "-20px";
        _this.button.style.right = "0px";
        
        _openBtnIcon.style.right = "0px";
        _openBtnIcon.style.top = "0px";
        
        _openBtnTxtObj.style.right = "20px";
        _openBtnTxtObj.style.top = "3px";
        _openBtnTxtObj.style.textAlign = "right";   
        break;
      case "top-right":
        _this.button.style.top = "0px";
        _this.button.style.right = "0px";
        
        _openBtnIcon.style.right = "0px";
        _openBtnIcon.style.top = "0px";
        
        _openBtnTxtObj.style.right = "20px";
        _openBtnTxtObj.style.top = "3px";
        _openBtnTxtObj.style.textAlign = "right";
        break;
      case "top-left-out":
        _this.button.style.top = "-20px";
        _this.button.style.left = "0px";
        
        _openBtnIcon.style.left = "0px";
        _openBtnIcon.style.top = "0px";        
        
        _openBtnTxtObj.style.left = "16px";
        _openBtnTxtObj.style.top = "3px";
        _openBtnTxtObj.style.textAlign = "left";    
        break;
      default: // top-left
        _this.button.style.top = "0px";
        _this.button.style.left = "0px";
        
        _openBtnIcon.style.left = "0px";
        _openBtnIcon.style.top = "0px";        
        
        _openBtnTxtObj.style.left = "16px";
        _openBtnTxtObj.style.top = "3px";
        _openBtnTxtObj.style.textAlign = "left";
        break;
    }
    
    $ADP.Util.setClassName(_this.button, $ADP.Util.cssPrefixed(_privBtnClassName) + ' ' + $ADP.Util.cssPrefixed(pos));
  }    
  
  init();
  return _this;
});
/**
 * @private
 * @name $ADP.PrivacyPanel
 * @class 
 * @description Handles display of all privacy information passed to current <code>$ADP.AdPlayer</code> instance.
 * @param {array} infoList List containing <code>$ADP.PrivacyInfo</code> objects. 
 * @param {string} closeTxt Optional - Close button text. 'X' is default value.
 * @param {string} headerTxt Optional - Header text.
 * @param {string} footerTxt Optional - Footer text.
 * @param {string} closeCallback Function to call when close button is clicked.
 * @param {string} trackCallback Function to call when link is clicked.  <code>trackCallback</code> passes an
 *                  a new <code>Advent.PRIVACY_CLICK</code> instance.
 * @see $ADP.PrivacyInfo
 * @see $ADP.AdEvent
 * @author christopher.sancho@adtech.com
 */
$ADP.PrivacyPanel = (function (infoList, closeCallback, trackCallback, closeTxt, headerTxt, footerTxt) {
  /** @private */ var _this = {};
  /** @private */ var _listObj;
  /** @private */ var _infoList;
  /** @private */ var _privPanelClassName = 'privacyPanel';
  
  /**
   * @name $ADP.PrivacyPanel#panel
   * @field
   * @description DOM object of current privacy panel.
   * @example
   */ 
  _this.panel;
  
  /**
   * @name $ADP.PrivacyPanel#infoList
   * @field
   * @description List containing <code>$ADP.PrivacyInfo</code> objects. 
   * @param {string} val List to set, which contains <code>$ADP.PrivacyInfo</code> objects.
   * @example
   * // Get reference to property
   * var infoList = $ADP.PrivacyPanel.infoList();
   * 
   * // Set property's value
   * privacyPanel.infoList(objList);  
   */ 
  _this.infoList = function(val) {
    if(val) {
      _infoList = val;
      if (_listObj) {
      _listObj.innerHTML = '';
        for (var i = 0; i < _infoList.length; i++) {
          addPrivacyInfo(_infoList[i]);
        }
      }
    }
    return _infoList;    
  }

 /**
  * @name PrivacyPanel#closeTxt
  * @field
  * @description Close button text. 'X' is default value. 
  * @param {string} val Close button text.
  * @example
  * // Get reference to property
  * var txt = privacyPanel.closeTxt();
  * 
  * // Set property's value
  * privacyPanel.closeTxt('Close');  
  */
  var _closeTxtObj;
  var _closeTxt = 'X';
    _this.closeTxt = function(val) {
    if(val) {
      _closeTxt = val;
      if (_closeTxt != '') {
        _closeTxtObj.innerHTML = _closeTxt;
      }
    }
    return _closeTxt;
  }  

  /**
   * @name $ADP.PrivacyPanel#headerTxt
   * @field
   * @description Header text positioned above ad privacy list. 
   * @param {string} val Header text.
   * @example
   * // Get reference to property
   * var txt = privacyPanel.headerTxt();
   * 
   * // Set property's value
   * privacyPanel.headerTxt('Hello world!');  
   */
  var _headerTxtObj;
  var _headerTxt = '';
    _this.headerTxt = function(val) {
    if(val) {
      _headerTxt = val;
      if (_headerTxtObj) {
        _headerTxtObj.innerHTML = _headerTxt;
        if (_headerTxt != '') {
          if (!checkPanel('div', $ADP.Util.cssPrefixed('header'))) {
            if (_listObj) {
              _this.panel.insertBefore(_headerTxtObj, _listObj);  
            } else {
              _this.panel.appendChild(_headerTxtObj);
            }
          }
        }
      }
    }
    return _headerTxt;
  }
  
  /**
   * @name $ADP.PrivacyPanel#footerTxt
   * @field
   * @description Footer text positioned below ad privacy list. 
   * @param {string} val Footer text.
   * @example
   * // Get reference to property
   * var txt = privacyPanel.footerTxt();
   * 
   * // Set property's value
   * privacyPanel.footerTxt('Hello world!');  
   */
  var _footerTxtObj;
  var _footerTxt = '';
    _this.footerTxt = function(val) {
    if(val) {
      _footerTxt = val;
      if (_footerTxtObj) {
        _footerTxtObj.innerHTML = _footerTxt;
        if (_footerTxt != '') {
          if (!checkPanel('div', $ADP.Util.cssPrefixed('footer'))) {
            _this.panel.appendChild(_footerTxtObj);
          }
        }
      }
    }
    return _headerTxt;
  }  
  
  /**
   * @private
   * @function
   * @description Creates DOM elements along with its attributes.  
   */
  function init() {
    _this.panel = document.createElement('div');
    $ADP.Util.setClassName(_this.panel, $ADP.Util.cssPrefixed(_privPanelClassName));
    
    _closeTxtObj = document.createElement('div');
    $ADP.Util.setClassName(_closeTxtObj, $ADP.Util.cssPrefixed('close'));
    _closeTxtObj.innerHTML = _this.closeTxt(closeTxt);
    _closeTxtObj.onclick = closeCallback;
    _this.panel.appendChild(_closeTxtObj);
    
    _headerTxtObj = document.createElement('div');
    $ADP.Util.setClassName(_headerTxtObj, $ADP.Util.cssPrefixed('header'));
    _this.headerTxt(headerTxt);

    _listObj = document.createElement('ul');
    $ADP.Util.setClassName(_listObj, $ADP.Util.cssPrefixed('privacyInfoList'));
    _this.panel.appendChild(_listObj);
    _this.infoList(infoList);
    
    _footerTxtObj = document.createElement('div');
    $ADP.Util.setClassName(_footerTxtObj, $ADP.Util.cssPrefixed('footer'));
    _this.footerTxt(footerTxt);
  }
  
  /**
   * @name $ADP.PrivacyPanel#addPrivacyInfo
   * @function
   * @description Adds <code>PrivacyInfo</code> to privacy DOM panel.
   * @param {object} privacyInfoObj <code>PrivacyInfo</code> object.
   * @see $ADP.PrivacyInfo
   */
  function addPrivacyInfo(privacyInfoObj) {
    var privacyObj =  document.createElement('li');
    privacyObj.setAttribute('class', $ADP.Util.cssPrefixed('privacyItem'));
    if ($ADP.Util.isIE) { privacyObj.setAttribute('className', $ADP.Util.cssPrefixed('privacyItem')); } // IE Fix        
    privacyClick = function(url) {
      var data = new Object();
      data.url = url;
      trackCallback(new $ADP.AdEvent($ADP.AdEvent.PRIVACY_CLICK, data));
      window.open(url);          
    }
    privacyObj.innerHTML = '<h4 class="' + $ADP.Util.cssPrefixed('privacyItemHeader') + '">' + privacyInfoObj.adServer + '</h4><p class="' + $ADP.Util.cssPrefixed('privacyItemInfo') + '">' + privacyInfoObj.message+'</p><p class="' + $ADP.Util.cssPrefixed('privacyItemLinkOuter') + '"><a class="'+ $ADP.Util.cssPrefixed('privacyItemLink')+'" href="javascript:privacyClick(\''+privacyInfoObj.url+'\');" target="_self">'+privacyInfoObj.urlText+'</a></p>';
    _listObj.appendChild(privacyObj);
  }
  
  /**
   * @name $ADP.PrivacyPanel#checkPanel
   * @function
   * @description Checks if panel contains a certain element with a defined class name.
   * @param {string} tagName DOM element.
   * @param {className} Class name.
   */
  function checkPanel(tagName, className) {
    for (var i = 0; i < _this.panel.getElementsByTagName(tagName).length; i++) {
      if (_this.panel.getElementsByTagName(tagName)[i].className == className){
        return _this.panel.getElementsByTagName(tagName)[i];
      }
    }
    return null;
  }
  
  /**
   * @name $ADP.PrivacyPanel#setPosition
   * @function
   * @description Sets the position of the panel relative to its parent DOM element.
   * @param {string} pos Position where to set panel.</br>  
   *                 Valid values:
   *                 <ul>
   *                   <li>top-left</li>
   *                   <li>top-right</li>
   *                   <li>top-left-out</li>
   *                   <li>top-right-out</li>
   *                   <li>bottom-left</li>
   *                   <li>bottom-right</li>
   *                   <li>bottom-left-out</li>
   *                   <li>bottom-right-out</li>
   *                 </ul>
   */
  _this.setPosition = function (pos) {
    $ADP.Util.setClassName(_this.panel, $ADP.Util.cssPrefixed(_privPanelClassName) + ' ' + $ADP.Util.cssPrefixed(pos));
  }    
    
  
  init();
  return _this;
});
/**
 * @name $ADP.PrivacyInfo
 * @class Contains reference to a party's ad privacy information.
 * @description Contains reference to a party's ad privacy information.
 * 
 * @see $ADP.AdPlayer#addPrivacyInfo
 * 
 * @author christopher.sancho@adtech.com
 * 
 * @example
 * var myPrivacyInfo = new $ADP.PrivacyInfo();
 * myPrivacyInfo.adServer = "MyAdServer";
 * myPrivacyInfo.message = "This is my privacy message.";
 * myPrivacyInfo.url = "http://adplayer.aboutthisad.com";
 */
$ADP.PrivacyInfo = (function () {
  /** @private */ var _this = {};
  
  /**
   * @name $ADP.PrivacyInfo#adServer
   * @description Ad server name.
   * @type String
   */
  _this.adServer = '';
  
  /**
   * @name $ADP.PrivacyInfo#message
   * @description Privacy information message. 
   * @type String
   */
  _this.message = '';
   
  /**
   * @name $ADP.PrivacyInfo#url
   * @description Click-through url of privacy page.
   * @type String - URL
   */
  _this.url = '';
  
  /**
   * @name $ADP.PrivacyInfo#urlText
   * @description Text for click-through url of privacy page.
   * @type String
   */
  _this.urlText = '';  
   
  return _this;
});
/**
* @class Responsible for handling the loading and referencing of a pixel request.
* @description Responsible for handling the loading and referencing of a pixel request.
* @author christopher.sancho@adtech.com
* @param {string} url Optional - URL of the pixel to request.
* @property {string} url URL of the pixel to request.
* @example
* var pixelRequest = new $ADP.PixelRequest('http://my.pixel-url.com');
* pixelRequest.load();
* 
* // Alternate
* var pixelRequest2 = new $ADP.PixelRequest();
* pixelRequest2.url = 'http://my.pixel-url.com';
* pixelRequest2.load();
*/
$ADP.PixelRequest = (function (url) {
  /** @private */ var _this = {};
  
  /** @property {string} The URL of the pixel to request. */
  _this.url;
  if (url) { _this.url = url; }

  /**
   * @name $ADP.PixelRequest#load
   * @function
   * @description Requests a pixel using the <code>url</code> property.
   */
   _this.load = function() {
    if(_this.url) {
      var urlImgReq = new Image();
      urlImgReq.src = _this.url;
      $ADP.Util.log(_this.url, '$ADP.PixelRequest');
    } else {
      $ADP.Util.log('$ADP.PixelRequest', 'Parameter "url" is not defined.');
    }
  };
  
  return _this;
});
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
/**
 * @private
 * @name $ADP.AbstractPlayer
 * @class Base class for all ad player types.
 * @description Base class for all ad player types.
 * 
 * @author christopher.sancho@adtech.com
 */
$ADP.AbstractPlayer = (function(uid, adDomElement) {
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
    if(val === true) { _isLoaded = val; }
    return _isLoaded;
  };

  var _isPrivacyPanelEnabled = false;
  _this.isPrivacyPanelEnabled = function(val){
    if(val === true) { _isPrivacyPanelEnabled = val; }
    return _isPrivacyPanelEnabled;
  };
  
  var _isAdChoiceEnabled = true;
  _this.isAdChoiceEnabled = function(val){
    if(val === false) { _isAdChoiceEnabled = val; }
    return _isAdChoiceEnabled;
  };  
  
  var _adWidth = null;
  _this.adWidth = function(num){
    if(num && !isNan(num)) { 
      _adWidth = num;
      this.adDomElement().style.width = _adWidth;
    }
    return _adWidth;
  };
  
  var _adHeight = null;
  _this.adHeight = function(num){
    if(num && !isNan(num)) { 
      _adHeight = num;
      this.adDomElement().style.height = _adHeight;
    }
    return _adHeight;
  };
  
  var _privacyInfoList = [];
  _this.privacyInfoList = function() {
    return _privacyInfoList;
  };
  
  /* Abstract Implementation */
  _this.addEventListener = function(adEvent, callback) {}
  _this.removeEventListener = function(adEvent, callback, uidName) {}
  _this.addTrackingPixel = function(adEvent, url, repeat) {}
  _this.removeTrackingPixel = function(adEvent, url) {}
  _this.track = function(adEventObj, url) {}
  _this.addPrivacyInfo = function(adServer, message, url, urlText, enableAdChoice) {}
  _this.enableAdChoice = function(openBtnTxt, closeTxt, headerTxt, footerTxt, iconPos)  {}
  _this.disableAdChoice = function() {}
  _this.showPrivacyInfo = function() {}
  _this.hidePrivacyInfo = function() {}
  _this.setPosition = function (pos) {}
  
  return _this;
});
/**
 * @private 
 * @name $ADP.DefaultPlayer
 * @class Default <code>$ADP.AdPlayer</code> implementation.
 * 
 * @author christopher.sancho@adtech.com
 */
$ADP.DefaultPlayer = (function (uid, adDomElement) {
  /** @private */ var _this = new $ADP.AbstractPlayer(uid, adDomElement);
  
  /*
   * Override concrete implementation 
   */  
  
  _this.addEventListener = function(adEvent, callback) {
    if (!$ADP.AdEvent.check(adEvent)) { return; }
    if(!_this.adEventListObj()[adEvent]) {
      _this.adEventListObj()[adEvent] = [];
    }
    // Check if the callback already exists, if not proceed.
    for (var i = 0; i < _this.adEventListObj()[adEvent].length; i++) {
      if (_this.adEventListObj()[adEvent][i] == callback ) {
        return;      
      }
    }
    _this.adEventListObj()[adEvent].push(callback);
  };

  _this.removeEventListener = function(adEvent, callback, uidName) {
    if (!$ADP.AdEvent.check(adEvent)) { return; }
    if (_this.adEventListObj()[adEvent]) {
      for (var i = 0; i < _this.adEventListObj()[adEvent].length; i++) {
        if (uidName) {
          if (uidName == _this.adEventListObj()[adEvent][i].uidName) {
            _this.adEventListObj()[adEvent].splice(i, 1);
            // $ADP.Util.log('Removing from event list:'+callback);
            break;            
          }
        } else {
          if (_this.adEventListObj()[adEvent][i] == callback ) {
            _this.adEventListObj()[adEvent].splice(i, 1);
            // $ADP.Util.log('Removing from event list:'+callback);
            break;      
          }
        }
      }
      if (_this.adEventListObj()[adEvent].length == 0) {
        delete _this.adEventListObj()[adEvent];
      }
    }
  };

  _this.addTrackingPixel = function(adEvent, url, repeat) {
    if (!$ADP.AdEvent.check(adEvent)) { return; }
    if (repeat === undefined) { repeat = true; }
    if (url) {
      /** @private */
      function defaultTrackCallBack(evt) {
        var urlReq = new $ADP.PixelRequest(url);
        urlReq.load();
        if(!repeat) {
          _this.removeEventListener(evt.type(), defaultTrackCallBack);
        }
      }
      defaultTrackCallBack.url = url;
      defaultTrackCallBack.repeat = repeat;
      _this.addEventListener(adEvent, defaultTrackCallBack, false);
    } else {
      $ADP.Util.log("Parameter 'url' must be defined", "addTrackingEvent");
    }
  };

  _this.removeTrackingPixel = function(adEvent, url) {
    if (!$ADP.AdEvent.check(adEvent)) { return; }
    if (_this.adEventListObj()[adEvent]) {
      var tmpLen = _this.adEventListObj()[adEvent].length;
      var tempLenDiff = 0;
      var index = 0;
      do {
        // Run through loop and remove all tracking that matches url
        if (url) {
          if (_this.adEventListObj()[adEvent][index].name == 'defaultTrackCallBack') {
            if (_this.adEventListObj()[adEvent][index].url) { // remove all
              if (_this.adEventListObj()[adEvent][index].url == url) {
                _this.adEventListObj()[adEvent].splice(index, 1);
                if (_this.adEventListObj()[adEvent].length == 0) {
                  delete _this.adEventListObj()[adEvent];
                  return;
                }
              }
            }
          }
        }
        
        // check if the temp length has changed
        if(_this.adEventListObj()[adEvent]) {
          tempLenDiff = tmpLen-_this.adEventListObj()[adEvent].length;
          tmpLen = _this.adEventListObj()[adEvent].length;
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
    try { if (!$ADP.AdEvent.check(adEventObj.type())) { return; } } catch(e) { return; }
//    $ADP.Util.log(adEventObj.type(), 'track');
    if (_this.adEventListObj()[adEventObj.type()]) {
      var tmpLen = _this.adEventListObj()[adEventObj.type()].length;
      var tempLenDiff = 0;
      var index = 0;
      do {
        // call callback
        adEventObj.target(_this);
        if (currentPlayer) {
          adEventObj.currentTarget(currentPlayer);
        } else {
          adEventObj.currentTarget(_this);
        }
        
        if (url) {
          adEventObj.data().url = url;
        }
        _this.adEventListObj()[adEventObj.type()][index](adEventObj);
        // check if the temp length has changed
        if(_this.adEventListObj()[adEventObj.type()]) {
          tempLenDiff = tmpLen-_this.adEventListObj()[adEventObj.type()].length;
          tmpLen = _this.adEventListObj()[adEventObj.type()].length;
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
      var urlReq = new $ADP.PixelRequest(url);
      urlReq.load();
    }
  };

  _this.addPrivacyInfo = function(adServer, message, url, urlText, enableAdChoice) {
    var privacyInfo = new $ADP.PrivacyInfo();
    privacyInfo.adServer = adServer;
    privacyInfo.message = message;
     if (!urlText || urlText == '') { urlText = 'Opt Out'; }
    privacyInfo.urlText = urlText;
    privacyInfo.url = url;
    _this.privacyInfoList().push(privacyInfo);
    
    if (enableAdChoice !== false) {
      _this.enableAdChoice();    
    }
  };

  _this.privacyInfoBtn;
  _this.privacyPanel;
  _this.iconPos = "top-right";

  _this.enableAdChoice = function(openBtnTxt, closeTxt, headerTxt, footerTxt, iconPos) {
    if(!_this.privacyPanel) {
      _this.privacyPanel = new $ADP.PrivacyPanel(_this.privacyInfoList(), _this.toggle, _this.track, closeTxt, headerTxt, footerTxt);
    } else {
      _this.privacyPanel.infoList(_this.privacyInfoList());
      _this.privacyPanel.closeTxt(closeTxt);
      _this.privacyPanel.headerTxt(headerTxt);
      _this.privacyPanel.footerTxt(footerTxt);
    }
    
    if(!_this.privacyInfoBtn) { 
      _this.adDomElement().style.position = "relative";
      _this.privacyInfoBtn = new $ADP.PrivacyInfoButton(_this.toggle, openBtnTxt);
      if (iconPos) {
        _this.iconPos = iconPos;
      }
      _this.setPosition(_this.iconPos);
    } else { 
      _this.privacyInfoBtn.openBtnTxt(openBtnTxt);
    }
    
    if ((_this.isAdChoiceEnabled() === true) && (_this.privacyInfoList().length > 0)) {
      _this.adDomElement().appendChild(_this.privacyInfoBtn.button);
    }
  };
  
  var _isToggled = false;
  _this.toggle = function () {
    if (!_isToggled) {
      _isToggled = true;
      _this.showPrivacyInfo();
    } else {
      _isToggled = false;
      _this.hidePrivacyInfo();
    }
  }  
  
  _this.setPosition = function (pos) {
    if(_this.privacyInfoBtn) {
      _this.privacyInfoBtn.setPosition(pos);
      _this.privacyPanel.setPosition(pos);
    } else {
      _this.enableAdChoice(null, null, null, null, pos);
    }
  };
  
  _this.disableAdChoice = function() {
    _this.isAdChoiceEnabled(false);
    _this.adDomElement().removeChild(_this.privacyInfoBtn.button);
  };

  _this.showPrivacyInfo = function() {
    _this.adDomElement().appendChild(_this.privacyPanel.panel);
    _this.isPrivacyPanelEnabled(true);
    _this.track(new $ADP.AdEvent($ADP.AdEvent.PRIVACY_OPEN));
  };

  _this.hidePrivacyInfo = function() {
    if (_this.privacyPanel) {
      _this.isPrivacyPanelEnabled(false);
      _this.adDomElement().removeChild(_this.privacyPanel.panel);
      _this.track(new $ADP.AdEvent($ADP.AdEvent.PRIVACY_CLOSE));
    }
  };  
  
  return _this;
});
/**
 * @private 
 * @name $ADP.ReferencePlayer
 * @class <code>$ADP.AdPlayer</code> implementation responsible for players being referenced through 
 *        another <code>$ADP.AdPlayer</code> instance.
 * 
 * @author christopher.sancho@adtech.com
 */
$ADP.ReferencePlayer = (function (uid, adDomElement, refAdPlayer) {
  /** @private */ var _this = new $ADP.AbstractPlayer(uid, adDomElement);
  /** @private */ var _defaultPlayer = new $ADP.DefaultPlayer(uid, adDomElement);
  
  /**
   * @name $ADP.ReferencePlayer#updateRef
   * @function
   * @description Updates the default player in order to keep information
   *              synced between related <code>$ADP.AdPlayer</code>.
   * @param {string} fnName Function name that will be executed.
   * @param {array} params The parameters to pass to the executed function.
   */  
  function updateRef(fnName, params){
    _defaultPlayer[fnName].apply(_this, params);
    refAdPlayer[fnName].apply(_this, params);
  }
  
  /*
   * Override concrete implementation 
   */  
  
  _this.addEventListener = function(adEvent, callback) {
    updateRef('addEventListener', [adEvent, callback, this]);    
  };

  _this.removeEventListener = function(adEvent, callback, uidName) {
    updateRef('removeEventListener', [adEvent, callback, uidName, this]);    
  };

  _this.addTrackingPixel = function(adEvent, url, repeat) {
    updateRef('addTrackingPixel', [adEvent, url, repeat, this]);    
  };

  _this.removeTrackingPixel = function(adEvent, url) {
    updateRef('removeTrackingPixel', [adEvent, url, this]);
  };

  _this.track = function(adEventObj, url, currentPlayer) {
    updateRef('track', [adEventObj, url, currentPlayer, this]);
  };

  _this.addPrivacyInfo = function(adServer, message, url, urlText, enableAdChoice) {
    _defaultPlayer.isAdChoiceEnabled(false);
    updateRef('addPrivacyInfo', [adServer, message, url, urlText, enableAdChoice, this]);
  };

  _this.enableAdChoice = function(openBtnTxt, closeTxt, headerTxt, footerTxt, iconPos) {
    _defaultPlayer.isAdChoiceEnabled(false);
    updateRef('enableAdChoice', [openBtnTxt, closeTxt, headerTxt, footerTxt, iconPos, this]);
  };

  _this.showPrivacyInfo = function() {
    updateRef('showPrivacyInfo', [this]);    
  };

  _this.hidePrivacyInfo = function() {
    updateRef('hidePrivacyInfo', [this]);    
  };
  
  _this.setPosition = function(pos) {
    updateRef('setPosition', [pos, this]);    
  };  
  
  return _this;
});
/**
 * @private 
 * @name $ADP.IframePlayer
 * @class <code>$ADP.AdPlayer</code> implementation responsible for iFrame communication using <code>$ADP.PostMessage</code>.
 * 
 * @author christopher.sancho@adtech.com
 */
$ADP.IframePlayer = (function (uid, adDomElement) {
  /** @private */ var _this = new $ADP.AbstractPlayer(uid, adDomElement);
  /** @private */ var _defaultPlayer = new $ADP.DefaultPlayer(uid, adDomElement);
  
  /**
   * @name $ADP.IframePlayer#updateRef
   * @function
   * @description Updates the default player in order to keep information
   *              synced between related <code>$ADP.AdPlayers</code>. 
   * @param {string} fnName Function name that will be executed.
   * @param {array} params The parameters to pass to the executed function.
   */ 
  function updateRef(fnName, params){
    return _defaultPlayer[fnName].apply(_this, params);
  }
  
  /**
   * @name $ADP.IframePlayer#sendToParentFrame
   * @function
   * @description Sends a response to the $ADP.PostMessage class.
   * @param {string} fn Function name that will passed through.  This is used to identify 
   *                    the correct function to execute on the incoming side.
   * @param {array} params The parameters to pass to the function being executed on the other end.
   * @param {object} json JSON object to pass through $ADP.PostMessage.  Object will be
   *                      stringified before delivery.
   */
  function sendToParentFrame(fn, params, json) {
    var obj;
    if (json) {
      obj = json;
    } else {
      obj = new Object();
    }
    obj.postType = $ADP.PostMessage.OUTGOING;
    obj.uid = uid;
    obj.fn = fn;
    obj.params = params.toString();
    $ADP.PostMessage.send(obj, parent);
  }
  
  /**
   * @name $ADP.IframePlayer#getFunctionName
   * @function
   * @description Parses a function string and extracts its name.
   * @param {string} funcStr Function converted to a string to be parsed.
   */
  function getFunctionName(funcStr) {
    var funcStrClean = funcStr.replace(/\s+/g, " ");
    if (funcStrClean.search(/function /i, "") == 0) {
      funcStartPos = funcStrClean.search(/function /i, "");
      funcEndPos = 0;
      funcLen = 9;
      funcEndPos = funcStartPos + funcLen;
      startPos = funcEndPos;
      endPos = funcStrClean.search(/\(/);
    } else {
      if (funcStrClean.search(/var /i, "") == 0) {
          varLen = 4;
          startPos = 4;
      } else {
          varLen = 0;
          startPos = 0;
      }
      endPos = funcStrClean.search(/\=/);
    }
    funcName = funcStrClean.substring(startPos,endPos).replace(/\s+/g, "");
    return escape($ADP.PostMessage.FUNCTION + funcName);
  }  
  
  /*
   * Override concrete implementation 
   */
  
  _this.uid = function(val) {
    return updateRef('uid', [val]);
  };
  
  _this.adDomElement = function(dom) {
    return updateRef('adDomElement', [dom]);
  };
  _this.adDomElement(adDomElement); 
  
  _this.adEventListObj = function(){
    return updateRef('adEventListObj', [null]);
  };

  _this.isLoaded = function(val){
    return updateRef('isLoaded', [val]);
  };

  _this.isPrivacyPanelEnabled = function(val){
    return updateRef('isPrivacyPanelEnabled', [val]);
  };
  
  _this.isAdChoiceEnabled = function(val){
    return updateRef('isAdChoiceEnabled', [val]);
  };  
  
  _this.adWidth = function(num){
    return updateRef('adWidth', [num]);
  };
  
  _this.adHeight = function(num){
    return updateRef('adHeight', [num]);
  };
  
  _this.privacyInfoList = function() {
    return updateRef('privacyInfoList', [null]);
  };
  
  _this.addEventListener = function(adEvent, callback) {
    callback.uidName = uid + new Date().getTime();
    updateRef('addEventListener', [adEvent, callback, this]);
    var obj = new Object();
    obj.uidName = callback.uidName;
    sendToParentFrame('addEventListener', [adEvent, getFunctionName(callback.toString())], obj);
  };

  _this.removeEventListener = function(adEvent, callback, uidName) {
    updateRef('removeEventListener', [adEvent, callback, uidName, this]);
    var obj = new Object();
    obj.uidName = callback.uidName;
    sendToParentFrame('removeEventListener', [adEvent, getFunctionName(callback.toString())], obj);
  };

  _this.addTrackingPixel = function(adEvent, url, repeat) {
    if (!$ADP.AdEvent.check(adEvent)) { return; }
    if (repeat === undefined) { repeat = true; }
    if (url) {
      /** @private */
      function defaultTrackCallBack(evt) {
        var urlReq = new $ADP.PixelRequest(url);
        urlReq.load();
        if(!repeat) {
          _this.removeEventListener(evt.type(), defaultTrackCallBack);
        }
      }
      defaultTrackCallBack.url = url;
      defaultTrackCallBack.repeat = repeat;
      this.addEventListener(adEvent, defaultTrackCallBack, false);
    } else {
      $ADP.Util.log("Parameter 'url' must be defined", "addTrackingEvent");
    }    
  };

  _this.removeTrackingPixel = function(adEvent, url) {
    if (!$ADP.AdEvent.check(adEvent)) { return; }
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
    updateRef('track', [adEventObj, url, currentPlayer, this]);
    
    // TODO: Temporarily passes string value
    sendToParentFrame('track', [adEventObj.type(), url, 'null']);
  };

  _this.addPrivacyInfo = function(adServer, message, url, urlText, enableAdChoice) {
    updateRef('addPrivacyInfo', [adServer, message, url, urlText, enableAdChoice, this]);
    sendToParentFrame('addPrivacyInfo', [adServer, message, url, urlText, enableAdChoice]);
  };
  
  _this.disableAdChoice = function() {
    updateRef('disableAdChoice', []);
  };  
  
  _this.enableAdChoice = function(openBtnTxt, closeTxt, headerTxt, footerTxt, iconPos)  {
    updateRef('enableAdChoice', [openBtnTxt, closeTxt, headerTxt, footerTxt, iconPos]);
    sendToParentFrame('enableAdChoice', [openBtnTxt, closeTxt, headerTxt, footerTxt, iconPos]);
  };
 
  _this.showPrivacyInfo = function() {
    updateRef('showPrivacyInfo', [this]);
    sendToParentFrame('showPrivacyInfo', [null]);
  };

  _this.hidePrivacyInfo = function() {
    updateRef('hidePrivacyInfo', [this]);
    sendToParentFrame('hidePrivacyInfo', [null]);
  };
  
  _this.setPosition = function(pos) {
    updateRef('setPosition', [pos, this]);
    sendToParentFrame('setPosition', [pos, null]);
  };  
  
  return _this;
});
/**
 * @private
 * @name $ADP.PlayerFactory
 * @class Returns an instance of an <code>$ADP.AdPlayer</code>.
 * @description Returns an instance of an <code>$ADP.AdPlayer</code>.</br>
 * @param {string} uid Unique ID used to identify an <code>$ADP.AdPlayer</code>.
 * @param {string} domRefId DOM ID used to mark the start point of a DOM search.
 * @param {function} fnInit Callback executed when an <code>$ADP.AdPlayer</code> is created.
 * @param {adplayer} refAdPlayer Optional - When defined, sets <code>refAdPlayer</code> 
 *                   as the primary <code>$ADP.AdPlayer</code>. 
 * @return {adplayer} AdPlayer instance created through the factory search logic.
 * @author christopher.sancho@adtech.com
 */
$ADP.PlayerFactory = (function(uid, domRefId, fnInit, refAdPlayer){
   /** @private */ var _this = {};
   if(!uid) { $ADP.Util.log('Unique ID is required.', 'AdPlayer'); return; }

   /** @private */ var _isInIFrame = (window.location != window.parent.location) ? true : false;

   /**
    * @private
    * @function
    * @description
    * Attempts to search for an <code>$ADP.AdPlayer</code> using the following conditional order:
    * 1) uid, domId, null, refAdPlayer
    * 2) uid, domId, null, null
    * 3) uid, null, null, refAdPlayer
    * 4) uid, null, null, null 
    */
   function init() {
     if (domRefId && !refAdPlayer) {
       if(checkAdMgrDomList(domRefId)) {
         $ADP.Util.ready(function(){return $ADP.AdPlayerManager.getAdPlayerById(domRefId);}, _this, domRefAdPlayerInit, [domRefId, fnInit], returnDefault, [uid, domRefId, fnInit]);
       } else {
         addToAdMgrList(domRefId);
         $ADP.Util.ready(function(){return document.getElementById(domRefId);}, _this, parentDomSearch, [uid, domRefId, fnInit], returnDefault, [uid, domRefId, fnInit]);
       }
     }
     else if (domRefId && refAdPlayer) {
       if(checkAdMgrDomList(domRefId)) {
         $ADP.Util.ready(function(){return refAdPlayer;}, _this, refAdPlayerInit, [refAdPlayer, uid, domRefId, fnInit], returnDefault, [uid, domRefId, fnInit]);         
       } else {
         addToAdMgrList(domRefId);
         $ADP.Util.ready(function(){return document.getElementById(domRefId);}, _this, refAdPlayerInit, [refAdPlayer, uid, domRefId, fnInit], returnDefault, [uid, domRefId, fnInit]);
       }

     }     
     else if(!domRefId && refAdPlayer) {
       domRefId = setDocWriteRef();
       addToAdMgrList(domRefId);
       $ADP.Util.ready(function(){return document.getElementById(domRefId);}, _this, refAdPlayerInit, [refAdPlayer, uid, domRefId, fnInit], returnDefault, [uid, domRefId, fnInit]);
     }
     else if(!domRefId && !refAdPlayer) {
       domRefId = setDocWriteRef();
       if(checkAdMgrDomList(domRefId)) {
         $ADP.Util.ready(function(){return $ADP.AdPlayerManager.getAdPlayerById(domRefId);}, _this, domRefAdPlayerInit, [domRefId, fnInit], returnDefault, [uid, domRefId, fnInit]);
       } else {
         addToAdMgrList(domRefId);
         $ADP.Util.ready(function(){return document.getElementById(domRefId);}, _this, parentDomSearch, [uid, domRefId, fnInit], returnDefault, [uid, domRefId, fnInit]);
       }       
     }
   }
   
   /**
    * @name $ADP.PlayerFactory#refAdPlayerInit
    * @function
    * @description Executes a callback function with a reference <code>$ADP.AdPlayer</code>.
    * @param {adplayer} refPlayer Primary <code>$ADP.AdPlayer</code>. to use.
    * @param {string} uid Unique ID used to identify an <code>$ADP.AdPlayer</code>.
    * @param {string} domRef domRef DOM ID used to mark the start point of a DOM search.
    * @param {function} fnInit Callback executed when a reference <code>$ADP.AdPlayer</code> is created.
    */
   function refAdPlayerInit(refPlayer, uid, domRef, fnInit) {   
     if (document.getElementById(domRef)) {
       fnInit(new $ADP.ReferencePlayer(uid, document.getElementById(domRef), refPlayer));
     } else {
       fnInit(new $ADP.ReferencePlayer(uid, refPlayer.adDomElement(), refPlayer));
     }     
   }

   /**
    * @name $ADP.PlayerFactory#domRefAdPlayerInit
    * @function
    * @description Executes a callback function when an <code>$ADP.AdPlayer</code> is found by <code>$ADP.AdPlayerManager.getAdPlayerById</code>.
    * @param {string} domRef domRef DOM ID used to mark the start point of a DOM search.
    * @param {function} fnInit Callback executed when an <code>$ADP.AdPlayer</code> is located by <code>$ADP.AdPlayerManager.getAdPlayerById</code>.
    * @see $ADP.AdPlayerManager#getAdPlayerById 
    */
   function domRefAdPlayerInit(domRef, fnInit) {   
     fnInit($ADP.AdPlayerManager.getAdPlayerById(domRef));   
   }   

   /**
    * @name $ADP.PlayerFactory#checkAdMgrDomList
    * @function
    * @description Checks if a DOM ID is located in <code>$ADP.AdPlayerManager.domIdList</code>.
    * @param {string} domRef DOM ID used to mark the start point of a DOM search.
    * @see $ADP.AdPlayerManager#domIdList
    */
   function checkAdMgrDomList(domRef) {
     var isListed = false;
     for (var i=0; i < $ADP.AdPlayerManager.domIdList().length; i++) {
       if($ADP.AdPlayerManager.domIdList()[i] == domRef) {
         isListed = true;
         break;
       }
     }
     return isListed;
   }

   /**
    * @name $ADP.PlayerFactory#addToAdMgrList
    * @function
    * @description Adds a DOM ID to <code>$ADP.AdPlayerManager.domIdList</code>.
    * @param {string} domRef DOM ID used to mark the start point of a DOM search.
    * @see $ADP.AdPlayerManager#domIdList
    */
   function addToAdMgrList(domRef) {
     for (var i=0; i < $ADP.AdPlayerManager.domIdList().length; i++) {
       if($ADP.AdPlayerManager.domIdList()[i] == domRef) {
         return;
       }
     }
     $ADP.AdPlayerManager.domIdList().push(domRef);
   }   

   /**
    * @name $ADP.PlayerFactory#removeFromAdMgrList
    * @function
    * @description Removes a DOM ID from <code>$ADP.AdPlayerManager.domIdList</code>.
    * @param {string} domRef DOM ID used to mark the start point of a DOM search.
    * @see $ADP.AdPlayerManager#domIdList
    */
   function removeFromAdMgrList(domRef) {
     for (var i=0; i < $ADP.AdPlayerManager.domIdList().length; i++) {
       if($ADP.AdPlayerManager.domIdList()[i] == domRef) {
         $ADP.AdPlayerManager.domIdList().splice(i, 1);
         break;
       }
     }
   }

   /**
    * @name $ADP.PlayerFactory#parentDomSearch
    * @function
    * @description Attempts to locate a parent AdPlayer from a DOM reference point.
    * @param {string} uid Unique ID used to identify an <code>$ADP.AdPlayer</code>.
    * @param {string} domRef DOM ID used to mark the start point of a DOM search.
    * @param {function} fnInit Callback executed when a default <code>$ADP.AdPlayer</code> is created.
    */
   function parentDomSearch(uid, domRef, fnInit) {
     // TODO (chris.sancho): separate into methods...
     
     // Attempt to find the top most player.
     var par = document.getElementById(domRef).parentNode;
     while (!$ADP.AdPlayerManager.getAdPlayerById(par.id)) {
       par = par.parentNode;
       parName = par.nodeName.toLowerCase();
       if ((parName == 'body') || (parName == 'html')) { break; }
     }      
     if(par) {
       var adPlayer = $ADP.AdPlayerManager.getAdPlayerById(par.id); 
       if(adPlayer) {
         if(fnInit) {
           $ADP.Util.log('Found player at ' + adPlayer.adDomElement().id);
           fnInit(adPlayer);  
         }
         removeFromAdMgrList(domRef);
       } else {
         $ADP.Util.log('No AdPlayer found after parent search for ' + uid);
          if (_isInIFrame) {
            
            // Check if Stub file is used
            if (String(window.location).search(/apstub.html\#\{(.*?)\}/) > -1) {
              function setStub(uid, domRef) {
                for (var i=0; i < parent.document.getElementsByTagName('iframe').length; i++){
                  if(parent.document.getElementsByTagName('iframe')[i].contentWindow == window) {
                    var player =  parent.$ADP.PostMessageHandler.getPlayerByDomSearch(
                        parent.document.getElementsByTagName('iframe')[i]);
                    if (player) {
                      fnInit(player);
                    } else {
                      fnInit(new $ADP.DefaultPlayer(uid, document.getElementById(domRef)));
                    }
                    break;
                  }
                }                 
              }
              setStub(uid, domRef);
              return;
            }
            
            var iframePlayer = new $ADP.IframePlayer(uid, document.getElementById(domRef));
            fnInit(iframePlayer);
            
            // Check parent frame & temporarily add this factory to the player list with a UID
            var uAdId = uid + new Date().getTime();
            _this.uid = function() {
              return uAdId;
            }
            
            // Added for PostMessage target verification
            $ADP.AdPlayerManager.factoryList().push(_this);    
            
            var obj = new Object();
            obj.postType = $ADP.PostMessage.OUTGOING;
            obj.uid = _this.uid();
            obj.fn = 'iframePlayerVerify';
            $ADP.PostMessage.send(obj, parent);
            
            _this.setIframePlayerType = function(json) {
              for (var i = 0; i < $ADP.AdPlayerManager.list().length; i++) {
                if ($ADP.AdPlayerManager.list()[i].uid() == _this.uid()) {
                  $ADP.AdPlayerManager.list().splice(i, 1);
                  break;
                }
              }              
              if (json.params == true) {
                iframePlayer.disableAdChoice();
              } 
            }
         } else {
           // Fixes IE issue where ads delivered using document.write
           // are written outside of container
           if ($ADP.Util.isIE) {
             $ADP.Util.log('isIE is set to true.  Searching for previous sibling player...');
             function getPrevSibling(n) {
               x = n.previousSibling;
               if (x == null) {
                 return false;
               } else { 
                 while (x && x.nodeType != 1) {
                   x = x.previousSibling;
                   if ($ADP.AdPlayerManager.getAdPlayerById(x.id)) { break; }
                 }
                 return x;
               }
             }
             var ieAdPlayer = $ADP.AdPlayerManager.getAdPlayerById(getPrevSibling(
                 document.getElementById(domRef)).id);
             if (ieAdPlayer) {
               $ADP.Util.log('Found player at ' + ieAdPlayer.adDomElement().id);
               fnInit(ieAdPlayer);
               return;
             } else {
               $ADP.Util.log('Searching parent div...');
               var parChildren = document.getElementById(domRef).parentNode.childNodes;
               for (var i = 0; i < parChildren.length; i++) {
                 if (parChildren[i].id != '') {
                   ieAdPlayer = $ADP.AdPlayerManager.getAdPlayerById(parChildren[i].id);
                   if (ieAdPlayer) {
                     fnInit(ieAdPlayer);
                     return;
                   }
                 }
               }
               $ADP.Util.log('Creating new player for ' + uid);
               fnInit(new $ADP.DefaultPlayer(uid, document.getElementById(domRef)));
             }
           }
           $ADP.Util.log('Creating new player for ' + uid);
           fnInit(new $ADP.DefaultPlayer(uid, document.getElementById(domRef)));
         }         
         removeFromAdMgrList(domRef);
       }
     }     
   }

   /**
    * @name $ADP.PlayerFactory#returnDefault
    * @function
    * @description Executes a callback function with a default <code>$ADP.AdPlayer</code>.
    * @param {string} uid Unique ID used to identify an <code>$ADP.AdPlayer</code>.
    * @param {string} domRef DOM ID used to mark the start point of a DOM search.
    * @param {function} fnInit Callback executed when a default <code>$ADP.AdPlayer</code> is created.
    */
   function returnDefault(uid, domRef, fnInit) {
     fnInit(new $ADP.DefaultPlayer(uid, document.getElementById(domRef)));
   }

   /**
    * @name $ADP.PlayerFactory#setDocWriteRef
    * @function
    * @description Sets a <code>span</code> element using <code>document.write</code>.
    * @return {string} domId ID of the generated <code>span</code> element.
    */
   function setDocWriteRef() {
     var uAdId = new Date().getTime();
     $ADP.Util.log('WARNING: No valid referral element specified for "'+uid+'". Referral will be created using "document.write"', 'parentDomSearch');
     domId = 'ref' + uAdId;
     document.write('<span id="' + domId + '"></span>');
     return domId;
   }
   
   init();
   return _this;
});
/**
 * @name $ADP.AdPlayer
 * @class Main class to be associated with an ad element object. 
 * @description The <code>$ADP.AdPlayer</code> class.
 * 
 * @author christopher.sancho@adtech.com
 * 
 * @example
 * &lt;div id=&quot;ad-container&quot;&gt;
 *   &lt;!-- creative --&gt;
 * &lt;/div&gt;
 * &lt;script type=&quot;text/javascript&quot;&gt;
 *   var adPlayer = new $ADP.AdPlayer('placement123', 'ad-container');
 * &lt;/script&gt;
 */
$ADP.AdPlayer = (function (uid, domId, fnInit, refAdPlayer) {
  /** @private */ var _this = new $ADP.AbstractPlayer(uid, null);
  /** @private */ var _queue = [];
  
  /**
   * @name $ADP.AdPlayer#player
   * @field
   * @description Returns a direct reference to the parent AdPlayer within the setup hierarchy.
   * @returns {DOM Object} The direct reference to the parent AdPlayer within the setup hierarchy.
   * @see $ADP.DefaultPlayer
   * @see $ADP.IframePlayer
   * @see $ADP.ReferencePlayer
   * @example
   * // Get reference to property
   * var adPlayerParent = adPlayer.player();  
   */
  var _player;
  _this.player = function() {
    return _player;
  };
  
  /**
   * @name $ADP.AdPlayer#adDomElement
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
   * @name $ADP.AdPlayer#adEventListObj
   * @field
   * @description The associated ad's event object containing a set of events
   *              registered to an instance of <code>$ADP.AdPlayer</code>. 
   * @returns {Object - Read Only} Returns an object.
   * @see $ADP.AdEvent
   * @example
   * // Get reference to property
   * var eventList = adPlayer.adEventListObj();
   */  
  _this.adEventListObj = function(){
      return _player.adEventListObj();
  };

  /**
   * @name $ADP.AdPlayer#isLoaded
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
   * @name $ADP.AdPlayer#isPrivacyPanelEnabled
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
   * @name $ADP.AdPlayer#adWidth
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
   * @name $ADP.AdPlayer#adHeight
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
   * @name $ADP.AdPlayer#privacyInfoList
   * @field
   * @description Provides a list containing instances of <code>$ADP.PrivacyInfo</code> objects added
   *              through <code>addPrivacyInfo</code>.
   * @returns {Array - Read Only} Returns a list of <code>$ADP.PrivacyInfo</code> objects
   * @see $ADP.AdPlayer#addPrivacyInfo
   * @see $ADP.PrivacyInfo
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
   * @name $ADP.AdPlayer#addEventListener
   * @function
   * @description Adds a callback function to an <code>$ADP.AdEvent</code> flow. Callback handler function 
   *              returns an <code>$ADP.AdEvent</code> object instance, which contains the following:
   *              <ul>
   *                <li><code>data</code> - Object containing any data passed at the time of dispatch.</li>
   *                <li><code>type</code> - The $ADP.AdEvent type passed at the time if dispatch.</li>
   *                <li><code>target</code> - Reference to the parent AdPlayer within the setup hierarchy.</li>
   *                <li><code>currentTarget</code> - Reference to the current AdPlayer from where the dispatch orignated.</li>
   *              </ul>
   *              
   * @param adEvent {$ADP.AdEvent} The <code>$ADP.AdEvent</code> string to listen to.
   * @param callback {Function} The callback handler to call when an <code>$ADP.AdEvent</code> is dispatched. 
   * 
   * @see $ADP.AdEvent
   * @see $ADP.AdPlayer#track
   * 
   * @example
   * function trackEventHandler(adEvent) {
   *  $ADP.Util.log(adEvent.type() + ' has been dispatched');
   *  $ADP.Util.log(adEvent.data().message);
   * }
   * adPlayer.addEventListener($ADP.AdEvent.TRACK, trackEventHandler);
   * 
   * var data = new Object();
   * data.message = "Hello World!";
   * adPlayer.track(new $ADP.AdEvent($ADP.AdEvent.TRACK, data), trackEventHandler);
   */
  _this.addEventListener = function(adEvent, callback) {
    queueCmd('addEventListener', [adEvent, callback, this]);
  };
  
  /** 
   * @name $ADP.AdPlayer#removeEventListener
   * @function
   * @description Removes a callback function registered to an <code>$ADP.AdEvent</code> flow.
   * @param adEvent {$ADP.AdEvent} The <code>$ADP.AdEvent</code> to listen to.
   * @param callback {Function} The callback handler being called when an <code>$ADP.AdEvent</code> is dispatched. 
   * 
   * @see $ADP.AdEvent
   * @see $ADP.AdPlayer#track
   * 
   * @example
   * function trackEventHandler(adEvent) {
   *  // Remove callback
   *  adEvent.player().removeEventListener($ADP.AdEvent.TRACK, trackEventHandler);
   *  
   *  // Alternate
   *  // adPlayer.removeEventListener($ADP.AdEvent.TRACK, trackEventHandler); 
   *  
   *  $ADP.Util.log(adEvent.type() + ' has been dispatched');
   * }
   * adPlayer.addEventListener($ADP.AdEvent.TRACK, trackEventHandler); 
   */  
  _this.removeEventListener = function(adEvent, callback, uidName) {
    queueCmd('removeEventListener', [adEvent, callback, uidName, this]);
  };

  /** 
   * @name $ADP.AdPlayer#addTrackingPixel
   * @function
   * @description A convenience function that adds a pixel URL to an <code>$ADP.AdEvent</code> flow.  
   *              
   * @param adEvent {$ADP.AdEvent} The <code>$ADP.AdEvent</code> to listen to.
   * @param url {String - URL} URL of pixel to call when associated <code>$ADP.AdEvent</code> is dispatched.
   * @param repeat {Boolean} Optional - Default is 'true.'  If set to 'false,' pixel will only fire once.
   * 
   * @see $ADP.AdEvent
   * @see $ADP.AdPlayer#track
   * @see $ADP.PixelRequest#load
   * 
   * @example
   * // Adds a tracking pixel that will dispatch on $ADP.AdEvent.TRACK event
   * adPlayer.addTrackingPixel($ADP.AdEvent.TRACK, 'http://my.pixel.url');
   * 
   * // Adds a tracking pixel that will dispatch only once on $ADP.AdEvent.TRACK event
   * adPlayer.addTrackingPixel($ADP.AdEvent.TRACK, 'http://my.pixel.url', null, false);
   */  
  _this.addTrackingPixel = function(adEvent, url, repeat) {
    queueCmd('addTrackingPixel', [adEvent, url, repeat, this]);
  };

  /** 
   * @name $ADP.AdPlayer#removeTrackingPixel
   * @function
   * @description Removes a matching <code>url</code> or <code>callback</code> associated with
   *              an <code>$ADP.AdEvent</code> and registered using <code>addTrackingPixel()</code>
   *              method.
   *              <ul>
   *                <li>If a <code>callback</code> and a <code>url</code> are both defined,
   *                    method will remove the <code>$ADP.AdEvent</code> associated with the callback.</li>
   *                <li>If only a <code>callback</code> is defined method will remove the
   *                    <code>$ADP.AdEvent</code> associated with the callback.</li>
   *                <li>If only a <code>url</code> is defined, method will remove all <code>$ADP.AdEvent</code>
   *                    callbacks containing a matching <code>url</code> property.</li>
   *              </ul>
   *              
   * @param adEvent {$ADP.AdEvent} The <code>$ADP.AdEvent</code> to listen to.
   * @param url {String - URL} Optional - URL of pixel to call when associated <code>$ADP.AdEvent</code> is dispatched.
   * 
   * @see $ADP.AdEvent
   * @see $ADP.AdPlayer#addTrackingPixel
   * 
   * @example
   * adPlayer.addTrackingPixel($ADP.AdEvent.TRACK, 'http://my.pixel.url');
   * adPlayer.addEventListener($ADP.AdEvent.TRACK, removePixels);
   * 
   * function removePixels(adEvent) {
   *  // Removes url from TRACK event flow.
   *  adPlayer.removeTrackingPixel($ADP.AdEvent.TRACK, 'http://my.pixel.url');
   *  
   * }
   */  
  _this.removeTrackingPixel = function(adEvent, url) {
    queueCmd('removeTrackingPixel', [adEvent, url, this]);
  };

  /** 
   * @name $ADP.AdPlayer#track
   * @function
   * @description Dispatches an <code>$ADP.AdEvent</code> object to all suscribers.
   *              
   * @param adEventObj {$ADP.AdEvent} The <code>$ADP.AdEvent</code> instance to track.
   * @param url {String - URL} Optional - URL of pixel that will be called once with track method.
   * 
   * @example
   * // Dispatches a track event to all suscribers
   * adPlayer.track(new $ADP.AdEvent($ADP.AdEvent.TRACK));
   * 
   * // Dispatches a track event to all suscribers and calls URL once.
   * adPlayer.track(new $ADP.AdEvent($ADP.AdEvent.TRACK), 'http://my.pixel.url');
   */  
  _this.track = function(adEventObj, url) {
    queueCmd('track', [adEventObj, url, this]);
  };

  /** 
   * @name $ADP.AdPlayer#addPrivacyInfo
   * @function
   * @description Creates a <code>$ADP.PrivacyInfo</code> instance and adds it to <code>privacyInfoList</code>
   *              
   * @param adServer {String} Ad server name. 
   * @param message {String} Privacy information message.
   * @param url {String - URL} Click-through url of privacy page.
   * @param urlText {String} Optional - Text to represent the click-through <code>url</code>.  Defaults to "Opt Out"
   * @param enableAdChoice {Boolean} Optional - Specifies whether the privacy panel button should be enabled.
   *                                 Defaults to <code>true</code>.
   * 
   * @see $ADP.PrivacyInfo
   * @see $ADP.AdPlayer#privacyInfoList
   * @see $ADP.AdPlayer#enableAdChoice
   * 
   * @example
   * adPlayer.addPrivacyInfo("MyAdServer",  "This is my privacy message.", "http://adplayer.aboutthisad.com", "Find out more.", true);
   */  
  _this.addPrivacyInfo = function(adServer, message, url, urlText, enableAdChoice) {
    queueCmd('addPrivacyInfo', [adServer, message, url, urlText, enableAdChoice, this]);
  };
  
  /**
   * @name $ADP.AdPlayer#enableAdChoice
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
   * @see $ADP.AdPlayer#setPosition
   * @see $ADP.AdPlayer#showPrivacyInfo
   * @see $ADP.PrivacyInfo
  */  
  _this.enableAdChoice = function(openBtnTxt, closeTxt, headerTxt, footerTxt, iconPos) {
    queueCmd('enableAdChoice', [openBtnTxt, closeTxt, headerTxt, footerTxt, iconPos, this]);
  };

  /**
   * @name $ADP.AdPlayer#disableAdChoice
   * @function
   * @description Disables ad choice info button. By default, ad choice button is disabled until privacy info
   *              is added through <code>addPrivacyInfo</code>.
   * 
   * @see $ADP.AdPlayer#enableAdChoice
   * @see $ADP.AdPlayer#addPrivacyInfo
   * @see $ADP.PrivacyInfo
  */  
  _this.disableAdChoice = function() {
    queueCmd('disableAdChoice', [this]);
  };
  
  /**
   * @name $ADP.AdPlayer#showPrivacyInfo
   * @function
   * @description Convenience function that creates a layer that displays the privacy info added to <code>privacyInfoList</code>. <br/>
   *              <code>$ADP.AdEvent.PRIVACY_CLOSE</code> is dispatched when method is called. <br/>
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
   * @see $ADP.AdPlayer#privacyInfoList
   * @see $ADP.PrivacyInfo
  */  
  _this.showPrivacyInfo = function() {
    queueCmd('showPrivacyInfo', [this]);
  };

  /**
   * @name $ADP.AdPlayer#hidePrivacyInfo
   * @function
   * @description Used in conjunction with <code>showPrivacyInfo</code> to remove privacy info layer.<br/>
   *              <code>$ADP.AdEvent.PRIVACY_CLOSE</code> is dispatched when method is called.
   * 
   * @see $ADP.AdPlayer#showPrivacyInfo
   * @see $ADP.PrivacyInfo
  */  
  _this.hidePrivacyInfo = function() {
    queueCmd('hidePrivacyInfo', [this]);
  };

  /**
   * @name $ADP.AdPlayer#setPosition
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
    var factory  = new $ADP.PlayerFactory(uid, domId, playerInit, refAdPlayer);
    function playerInit(player) {
      _player = player;

      $ADP.AdPlayerManager.addAdPlayer(_player);
      
      if (fnInit) {
        fnInit(_this);  
      }
      while (_queue.length > 0) {
        (_queue.shift())();   
      }
      _player.track(new $ADP.AdEvent($ADP.AdEvent.INIT), null, _this);
    }
  }  
  
  init();
  return _this;
});

  
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