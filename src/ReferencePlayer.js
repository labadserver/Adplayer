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

  _this.removeEventListener = function(adEvent, callback) {
    updateRef('removeEventListener', [adEvent, callback, this]);    
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

  _this.addPrivacyInfo = function(adServer, message, url) {
    updateRef('addPrivacyInfo', [adServer, message, url, this]);
  };

  _this.enableAdChoice = function() {
    updateRef('enableAdChoice', [this]);
  };

  _this.showPrivacyInfo = function() {
    updateRef('showPrivacyInfo', [this]);    
  };

  _this.hidePrivacyInfo = function() {
    updateRef('hidePrivacyInfo', [this]);    
  };  
  
  return _this;
});