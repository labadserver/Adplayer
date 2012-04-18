/**
 * @private
 * @name $ADP.PrivacyInfoButton
 * @class 
 * @description Handles display of privacy information button for current <code>$ADP.AdPlayer</code> instance.
 * @param {function} callback Function to execute when button is clicked.
 * @param {string} openBtnTxt Optional - Text to use for button.
 * @author christopher.sancho@adtech.com
 */
$ADP.PrivacyInfoButton = (function (callback, openBtnTxt) {
  /** @private */ var _this = {};
  /** @private */ var _openBtnIcon;
  /** @private */ var _openBtnTxtObj;
  /** @private */ var _privBtnClassName = 'privacyButton';

  /**
   * @name $ADP.PrivacyInfoButton#button
   * @field
   * @description DOM object of current privacy button.
   * @example
   */ 
  _this.button;
  
  /**
   * @name $ADP.PrivacyInfoButton#openBtnTxt
   * @field 
   * @description 
   * @param {string} val
   * @example
   * // Get reference to property
   * var txt = privacyButton.openBtnTxt();
   * 
   * // Set property's value
   * privacyButton.openBtnTxt('Open');  
   */ 
  var _openBtnTxt = 'Get Info';
  _this.openBtnTxt = function(val) {
    if(val) {
      _openBtnTxt = val;
      if (_openBtnTxtObj) {
        _openBtnTxtObj.innerHTML = _openBtnTxt;
      }
    }
    return _openBtnTxt;
  } 

  /**
   * @private
   * @function
   * @description Creates DOM elements along with its attributes.  
   */
  function init() {
    _this.openBtnTxt(openBtnTxt);
    
    _this.button = document.createElement('div');
    $ADP.Util.setClassName(_this.button, $ADP.Util.cssPrefixed(_privBtnClassName));
    
    _openBtnIcon = document.createElement('div');
    $ADP.Util.setClassName(_openBtnIcon, $ADP.Util.cssPrefixed('icon'));
    _this.button.appendChild(_openBtnIcon);
    
    _openBtnTxtObj = document.createElement('div');
    $ADP.Util.setClassName(_openBtnTxtObj, $ADP.Util.cssPrefixed('text'));
    _openBtnTxtObj.style.display = "none";
    _this.button.appendChild(_openBtnTxtObj);
    _openBtnTxtObj.innerHTML = _this.openBtnTxt();
       
    _this.button.onclick = callback;
    
    _openBtnIcon.onmouseover = function() {
      _openBtnTxtObj.style.display = "block";
    };
    _openBtnIcon.onmouseout = function() {
      _openBtnTxtObj.style.display = "none";
    };
  }

  /**
   * @name $ADP.PrivacyInfoButton#setPosition
   * @function
   * @description Sets the position of the button relative to its parent DOM element.
   * @param {string} pos Position where to set panel.</br>  
   *                 Valid values:
   *                 <ul>
   *                   <li>top-left</li>
   *                   <li>top-right</li>
   *                   <li>top-left-out</li>
   *                   <li>top-right-out</li>
   *                   <li>bottom-left</li>
   *                   <li>bottom-right</li>
   *                   <li>bottom-left-out</li>
   *                   <li>bottom-right-out</li>
   *                 </ul>
   */
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
    
    $ADP.Util.setClassName(_this.button, $ADP.Util.cssPrefixed(_privBtnClassName) + ' ' + $ADP.Util.cssPrefixed(pos));
  }    
  
  init();
  return _this;
});