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
    AdPlayerManager.setClassName(_this.button, _privBtnClassName);
    
    _openBtnIcon = document.createElement('div');
    AdPlayerManager.setClassName(_openBtnIcon, 'icon');
    _this.button.appendChild(_openBtnIcon);
    
    _openBtnTxtObj = document.createElement('div');
    AdPlayerManager.setClassName(_openBtnTxtObj, 'text');
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
    
    AdPlayerManager.setClassName(_this.button, _privBtnClassName + ' ' + pos);
  }    
  
  init();
  return _this;
});