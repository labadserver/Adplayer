/**
 * @private
 * @name PrivacyPanel
 * @class 
 * @description Handles display of all privacy information passed to current <code>AdPlayer</code> instance.
 * @param {array} infoList List containing <code>PrivacyInfo</code> objects. 
 * @param {string} closeTxt Optional - Close button text. 'X' is default value.
 * @param {string} headerTxt Optional - Header text.
 * @param {string} footerTxt Optional - Footer text.
 * @param {string} closeCallback Function to call when close button is clicked.
 * @param {string} trackCallback Function to call when link is clicked.  <code>trackCallback</code> passes an
 *                  a new <code>Advent.PRIVACY_CLICK</code> instance.
 * @see PrivacyInfo
 * @see AdEvent
 * @author christopher.sancho@adtech.com
 */
var PrivacyPanel = (function (infoList, closeCallback, trackCallback, closeTxt, headerTxt, footerTxt) {
  /** @private */ var _this = {};
  /** @private */ var _listObj;
  /** @private */ var _infoList;
  /** @private */ var _privPanelClassName = 'privacyPanel';
  
  /**
   * @name PrivacyPanel#panel
   * @field
   * @description DOM object of current privacy panel.
   * @example
   */ 
  _this.panel;
  
  /**
   * @name PrivacyPanel#infoList
   * @field
   * @description List containing <code>PrivacyInfo</code> objects. 
   * @param {string} val List to set, which contains <code>PrivacyInfo</code> objects.
   * @example
   * // Get reference to property
   * var infoList = privacyPanel.infoList();
   * 
   * // Set property's value
   * privacyPanel.infoList(objList);  
   */ 
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

 /**
  * @name PrivacyPanel#closeTxt
  * @field
  * @description Close button text. 'X' is default value. 
  * @param {string} val Close button text.
  * @example
  * // Get reference to property
  * var txt = privacyPanel.closeTxt();
  * 
  * // Set property's value
  * privacyPanel.closeTxt('Close');  
  */
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

  /**
   * @name PrivacyPanel#headerTxt
   * @field
   * @description Header text positioned above ad privacy list. 
   * @param {string} val Header text.
   * @example
   * // Get reference to property
   * var txt = privacyPanel.headerTxt();
   * 
   * // Set property's value
   * privacyPanel.headerTxt('Hello world!');  
   */
  var _headerTxtObj;
  var _headerTxt = '';
    _this.headerTxt = function(val) {
    if(val) {
      _headerTxt = val;
      if (_headerTxtObj) {
        _headerTxtObj.innerHTML = _headerTxt;
        if (_headerTxt != '') {
          if (!checkPanel('div', Util.cssPrefixed('header'))) {
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
  
  /**
   * @name PrivacyPanel#footerTxt
   * @field
   * @description Footer text positioned below ad privacy list. 
   * @param {string} val Footer text.
   * @example
   * // Get reference to property
   * var txt = privacyPanel.footerTxt();
   * 
   * // Set property's value
   * privacyPanel.footerTxt('Hello world!');  
   */
  var _footerTxtObj;
  var _footerTxt = '';
    _this.footerTxt = function(val) {
    if(val) {
      _footerTxt = val;
      if (_footerTxtObj) {
        _footerTxtObj.innerHTML = _footerTxt;
        if (_footerTxt != '') {
          if (!checkPanel('div', Util.cssPrefixed('footer'))) {
            _this.panel.appendChild(_footerTxtObj);
          }
        }
      }
    }
    return _headerTxt;
  }  
  
  /**
   * @private
   * @function
   * @description Creates DOM elements along with its attributes.  
   */
  function init() {
    _this.panel = document.createElement('div');
    Util.setClassName(_this.panel, Util.cssPrefixed(_privPanelClassName));
    
    _closeTxtObj = document.createElement('div');
    Util.setClassName(_closeTxtObj, Util.cssPrefixed('close'));
    _closeTxtObj.innerHTML = _this.closeTxt(closeTxt);
    _closeTxtObj.onclick = closeCallback;
    _this.panel.appendChild(_closeTxtObj);
    
    _headerTxtObj = document.createElement('div');
    Util.setClassName(_headerTxtObj, Util.cssPrefixed('header'));
    _this.headerTxt(headerTxt);

    _listObj = document.createElement('ul');
    Util.setClassName(_listObj, Util.cssPrefixed('privacyInfoList'));
    _this.panel.appendChild(_listObj);
    _this.infoList(infoList);
    
    _footerTxtObj = document.createElement('div');
    Util.setClassName(_footerTxtObj, Util.cssPrefixed('footer'));
    _this.footerTxt(footerTxt);
  }
  
  /**
   * @name PrivacyPanel#addPrivacyInfo
   * @function
   * @description Adds <code>PrivacyInfo</code> to privacy DOM panel.
   * @param {object} privacyInfoObj <code>PrivacyInfo</code> object.
   * @see PrivacyInfo
   */
  function addPrivacyInfo(privacyInfoObj) {
    var privacyObj =  document.createElement('li');
    privacyObj.setAttribute('class', Util.cssPrefixed('privacyItem'));
    if (Util.isIE) { privacyObj.setAttribute('className', Util.cssPrefixed('privacyItem')); } // IE Fix        
    privacyClick = function(url) {
      var data = new Object();
      data.url = url;
      trackCallback(new AdEvent(AdEvent.PRIVACY_CLICK, data));
      window.open(url);          
    }
    privacyObj.innerHTML = '<h4 class="' + Util.cssPrefixed('privacyItemHeader') + '">' + privacyInfoObj.adServer + '</h4><p class="' + Util.cssPrefixed('privacyItemInfo') + '">' + privacyInfoObj.message+'</p><p class="' + Util.cssPrefixed('privacyItemLinkOuter') + '"><a class="'+ Util.cssPrefixed('privacyItemLink')+'" href="javascript:privacyClick(\''+privacyInfoObj.url+'\');" target="_self">'+privacyInfoObj.urlText+'</a></p>';
    _listObj.appendChild(privacyObj);
  }
  
  /**
   * @name PrivacyPanel#checkPanel
   * @function
   * @description Checks if panel contains a certain element with a defined class name.
   * @param {string} tagName DOM element.
   * @param {className} Class name.
   */
  function checkPanel(tagName, className) {
    for (var i = 0; i < _this.panel.getElementsByTagName(tagName).length; i++) {
      if (_this.panel.getElementsByTagName(tagName)[i].className == className){
        return _this.panel.getElementsByTagName(tagName)[i];
      }
    }
    return null;
  }
  
  /**
   * @name PrivacyPanel#setPosition
   * @function
   * @description Sets the position of the panel relative to its parent DOM element.
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
    
    Util.setClassName(_this.panel, Util.cssPrefixed(_privPanelClassName) + ' ' + pos);
  }    
    
  
  init();
  return _this;
});