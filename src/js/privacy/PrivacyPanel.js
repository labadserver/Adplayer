/**
 * @private
 * @name $ADP.PrivacyPanel
 * @class 
 * @description Handles display of all privacy information passed to current <code>AdPlayer</code> instance.
 * @param {array} infoList List containing <code>$ADP.PrivacyInfo</code> objects. 
 * @param {string} closeTxt Optional - Close button text. 'X' is default value.
 * @param {string} headerTxt Optional - Header text.
 * @param {string} footerTxt Optional - Footer text.
 * @param {string} closeCallback Function to call when close button is clicked.
 * @param {string} trackCallback Function to call when link is clicked.  <code>trackCallback</code> passes an
 *                  a new <code>Advent.PRIVACY_CLICK</code> instance.
 * @see $ADP.PrivacyInfo
 * @see $ADP.AdEvent
 * @author christopher.sancho@adtech.com
 */
$ADP.PrivacyPanel = (function (infoList, closeCallback, trackCallback, closeTxt, headerTxt, footerTxt) {
  /** @private */ var _this = {};
  /** @private */ var _listObj;
  /** @private */ var _infoList;
  /** @private */ var _privPanelClassName = 'privacyPanel';
  
  /**
   * @name $ADP.PrivacyPanel#panel
   * @field
   * @description DOM object of current privacy panel.
   * @example
   */ 
  _this.panel;
  
  /**
   * @name $ADP.PrivacyPanel#infoList
   * @field
   * @description List containing <code>$ADP.PrivacyInfo</code> objects. 
   * @param {string} val List to set, which contains <code>$ADP.PrivacyInfo</code> objects.
   * @example
   * // Get reference to property
   * var infoList = $ADP.PrivacyPanel.infoList();
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
   * @name $ADP.PrivacyPanel#headerTxt
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
          if (!checkPanel('div', $ADP.Util.cssPrefixed('header'))) {
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
   * @name $ADP.PrivacyPanel#footerTxt
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
          if (!checkPanel('div', $ADP.Util.cssPrefixed('footer'))) {
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
    $ADP.Util.setClassName(_this.panel, $ADP.Util.cssPrefixed(_privPanelClassName));
    
    _closeTxtObj = document.createElement('div');
    $ADP.Util.setClassName(_closeTxtObj, $ADP.Util.cssPrefixed('close'));
    _closeTxtObj.innerHTML = _this.closeTxt(closeTxt);
    _closeTxtObj.onclick = closeCallback;
    _this.panel.appendChild(_closeTxtObj);
    
    _headerTxtObj = document.createElement('div');
    $ADP.Util.setClassName(_headerTxtObj, $ADP.Util.cssPrefixed('header'));
    _this.headerTxt(headerTxt);

    _listObj = document.createElement('ul');
    $ADP.Util.setClassName(_listObj, $ADP.Util.cssPrefixed('privacyInfoList'));
    _this.panel.appendChild(_listObj);
    _this.infoList(infoList);
    
    _footerTxtObj = document.createElement('div');
    $ADP.Util.setClassName(_footerTxtObj, $ADP.Util.cssPrefixed('footer'));
    _this.footerTxt(footerTxt);
  }
  
  /**
   * @name $ADP.PrivacyPanel#addPrivacyInfo
   * @function
   * @description Adds <code>PrivacyInfo</code> to privacy DOM panel.
   * @param {object} privacyInfoObj <code>PrivacyInfo</code> object.
   * @see $ADP.PrivacyInfo
   */
  function addPrivacyInfo(privacyInfoObj) {
    var privacyObj =  document.createElement('li');
    privacyObj.setAttribute('class', $ADP.Util.cssPrefixed('privacyItem'));
    if ($ADP.Util.isIE) { privacyObj.setAttribute('className', $ADP.Util.cssPrefixed('privacyItem')); } // IE Fix        
    privacyClick = function(url) {
      var data = new Object();
      data.url = url;
      trackCallback(new $ADP.AdEvent($ADP.AdEvent.PRIVACY_CLICK, data));
      window.open(url);          
    }
    privacyObj.innerHTML = '<h4 class="' + $ADP.Util.cssPrefixed('privacyItemHeader') + '">' + privacyInfoObj.adServer + '</h4><p class="' + $ADP.Util.cssPrefixed('privacyItemInfo') + '">' + privacyInfoObj.message+'</p><p class="' + $ADP.Util.cssPrefixed('privacyItemLinkOuter') + '"><a class="'+ $ADP.Util.cssPrefixed('privacyItemLink')+'" href="javascript:privacyClick(\''+privacyInfoObj.url+'\');" target="_self">'+privacyInfoObj.urlText+'</a></p>';
    _listObj.appendChild(privacyObj);
  }
  
  /**
   * @name $ADP.PrivacyPanel#checkPanel
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
   * @name $ADP.PrivacyPanel#setPosition
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
    $ADP.Util.setClassName(_this.panel, $ADP.Util.cssPrefixed(_privPanelClassName) + ' ' + $ADP.Util.cssPrefixed(pos));
  }    
    
  
  init();
  return _this;
});