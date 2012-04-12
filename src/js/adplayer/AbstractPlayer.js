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