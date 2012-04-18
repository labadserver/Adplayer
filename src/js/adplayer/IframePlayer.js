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