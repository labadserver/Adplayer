/** @private */
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
//            console.log('REMOVING!:'+callback);
            break;            
          }
        } else {
          if (_this.adEventListObj()[adEvent][i] == callback ) {
            _this.adEventListObj()[adEvent].splice(i, 1);
//            console.log('REMOVING!:'+callback);
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
        var urlReq = new URLRequest(url);
        urlReq.load();
        if(!repeat) {
          _this.removeEventListener(evt.type(), defaultTrackCallBack);
        }
      }
      defaultTrackCallBack.url = url;
      defaultTrackCallBack.repeat = repeat;
      _this.addEventListener(adEvent, defaultTrackCallBack, false);
    } else {
      log("Parameter 'url' must be defined", "addTrackingEvent");
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
//    log(adEventObj.type(), 'track');
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
      var urlReq = new URLRequest(url);
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
    //if (_this.isPrivacyPanelEnabled()) {
      //  if(_this.privacyInfoBtn) {
    //if(_this.isAdChoiceEnabled() === true) {
          _this.adDomElement().removeChild(_this.privacyInfoBtn.button);
    //}
    //}
  };

  _this.showPrivacyInfo = function() {
//    if (!_this.isPrivacyPanelEnabled()) {
      _this.adDomElement().appendChild(_this.privacyPanel.panel);
      _this.isPrivacyPanelEnabled(true);
      _this.track(new AdEvent(AdEvent.PRIVACY_OPEN));
//    }
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