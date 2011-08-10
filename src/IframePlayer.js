/** @private */
var IframePlayer = (function (uid, adDomElement) {
  /** @private */ var _this = new AbstractPlayer(uid, adDomElement);
  /** @private */ var _defaultPlayer = new DefaultPlayer(uid, adDomElement);
  
  function updateRef(fnName, params){
    _defaultPlayer[fnName].apply(_this, params);
  }
  
  function sendToParentFrame(fn, params, json) {
    jsonString = '{ "postType":"'+PostMessage.OUTGOING+'", "uid":"'+uid+'", "fn":"'+fn+'", "params":"'+params.toString()+'" '
    if(json) { jsonString += (', ' + json); }
    jsonString += '}';
    parent.postMessage (jsonString, "*");
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
  
  _this.addEventListener = function(adEvent, callback) {
    callback.uidName = uid + new Date().getTime();
    updateRef('addEventListener', [adEvent, callback, this]);
    sendToParentFrame('addEventListener', [adEvent, getFunctionName(callback.toString())], '"uidName":"'+callback.uidName+'"');
  };

  _this.removeEventListener = function(adEvent, callback, uidName) {
    updateRef('removeEventListener', [adEvent, callback, uidName, this]);
    sendToParentFrame('removeEventListener', [adEvent, getFunctionName(callback.toString())], '"uidName":"'+callback.uidName+'"');
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
          _this.removeEventListener(evt.type(), defaultTrackCallBack);
        }
      }
      defaultTrackCallBack.url = url;
      defaultTrackCallBack.repeat = repeat;
      this.addEventListener(adEvent, defaultTrackCallBack, false);
    } else {
      log("Parameter 'url' must be defined", "addTrackingEvent");
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

  _this.addPrivacyInfo = function(adServer, message, url) {
    updateRef('addPrivacyInfo', [adServer, message, url, this]);
    sendToParentFrame('addPrivacyInfo', [adServer, message, url]);
  };

  _this.enableAdChoice = function() {
    //updateRef('enableAdChoice', []);
    sendToParentFrame('enableAdChoice', []);
  };

  _this.showPrivacyInfo = function() {
    updateRef('showPrivacyInfo', [this]);
    sendToParentFrame('showPrivacyInfo', [null]);
  };

  _this.hidePrivacyInfo = function() {
    updateRef('hidePrivacyInfo', [this]);
    sendToParentFrame('hidePrivacyInfo', [null]);
  };  
  
  return _this;
});