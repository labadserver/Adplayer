/*
   -------------------------------------------------------------------------------------------
   AdPlayer v0.5.5 (dev.111811)
   Author: christopher.sancho@adtech.com, felix.ritter@adtech.com
   -------------------------------------------------------------------------------------------
  
   This file is part of AdPlayer v0.5.0.dev.100511.
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
if (typeof AdPlayerManager === 'undefined') {
var Util = (function () {
  var _this = {};
  
  _this.jsonUrl = 'js/json2.min.js';
  _this.isIE  = (navigator.appVersion.indexOf("MSIE") != -1) ? true : false;
  _this.isWin = (navigator.appVersion.toLowerCase().indexOf("win") != -1) ? true : false;
  _this.isOpera = (navigator.userAgent.indexOf("Opera") != -1) ? true : false;      
  _this.isFF = (navigator.userAgent.indexOf("Firefox") != -1) ? true : false;    
  
  /** 
  * @description Logs a message through the console; if available.
  * @param {string} msg The message to log.
  * @param {string} ref Optional - An identifer used to reference the source of a message.
  * 
  * @example
  * // "AdPlayer(God): This is a log output."
  * Util.log('This is a log output', 'God');
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

  _this.setClassName = function (domObj, className) {
    domObj.setAttribute('class', className);
    if (_this.isIE) { domObj.setAttribute('className', className); } // IE Fix        
  }
  
  _this.ready = function(testFn, context, readyFn, readyParams, errorFn, errorParams, search) {
    if(!search) { search = false; }
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
  
  /** 
  * List containing IDs of scripts being loaded.
  **/
  var _loadList = [];

  /**
  * Checks if obj is loaded or in process of being loaded, executes callback.
  *
  * @param objId        Id used to identify script.
              Note: Implemented to avoid use of eval();
  * @param objReturnFn  Function that returns object to check against.  
              Note: Implemented to avoid use of eval();
  * @param scriptSrc    The url of the script to load.
  * @param objId        The handler to be executed when script load is complete.
  */
  _this.loadScript = function (objId, objReturnFn, scriptSrc, callback) {
    var jsIntv;
    var obj;

    /* If script is not currently being loaded, attempt to load. */
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

    /* Attempts to create script element if object does not exist. */
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

    /* Remove from check list execute callback. */
    var setObj = function() {
      if(checkObj()) {
        clearInterval(jsIntv);
        removeFromList(objId);      
        callback();
      }
    };

    /* Checks if function returns valid object. */
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
     * 
     * @param id   The string ID to check.
     *
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
     * 
     * @param id   The string ID to remove.
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

  _this.jsonParse = function(txt, reviver, rdyFn) {
    if(typeof JSON !== 'undefined') {
      rdyFn(JSON.parse(txt, reviver));  
    } else {
      _this.loadScript('JSON', function(){return JSON;}, _this.jsonUrl, 
        function() {
          rdyFn(JSON.parse(txt, reviver));
        }
      );
    }
  }
  
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


var AbstractPostMsg = (function(){
  var _this = {};
  var json;
  _this.send = function(msg, target) {};
  _this.receive = function(evt) {};
  return _this;
});
var PostMsgDefault = (function(){
  var _this = new AbstractPostMsg();
  
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

  _this.send = function(msg, target) {
    target.postMessage(msg, "*");
  };

  _this.receive = function(evt) {
    Util.jsonParse(evt.data, null, function(json){      
      if(json.postType == PostMessage.OUTGOING) {
        for (var i=0; i < document.getElementsByTagName('iframe').length; i++){
          if(document.getElementsByTagName('iframe')[i].contentWindow == evt.source) {
            var iframe = document.getElementsByTagName('iframe')[i];
            PostMessageHandler.domRefPlayerWait(iframe, json);          
            break;
          }      
        }
      } else if (json.postType == PostMessage.INCOMING){
        PostMessageHandler.inMsgHandler(json)
      }      
    });
  };
  

  init();
  return _this;
});
// TODO: Add error callback for queue routine

var PostMessageHandler = (function () {
  var _this = {};

  _this.domRefPlayerWait = function (dom, json) {
    _this.dom = dom;
    _this.json = json;
    
    function iframeVerify(dom, json) {
      var obj = new Object();
      obj.postType = PostMessage.INCOMING;
      obj.uid = json.uid;
      obj.fn = 'iframePlayerVerify';      
      var player = _this.getPlayerByDomSearch(dom);
      if (player) {
        if (json.fn == "iframePlayerVerify") {
          obj.params = true;
          PostMessage.send(obj, dom.contentWindow);   
          return;
        }
        readyTest(dom, json, player);
      } else {
        obj.params = false;
        PostMessage.send(obj, dom.contentWindow);          
      }
    }
    Util.ready(function(){return _this.dom;}, this, iframeVerify, [_this.dom, _this.json], null, null);
  }

  _this.getPlayerByDomSearch = function (dom) {
    var par = dom.parentNode;
    while (!AdPlayerManager.getAdPlayerById(par.id)) {
      par = par.parentNode;
      parName = par.nodeName.toLowerCase();
      if ((parName == 'body') || (parName == 'html')) { break; }
    }
    if(par) {
      var adPlayer = AdPlayerManager.getAdPlayerById(par.id);
      if(adPlayer) {
        Util.log('Found player at '+adPlayer.adDomElement().id);
          return(adPlayer);
      } else {
        Util.log('No AdPlayer found after parent search for "' + dom.id + '."');
        return null;
      }
    }     
  }    

  function readyTest(iframe, json, player) {
    if (player) {
      var params = json.params.split(',');
      for (var t=0; t < params.length; t++) {
        // CHECKS if any contains a function to properly wrap and send off
        switch (json.fn){
          case 'addEventListener':
            if (unescape(params[t]).match(PostMessage.FUNCTION)) {
              var funcN = unescape(params[t]).slice(PostMessage.FUNCTION.length);
              function funcMe (evt) {
                var obj = new Object();
                obj.postType = PostMessage.INCOMING;
                obj.uid = json.uid;
                obj.fn = funcN;
                obj.evtType = evt.type();
                obj.uidName = json.uidName;
                PostMessage.send(obj, iframe.contentWindow);
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
          adEvtObj = new AdEvent(params[0]);
          adEvtObj.target(player);
          adEvtObj.currentTarget(player);
          player.track(new AdEvent(params[0]), params[1]);
          return;
          break;
      }

      player[json.fn].apply(player, params);
    }
  }      
  
  _this.inMsgHandler = function (json) {
    switch (json.fn){
      case 'iframePlayerVerify':
        var factoryPlayer; 
        for (var i = 0; i < AdPlayerManager.factoryList().length; i++) {
          if (AdPlayerManager.factoryList()[i].uid() == json.uid) {
            factoryPlayer = AdPlayerManager.factoryList()[i];
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
      var player = AdPlayerManager.getPlayerByUID(json.uid);  
      // NEED TO TARGET THE CURRENT PLAYER THEN SEND BACK
      if (player) {
        var event = new AdEvent(json.evtType);
        event.target(player);
        func(event);
      }
      break;
    }
  }  
return _this;
})();
var PostMessage = (function () {
    var _this = {};
    var _postMsg;
    
  _this.OUTGOING = 'PostMessage.Outgoing';
  _this.INCOMING = 'PostMessage.Incoming';
  _this.FUNCTION = 'PostMessage.Function: ';
  
  function init() {
    if (typeof(window.postMessage) == typeof(Function)) {
      _postMsg = new PostMsgDefault();
    } else {
      _postMsg = new AbstractPostMsg();
    }
  }

  _this.send = function(obj, target) {
    obj.pmsgid = new Date().getTime(); 
    Util.jsonStringify(obj, null, function(msg){
      _postMsg.send(msg, target);
    });
  };
  
  init();
  return _this;
})();
/** @private */
var PrivacyInfoButton = (function (callback, openBtnTxt) {
  /** @private */ var _this = {};
  
  _this.button;
  _this.iconPos = 'top-right';

  var _openBtnIcon;
  var _openBtnTxtObj;
  var _openBtnTxt = 'Get Info';
  var _privBtnClassName = 'privacyButton';
  
  _this.openBtnTxt = function(val) {
    if(val) {
      _openBtnTxt = val;
      if (_openBtnTxtObj) {
        _openBtnTxtObj.innerHTML = _openBtnTxt;
      }
    }
    return _openBtnTxt;
  } 

  function init() {
    _this.openBtnTxt(openBtnTxt);
    
    _this.button = document.createElement('div');
    Util.setClassName(_this.button, _privBtnClassName);
    
    _openBtnIcon = document.createElement('div');
    Util.setClassName(_openBtnIcon, 'icon');
    _this.button.appendChild(_openBtnIcon);
    
    _openBtnTxtObj = document.createElement('div');
    Util.setClassName(_openBtnTxtObj, 'text');
    _openBtnTxtObj.style.display = "none";
    _this.button.appendChild(_openBtnTxtObj);
    _openBtnTxtObj.innerHTML = _this.openBtnTxt();
       
    _this.button.onclick = callback;
    //_openBtnIcon.onclick = callback;
    
    _openBtnIcon.onmouseover = function() {
      _openBtnTxtObj.style.display = "block";
    };
    _openBtnIcon.onmouseout = function() {
      _openBtnTxtObj.style.display = "none";
    };
  }
  
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
    
    Util.setClassName(_this.button, _privBtnClassName + ' ' + pos);
  }    
  
  init();
  return _this;
});
/** @private */
var PrivacyPanel = (function (infoList, closeTxt, headerTxt, footerTxt, closeCallback, trackCallback) {
  /** @private */ var _this = {};
  
  _this.panel;

  var _listObj;
  var _infoList;
  var _privPanelClassName = 'privacyPanel';
    
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
  
  var _headerTxtObj;
  var _headerTxt = '';
    _this.headerTxt = function(val) {
    if(val) {
      _headerTxt = val;
      if (_headerTxtObj) {
        _headerTxtObj.innerHTML = _headerTxt;
        if (_headerTxt != '') {
          if (!checkPanel('div', 'header')) {
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
  
  var _footerTxtObj;
  var _footerTxt = '';
    _this.footerTxt = function(val) {
    if(val) {
      _footerTxt = val;
      if (_footerTxtObj) {
        _footerTxtObj.innerHTML = _footerTxt;
        if (_footerTxt != '') {
          if (!checkPanel('div', 'footer')) {
            _this.panel.appendChild(_footerTxtObj);
          }
        }
      }
    }
    return _headerTxt;
  }  
  
  function init() {
    _this.panel = document.createElement('div');
    Util.setClassName(_this.panel, _privPanelClassName);
    
    _closeTxtObj = document.createElement('div');
    Util.setClassName(_closeTxtObj, 'close');
    _closeTxtObj.innerHTML = _this.closeTxt(closeTxt);
    _closeTxtObj.onclick = closeCallback;
    _this.panel.appendChild(_closeTxtObj);
    
    _headerTxtObj = document.createElement('div');
    Util.setClassName(_headerTxtObj, 'header');
    _this.headerTxt(headerTxt);

    _listObj = document.createElement('div');
    Util.setClassName(_listObj, 'list');
    _this.panel.appendChild(_listObj);
    _this.infoList(infoList);
    
    _footerTxtObj = document.createElement('div');
    Util.setClassName(_footerTxtObj, 'footer');
    _this.footerTxt(footerTxt);
  }
  
  function addPrivacyInfo(privacyInfoObj) {
    var privacyObj =  document.createElement('div');
    privacyObj.setAttribute('class', 'item');
    if (Util.isIE) { privacyObj.setAttribute('className', 'item'); } // IE Fix        
    privacyClick = function(url) {
      var data = new Object();
      data.url = url;
      trackCallback(new AdEvent(AdEvent.PRIVACY_CLICK, data));
      window.open(url);          
    }
    privacyObj.innerHTML = '<h4 style="margin:0; padding:0;">- ' + '<span>' + privacyInfoObj.adServer + '</span></h4><p>' + privacyInfoObj.message+'</p><p><a href="javascript:privacyClick(\''+privacyInfoObj.url+'\');" target="_self">'+privacyInfoObj.urlText+'</a></p>';
    _listObj.appendChild(privacyObj);
  }
  
  function checkPanel(tagName, className) {
    for (var i = 0; i < _this.panel.getElementsByTagName(tagName).length; i++) {
      if (_this.panel.getElementsByTagName(tagName)[i].className == className){
        return _this.panel.getElementsByTagName(tagName)[i];
      }
    }
    return null;
  }
  
  _this.setPosition = function (pos) {
    _this.panel.setAttribute('style', '');
    _this.panel.style.position = "absolute";
    _this.panel.style.zIndex = "999999999";
    switch (pos) {
      case "bottom-left-out":
      case "bottom-left":
        _this.panel.style.bottom = "0px";
        _this.panel.style.left = "0px";        
      break; 
      case "bottom-right-out":
      case "bottom-right":
        _this.panel.style.bottom = "0px";
        _this.panel.style.right = "0px";        
      break;
      case "top-right-out":
      case "top-right":
        _this.panel.style.top = "0px";
        _this.panel.style.right = "0px";        
        break;
      default: // top-left
        _this.panel.style.top = "0px";
        _this.panel.style.left = "0px";
        break;
    }
    
    Util.setClassName(_this.panel, _privPanelClassName + ' ' + pos);
  }    
    
  
  init();
  return _this;
});
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
  
  /**
   * @name PrivacyInfo#urlText
   * @description Text for click-through url of privacy page.
   * @type String
   */
  _this.urlText = '';  
   
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
* var pixelRequest = new PixelRequest('http://my.pixel-url.com');
* pixelRequest.load();
* 
* // Alternate
* var pixelRequest2 = new PixelRequest();
* pixelRequest2.url = 'http://my.pixel-url.com';
* pixelRequest2.load();
*/
var PixelRequest = (function (url) {
  /** @private */ var _this = {};
  
  /** @property {string} The URL of the pixel to request. */
  _this.url;
  if (url) { _this.url = url; }

  /**
   * @name PixelRequest#load
   * @function
   * @description Requests a pixel using the <code>url</code> property. 
   */
   _this.load = function() {
    if(_this.url) {
      var urlImgReq = new Image();
      urlImgReq.src = _this.url;
      Util.log(_this.url, 'PixelRequest');
    } else {
      Util.log('PixelRequest', 'Parameter "url" is not defined.');
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
 *   Util.log('COUNT ad event has been dispatched.');
 * }
 * 
 * // Dispatch AdEvent.COUNT event to listeners.
 * adPlayer.track(new AdEvent(AdEvent.COUNT));
 * 
 * // Example 2:
 * // Dispatch AdEvent.COUNT event to listeners w/ data containing information.
 * adPlayer.addEventListener(AdEvent.COUNT, countEventHandler2);
 * function countEventHandler2(adEvent) {
 *   Util.log('COUNT ad event has been dispatched.');
 *   Util.log('Here is data.info:' + adEvent.data.info);
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
  Util.log('Ad Event type is not valid: ' + val, 'AdEvent');
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
 * @private
 * @name AbstractPlayer
 * @class Base class for all ad player types.
 * @description Base class for all ad player types.
 * 
 * @author christopher.sancho@adtech.com
 */
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
 * @name DefaultPlayer
 * @class Default player returned
 * @description DESCRIPTION NEEDED
 * 
 * @author christopher.sancho@adtech.com
 */
var DefaultPlayer = (function (uid, adDomElement) {
  /** @private */ var _this = new AbstractPlayer(uid, adDomElement);
  
  _this.addEventListener = function(adEvent, callback) {
    if (!AdEvent.check(adEvent)) { return; }
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
    if (!AdEvent.check(adEvent)) { return; }
    if (_this.adEventListObj()[adEvent]) {
      for (var i = 0; i < _this.adEventListObj()[adEvent].length; i++) {
        if (uidName) {
          if (uidName == _this.adEventListObj()[adEvent][i].uidName) {
            _this.adEventListObj()[adEvent].splice(i, 1);
            // Util.log('Removing from event list:'+callback);
            break;            
          }
        } else {
          if (_this.adEventListObj()[adEvent][i] == callback ) {
            _this.adEventListObj()[adEvent].splice(i, 1);
            // Util.log('Removing from event list:'+callback);
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
    if (!AdEvent.check(adEvent)) { return; }
    if (repeat === undefined) { repeat = true; }
    if (url) {
      /** @private */
      function defaultTrackCallBack(evt) {
        var urlReq = new PixelRequest(url);
        urlReq.load();
        if(!repeat) {
          _this.removeEventListener(evt.type(), defaultTrackCallBack);
        }
      }
      defaultTrackCallBack.url = url;
      defaultTrackCallBack.repeat = repeat;
      _this.addEventListener(adEvent, defaultTrackCallBack, false);
    } else {
      Util.log("Parameter 'url' must be defined", "addTrackingEvent");
    }
  };

  _this.removeTrackingPixel = function(adEvent, url) {
    if (!AdEvent.check(adEvent)) { return; }
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
    try { if (!AdEvent.check(adEventObj.type())) { return; } } catch(e) { return; }
//    Util.log(adEventObj.type(), 'track');
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
      var urlReq = new PixelRequest(url);
      urlReq.load();
    }
  };

  _this.addPrivacyInfo = function(adServer, message, url, urlText, enableAdChoice) {
    var privacyInfo = new PrivacyInfo();
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
      _this.privacyPanel = new PrivacyPanel(_this.privacyInfoList(), closeTxt, headerTxt, footerTxt, _this.toggle, _this.track);
    } else {
      _this.privacyPanel.infoList(_this.privacyInfoList());
      _this.privacyPanel.closeTxt(closeTxt);
      _this.privacyPanel.headerTxt(headerTxt);
      _this.privacyPanel.footerTxt(footerTxt);
    }
    
    if(!_this.privacyInfoBtn) { 
      _this.adDomElement().style.position = "relative";
      _this.privacyInfoBtn = new PrivacyInfoButton(_this.toggle, openBtnTxt);
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
    _this.track(new AdEvent(AdEvent.PRIVACY_OPEN));
  };

  _this.hidePrivacyInfo = function() {
    if (_this.privacyPanel) {
      _this.isPrivacyPanelEnabled(false);
      _this.adDomElement().removeChild(_this.privacyPanel.panel);
      _this.track(new AdEvent(AdEvent.PRIVACY_CLOSE));
    }
  };  
  
  return _this;
});
/** @private */
var ReferencePlayer = (function (uid, adDomElement, refAdPlayer) {
  /** @private */ var _this = new AbstractPlayer(uid, adDomElement);
  /** @private */ var _defaultPlayer = new DefaultPlayer(uid, adDomElement);
  
  function updateRef(fnName, params){
    _defaultPlayer[fnName].apply(_this, params);
    refAdPlayer[fnName].apply(_this, params);
  }
  
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
    // refAdPlayer['enableAdChoice'].apply(_this, [openBtnTxt, closeTxt, headerTxt, footerTxt, iconPos, this]);
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
/** @private */
var IframePlayer = (function (uid, adDomElement) {
  /** @private */ var _this = new AbstractPlayer(uid, adDomElement);
  /** @private */ var _defaultPlayer = new DefaultPlayer(uid, adDomElement);

  function updateRef(fnName, params){
    return _defaultPlayer[fnName].apply(_this, params);
  }
  
  function sendToParentFrame(fn, params, json) {
    var obj;
    if (json) {
      obj = json;
    } else {
      obj = new Object();
    }
    obj.postType = PostMessage.OUTGOING;
    obj.uid = uid;
    obj.fn = fn;
    obj.params = params.toString();
    PostMessage.send(obj, parent);
  }
  
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
    return escape(PostMessage.FUNCTION + funcName);
  }  
  
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
    if (!AdEvent.check(adEvent)) { return; }
    if (repeat === undefined) { repeat = true; }
    if (url) {
      /** @private */
      function defaultTrackCallBack(evt) {
        var urlReq = new PixelRequest(url);
        urlReq.load();
        if(!repeat) {
          _this.removeEventListener(evt.type(), defaultTrackCallBack);
        }
      }
      defaultTrackCallBack.url = url;
      defaultTrackCallBack.repeat = repeat;
      this.addEventListener(adEvent, defaultTrackCallBack, false);
    } else {
      Util.log("Parameter 'url' must be defined", "addTrackingEvent");
    }    
    //updateRef('addTrackingPixel', [adEvent, url, repeat, this]);
    //sendToParentFrame('addTrackingPixel', [adEvent, url, repeat]);
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
    //updateRef('removeTrackingPixel', [adEvent, url, this]);
    //sendToParentFrame('removeTrackingPixel', [adEvent, url]);
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
 *  Util.log(adPlayer.privacyInfoList());
 * &lt;/script&gt;
 */
var PlayerFactory = (function(uid, domRefId, fnInit, refAdPlayer){
   var _this = {};
   if(!uid) { Util.log('Unique ID is required.', 'AdPlayer'); return; }
 
   /* 
    * Check Order:
    * 1) uid, domId, null, refAdPlayer
    * 2) uid, domId, null, null
    * 3) uid, null, null, refAdPlayer
    * 4) uid, null, null, null 
   */
   var _isInIFrame = (window.location != window.parent.location) ? true : false;
   
   function init() {
     if (domRefId && !refAdPlayer) {
       if(checkAdMgrDomList(domRefId)) {
         Util.ready(function(){return AdPlayerManager.getAdPlayerById(domRefId);}, _this, domRefAdPlayerInit, [domRefId, fnInit], returnDefault, [uid, domRefId, fnInit], true);
       } else {
         addToAdMgrList(domRefId);
         if (AdPlayerManager.isSearching()) {
           Util.ready(function(){return document.getElementById(domRefId);}, _this, parentDomSearch, [uid, domRefId, fnInit], returnDefault, [uid, domRefId, fnInit], true);
         } else {
           Util.ready(function(){return document.getElementById(domRefId);}, _this, parentDomSearch, [uid, domRefId, fnInit], returnDefault, [uid, domRefId, fnInit], false);
         }
       }
     }
     else if (domRefId && refAdPlayer) {
       if(checkAdMgrDomList(domRefId)) {
         Util.ready(function(){return refAdPlayer;}, _this, refAdPlayerInit, [refAdPlayer, uid, domRefId, fnInit], returnDefault, [uid, domRefId, fnInit], false);         
       } else {
         addToAdMgrList(domRefId);
         Util.ready(function(){return document.getElementById(domRefId);}, _this, refAdPlayerInit, [refAdPlayer, uid, domRefId, fnInit], returnDefault, [uid, domRefId, fnInit], false);
       }

     }     
     else if(!domRefId && refAdPlayer) {
       domRefId = setDocWriteRef();
       addToAdMgrList(domRefId);
       Util.ready(function(){return document.getElementById(domRefId);}, _this, refAdPlayerInit, [refAdPlayer, uid, domRefId, fnInit], returnDefault, [uid, domRefId, fnInit], true);
     }
     else if(!domRefId && !refAdPlayer) {
       domRefId = setDocWriteRef();
       if(checkAdMgrDomList(domRefId)) {
         Util.ready(function(){return AdPlayerManager.getAdPlayerById(domRefId);}, _this, domRefAdPlayerInit, [domRefId, fnInit], returnDefault, [uid, domRefId, fnInit], true);
       } else {
         addToAdMgrList(domRefId);
         if (AdPlayerManager.isSearching()) {
           Util.ready(function(){return document.getElementById(domRefId);}, _this, parentDomSearch, [uid, domRefId, fnInit], returnDefault, [uid, domRefId, fnInit], true);
         } else {
           Util.ready(function(){return document.getElementById(domRefId);}, _this, parentDomSearch, [uid, domRefId, fnInit], returnDefault, [uid, domRefId, fnInit], false);
         }
       }       
     }
   }
   
   function refAdPlayerInit(refPlayer, uid, domRefId, fnInit) {   
     if (document.getElementById(domRefId)) {
       fnInit(new ReferencePlayer(uid, document.getElementById(domRefId), refPlayer));
     } else {
       fnInit(new ReferencePlayer(uid, refPlayer.adDomElement(), refPlayer));
     }     
   }

   function domRefAdPlayerInit(domRefId, fnInit) {   
     fnInit(AdPlayerManager.getAdPlayerById(domRefId));   
   }   
   
   function checkAdMgrDomList(domRef) {
     var isListed = false;
     for (var i=0; i < AdPlayerManager.domIdList().length; i++) {
       if(AdPlayerManager.domIdList()[i] == domRef) {
         isListed = true;
         break;
       }
     }
     return isListed;
   }

   function addToAdMgrList(id) {
     for (var i=0; i < AdPlayerManager.domIdList().length; i++) {
       if(AdPlayerManager.domIdList()[i] == id) {
         return;
       }
     }
     AdPlayerManager.domIdList().push(id);
   }   
   
   function removeFromAdMgrList(id) {
     for (var i=0; i < AdPlayerManager.domIdList().length; i++) {
       if(AdPlayerManager.domIdList()[i] == id) {
         AdPlayerManager.domIdList().splice(i, 1);
         break;
       }
     }
   }
   
   function parentDomSearch(uid, domRef, fnInit) {
     // Attempt to find the top most player.
     var par = document.getElementById(domRef).parentNode;
     while (!AdPlayerManager.getAdPlayerById(par.id)) {
       par = par.parentNode;
       parName = par.nodeName.toLowerCase();
       if ((parName == 'body') || (parName == 'html')) { break; }
     }      
     if(par) {
       var adPlayer = AdPlayerManager.getAdPlayerById(par.id); 
       if(adPlayer) {
         // adPlayer.adDomElement().removeChild(document.getElementById(domRef));
         if(fnInit) {
           Util.log('Found player at '+adPlayer.adDomElement().id);
           fnInit(adPlayer);  
         }
         removeFromAdMgrList(domRef);
       } else {
         Util.log('No AdPlayer found after parent search. Creating new player for ' + uid);
          if (_isInIFrame) {
            
            // Check if Stub file is used
            if (String(window.location).search(/apstub.html\#\{(.*?)\}/) > -1) {
              function setStub(uid, domRef) {
                for (var i=0; i < parent.document.getElementsByTagName('iframe').length; i++){
                  if(parent.document.getElementsByTagName('iframe')[i].contentWindow == window) {
                    var player =  parent.PostMessageHandler.getPlayerByDomSearch(parent.document.getElementsByTagName('iframe')[i]);
                    if (player) {
                      fnInit(player);
                    } else {
                      fnInit(new DefaultPlayer(uid, document.getElementById(domRef)));
                    }
                    break;
                  }
                }                 
              }
              setStub(uid, domRef);
              return;
            }
            
            var iframePlayer = new IframePlayer(uid, document.getElementById(domRef));
            fnInit(iframePlayer);
            
            // Check parent frame & temporarily add this factory to the player list with a UID
            var uAdId = uid + new Date().getTime();
            _this.uid = function() {
              return uAdId;
            }
            AdPlayerManager.factoryList().push(_this);            
            var obj = new Object();
            obj.postType = PostMessage.OUTGOING;
            obj.uid = _this.uid();
            obj.fn = 'iframePlayerVerify';
            PostMessage.send(obj, parent);
            
            _this.setIframePlayerType = function(json) {
              for (var i = 0; i < AdPlayerManager.list().length; i++) {
                if (AdPlayerManager.list()[i].uid() == _this.uid()) {
                  AdPlayerManager.list().splice(i, 1);
                  break;
                }
              }              
              if (json.params == true) {
                iframePlayer.disableAdChoice();
              } 
            }
         } else {
           fnInit(new DefaultPlayer(uid, document.getElementById(domRef)));  
         }         
         removeFromAdMgrList(domRef);
       }
     }     
   }
   
   function returnDefault(uid, domRef, fnInit) {
     fnInit(new DefaultPlayer(uid, document.getElementById(domRef)));
   }
   
   function setDocWriteRef() {
     var uAdId = new Date().getTime();
     Util.log('WARNING: No valid referral element specified for "'+uid+'". Referral will be created using "document.write"', 'parentDomSearch');
     domId = 'ref'+ uAdId;
     document.write('<span id="'+domId+'"></span>');
     return domId;
   }
   
   init();
   return _this;
});
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
  /** @private */ var _queue = [];
  
  function init() {}
  
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

  _factoryList = [];
  _this.factoryList = function() {
    return _factoryList;
  };    
  
  var _domIdList = [];
  _this.domIdList = function() {
    return _domIdList;
  }; 
  
  /** @private */ _this.searchCount = 0;
  /** @private */ _this.isSearching = function(val) {
    if (_this.searchCount == 0) {
      return false;
    } else {
      return true;
    }
  }    
  
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
      if (typeof _adPlayerList[i].adDomElement !== 'undefined') {
        if (_adPlayerList[i].adDomElement().id == id) {
          return _adPlayerList[i];
        }
      } else {
        Util.log('DOM element is not properly specified.','getPlayerById');
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
        Util.log('DOM element is not properly specified.','getPlayerByDomElement');
      }
    }
    return null;
  };    
  
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