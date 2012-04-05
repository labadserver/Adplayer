/**
 * @name Util
 * @class Static class for all common methods.
 * @description The Util class provides common methods used across AdPlayer.
 * 
 * @author christopher.sancho@adtech.com, marius.naumann@bauermedia.com
 */
var Util = (function () {
  /** @private */ var _this = {};
  
  /**
   * @name Util#jsonUrl
   * @field
   * @description Location of the external JSON framework script needed for browsers 
   *              that do not natively support JSON. By default, <code>Util.jsonUrl</code>
   *              is set to look for the script in a relative path: </code>js/json2.min.js</code>
   * @example
   * // Get reference to property
   * Util.log(Util.jsonUrl);
   * 
   * // Set property's value
   * Util.jsonUrl = "http://new.uri.of.json.script";  
   */
  _this.jsonUrl = 'js/json2.min.js';
  
  /**
   * @name Util#cssPrefix
   * @field
   * @description Prefix for stylesheet ids and class names to allow unique descriptors.  
   *              By default, <code>Util.cssPrefix</code> is set to <code>adplayer</code>.
   * @example
   * // Get reference to property
   * Util.log(Util.cssPrefix);
   * 
   * // Set property's value
   * Util.cssPrefix = "anotherPrefix";  
   */
  _this.cssPrefix = 'adplayer';
  
  /**
   * @name Util#cssPrefixed
   * @function
   * @description Generates and returns a prefixed version of the given class name. This method uses the
   *              <code>Util.cssPrefix</code> property and a dash (-) as delimiter.
   * @param {string} className The original class name without prefix.
   * 
   * @example
   * // Result: 'adplayer-myClassName'
   *  Util.cssPrefixed('myClassName');
   */
  _this.cssPrefixed = function(className) {
    return _this.cssPrefix + '-' + className;
  };
  
  /**
   * @name Util#isIE
   * @field
   * @description Returns <code>true</code> if browser is Internet Explorer. 
   * @example
   * if (Util.isIE) {
   *  Util.log('The current browser is Internet Explorer.');
   * }
   */
  _this.isIE  = (navigator.appVersion.indexOf("MSIE") != -1) ? true : false;

  /**
   * @name Util#isOpera
   * @field
   * @description Returns <code>true</code> if browser is Opera. 
   * @example
   * if (Util.isOpera) {
   *  Util.log('The current browser is Opera.');
   * }
   */
  _this.isOpera = (navigator.userAgent.indexOf("Opera") != -1) ? true : false;      

  /**
   * @name Util#isFF
   * @field
   * @description Returns <code>true</code> if browser is Firefox. 
   * @example
   * if (Util.isFF) {
   *  Util.log('The current browser is Firefox.');
   * }
   */  
  _this.isFF = (navigator.userAgent.indexOf("Firefox") != -1) ? true : false;    
  
  /**
   * @name Util#log
   * @function
   * @description Logs a message through the console; if available.
   * @param {string} msg The message to log.
   * @param {string} ref Optional - An identifer used to reference the source of a message.
   * @example
   * // "AdPlayer(Parent): This is a log output."
   *  Util.log('This is a log output', 'Parent');  
   */
  _this.log = function(msg, ref) {
    if(typeof(console) !== 'undefined' && console != null) {
      if (ref) {
        console.log('AdPlayer(' + ref + '): ' + msg);
      } else {
        console.log('AdPlayer: ' + msg);
      }
    }
  };

  /**
   * @name Util#setClassName
   * @function
   * @description Sets a cross-browser compatible class attribute to a DOM object. 
   * @param {dom} domObj DOM object that class attribute will be set. 
   * @param {string} className Value of the class attribute.
   * @example
   * var a = document.getElementById('dom-container');
   * Util.setClassName(a, 'ad-container');  
   */ 
  _this.setClassName = function (domObj, className) {
    domObj.setAttribute('class', className);
    if (_this.isIE) { domObj.setAttribute('className', className); } // IE Fix        
  }

  /**
   * @name Util#ready
   * @function
   * @description Executes a callback function when an object, being returned in a <code>testFn</code>, is valid.
   * @param {function} testFn Function that returns object to test against. Note: Implemented to avoid use of eval();
   * @param {object} context Context of where <code>readyFn</code> & <code>errorFn</code> are located. 
   * @param {function} readyFn Function called when object being tested returns <code>true</code>.
   * @param {array} readyParams Array of parameters to pass at the time <code>readyFn</code> is called.
   * @param {function} errorFn Function called when object being tested can not be found. 
   *                           Method times out at a count of 100 at 100ms intervals.
   * @param {Array} errorParams Array of parameters to pass at the time <code>errorFn</code> is called.
   * @example
   * function onReady(msg, num) {
   *   Util.log(msg + ':' + num);
   * }
   * 
   * function onError(msg) {
   *   Util.log(msg);
   * }
   * 
   * Util.ready(function(){return testObj;}, this, onReady, ['Hello World!', 100], onError, ['Error...']);
   */
  _this.ready = function(testFn, context, readyFn, readyParams, errorFn, errorParams) {
    function waitTimer(fn, cTxt, rdyFn, rdyPar, errFn, errPar) {
      var _timeout = 0;
      function check() {
        _timeout++;
        if (_timeout == 100) {
          clearInterval(_interval);
          errFn.apply(cTxt, errorParams);
          return;
        }
        if (fn()) {
          clearInterval(_interval);
          rdyFn.apply(cTxt, rdyPar);
          return;
        }
      }
      var _interval = setInterval(check, 100);
    }  
    waitTimer(testFn, context, readyFn, readyParams, errorFn, errorParams);
  }
  
  
  /** @private List containing IDs of scripts being currently loaded. **/
  var _loadList = [];

  /**
   * @name Util#loadScript
   * @function
   * @description Loads an external script & executes a callback function when an object, located in the 
   *              external script & is returned in a <code>testFn</code>, is valid. 
   * @param {string} objId Id used to identify script. Note: Implemented to avoid use of eval();
   * @param {function} objReturnFn  Function that returns object to check against. Note: Implemented to avoid use of eval();
   * @param {url} scriptSrc The url of the script to load.
   * @param {string} callback The handler to be executed when script load is complete.
   * @example
   * Util.loadScript('ExtScriptObj', function(){return ExtScriptObj;}, 'http://the.script.url/extobj.js', 
   *   function(){
   *      Util.log('External script is done loading.');
   *   }
   * );
   */  
  _this.loadScript = function (objId, objReturnFn, scriptSrc, callback) {
    var jsIntv;
    var obj;

    /** If script is not currently being loaded, attempt to load. **/
    var init = function() {
      if (checkList(objId)) {
        function wait() {
          if(!checkList(objId)) {
            clearInterval(waitIntv);
            setScript();
          }
        }
        var waitIntv = setInterval(wait, 100);
      } else {
        _loadList.push(objId);
        setScript();
      }
    }

    /** Attempts to create script element if object does not exist. **/
    var setScript = function() {
      if(!checkObj()) {
        var js = document.createElement('script');
        js.setAttribute('type', 'text/javascript');
        js.setAttribute('src', scriptSrc);
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(js, s); 
        jsIntv = setInterval(setObj, 100);
      } else {
        setObj();
      } 
    }

    /** Remove from check list executes callback. **/
    var setObj = function() {
      if(checkObj()) {
        clearInterval(jsIntv);
        removeFromList(objId);      
        callback();
      }
    };

    /** Checks if function returns valid object. **/
    var checkObj = function() { 
      try { 
          if(objReturnFn()) {
          return true;
        }
       } catch (e) {
        return false;
       }
    };

    /**
     * Checks loadList for curreent IDs.
     * @param {string} id String ID to check.
     * @return Boolean
     */
     var checkList = function(id) {
       for(var i=0; i < _loadList.length; i++) {
         if (id == _loadList[i]) {
           return true;
         }
       }
       return false;
     };
     
     /**
     * Removes an ID from loadList.
     * @param {string} id The string ID to remove.
     */
     var removeFromList = function(id) {
       for(var i=0; i < _loadList.length; i++) {
         if (id == _loadList[i]) {
           _loadList = _loadList.slice(i, 1);
           return;
         }
       }
     };    
    
    init();
  }

  /**
   * @name Util#jsonParse
   * @function
   * @description  Method first checks if JSON is natively available in the browser. If not,
   *               it will attempt to load an external JSON framework script.
   *               Finally it will initialize a callback when a successful parse is complete.
   * @param {string} txt A valid JSON string to parse.
   * @param {function} reviver Function called for every key value from parsed result. 
   * @param {function} rdyFn Callback function called and passed the parsed JSON object. 
   * @see Util#jsonUrl
   * @example
   * var str = '{"hello":"world"}';
   * Util.jsonParse(str, null, 
   *   function(json) {
   *     Util.log(json.hello);
   *   }
   * );
   */  
  _this.jsonParse = function(txt, reviver, rdyFn) {
    if(typeof JSON !== 'undefined') {
      rdyFn(JSON.parse(txt, reviver));  
    } else {
      _this.loadScript('JSON', function(){return JSON;}, _this.jsonUrl, 
        function() {
          rdyFn(JSON.parse(txt, reviver));
        }
      );
    }
  }

  /**
   * @name Util#jsonStringify
   * @function
   * @description  Method first checks if JSON is natively available in the browser. If not,
   *               it will attempt to load an external JSON framework script.
   *               Finally it will initialize a callback when a successful stringify is complete.
   * @param {object} obj An object to convert to a JSON string.
   * @param {function} replacer Function called for every object values. 
   * @param {function} rdyFn Callback function called and passed the JSON string. 
   * @see Util#jsonUrl
   * @example
   * var obj = new Object();
   * ob.hello = "world";
   * Util.jsonStringify(obj, null, 
   *   function(str) {
   *     Util.log(str);
   *   }
   * );
   */  
  _this.jsonStringify = function(obj, replacer, rdyFn) {
    if(typeof JSON !== 'undefined') {
      rdyFn(JSON.stringify(obj, replacer));  
    } else {
      _this.loadScript('JSON', function(){return JSON;}, _this.jsonUrl, 
        function() {
          rdyFn(JSON.stringify(obj, replacer));
        }
      );
    }
  }

  return _this;
})();


