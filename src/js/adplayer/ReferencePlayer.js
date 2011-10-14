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