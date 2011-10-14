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
    AdPlayerManager.setClassName(_this.panel, _privPanelClassName);
    
    _closeTxtObj = document.createElement('div');
    AdPlayerManager.setClassName(_closeTxtObj, 'close');
    _closeTxtObj.innerHTML = _this.closeTxt(closeTxt);
    _closeTxtObj.onclick = closeCallback;
    _this.panel.appendChild(_closeTxtObj);
    
    _headerTxtObj = document.createElement('div');
    AdPlayerManager.setClassName(_headerTxtObj, 'header');
    _this.headerTxt(headerTxt);

    _listObj = document.createElement('div');
    AdPlayerManager.setClassName(_listObj, 'list');
    _this.panel.appendChild(_listObj);
    _this.infoList(infoList);
    
    _footerTxtObj = document.createElement('div');
    AdPlayerManager.setClassName(_footerTxtObj, 'footer');
    _this.footerTxt(footerTxt);
  }
  
  function addPrivacyInfo(privacyInfoObj) {
    var privacyObj =  document.createElement('div');
    privacyObj.setAttribute('class', 'item');
    if (AdPlayerManager.isIE) { privacyObj.setAttribute('className', 'item'); } // IE Fix        
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
    
    AdPlayerManager.setClassName(_this.panel, _privPanelClassName + ' ' + pos);
  }    
    
  
  init();
  return _this;
});