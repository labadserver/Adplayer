/**
 * @private 
 * @name $ADP.ReferencePlayer
 * @class <code>AdPlayer</code> implementation responsible for players being referenced through 
 *        another <code>AdPlayer</code> instance.
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
   *              synced between related <code>AdPlayers</code>.
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