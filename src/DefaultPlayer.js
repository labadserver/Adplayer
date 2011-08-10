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

  _this.removeEventListener = function(adEvent, callback, uidName) {
    if (!AdEvent.check(adEvent)) { return; }
    if (this.adEventListObj()[adEvent]) {
      for (var i = 0; i < this.adEventListObj()[adEvent].length; i++) {
        if (uidName) {
          if (uidName == this.adEventListObj()[adEvent][i].uidName) {
            this.adEventListObj()[adEvent].splice(i, 1);
//            console.log('REMOVING!:'+callback);
            break;            
          }
        } else {
          if (this.adEventListObj()[adEvent][i] == callback ) {
            this.adEventListObj()[adEvent].splice(i, 1);
//            console.log('REMOVING!:'+callback);
            break;      
          }
        }
      }
      if (this.adEventListObj()[adEvent].length == 0) {
        delete this.adEventListObj()[adEvent];
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
      this.addEventListener(adEvent, defaultTrackCallBack, false);
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
//    log(adEventObj.type(), 'track');
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
      for (var i=0; i < this.adDomElement().getElementsByTagName('button').length; i++) {
        if(this.adDomElement().getElementsByTagName('button')[0].className == 'privacyButton');
        return;
      }
      this.isAdChoiceEnabled(true);
      this.privacyClickBtn = document.createElement('button');
      this.privacyClickBtn.setAttribute('class', 'privacyButton');
      if (AdPlayerManager.isIE) {
        this.privacyClickBtn.setAttribute('className', 'privacyButton'); // IE Fix
      }
      this.privacyClickBtn.innerHTML = 'Get Info';
      
//      if (AdPlayerManager.isFF) {
//        var ffDiv = document.createElement('div');
//        // Fixes known firefox issue that causes swf to reload when applying css position
//        ffDiv.setAttribute('class', 'privacyButtonDiv');
//        ffDiv.appendChild(this.privacyClickBtn);
//        ffDiv.style.position = "relative";
//        ffDiv.style.cssFloat = "left";
//        this.adDomElement().appendChild(ffDiv);
//      } else {
        this.adDomElement().style.position = "relative";
        this.adDomElement().appendChild(this.privacyClickBtn);        
//      }
      
      var parentThis = this;
      this.privacyClickBtn.onclick = function() {
        parentThis.showPrivacyInfo();      
      }
    }
  };

  _this.disableAdChoice = function() {
    if (this.isPrivacyPanelEnabled()) {
      if(this.privacyClickBtn) {
        this.isAdChoiceEnabled(false);
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
      
//      if (AdPlayerManager.isFF) {
//        for (var i=0; i < this.adDomElement().getElementsByTagName('div').length; i++) {
//            if(this.adDomElement().getElementsByTagName('div')[i].className == 'privacyButtonDiv') {
//              this.adDomElement().getElementsByTagName('div')[i].appendChild(this.privacyPanel);
//            break;
//          }
//        }        
//      } else {
        this.adDomElement().appendChild(this.privacyPanel);
//      }
      
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
//      if (AdPlayerManager.isFF) {
//        for (var i=0; i < this.adDomElement().getElementsByTagName('div').length; i++) {
//            if(this.adDomElement().getElementsByTagName('div')[i].className == 'privacyButtonDiv') {
//              this.adDomElement().getElementsByTagName('div')[i].removeChild(this.privacyPanel);
//            break;
//          }
//        }        
//      } else {
        this.adDomElement().removeChild(this.privacyPanel);
//      }      
      this.privacyPanel = null;
      this.track(new AdEvent(AdEvent.PRIVACY_CLOSE));
    }
  };  
  
  return _this;
});