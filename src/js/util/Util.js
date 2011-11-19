var Util = (function () {
  var _this = {};
  
  _this.jsonUrl = 'js/json2.min.js';
  _this.isIE  = (navigator.appVersion.indexOf("MSIE") != -1) ? true : false;
  _this.isWin = (navigator.appVersion.toLowerCase().indexOf("win") != -1) ? true : false;
  _this.isOpera = (navigator.userAgent.indexOf("Opera") != -1) ? true : false;      
  _this.isFF = (navigator.userAgent.indexOf("Firefox") != -1) ? true : false;    
  
  /** 
  * @description Logs a message through the console; if available.
  * @param {string} msg The message to log.
  * @param {string} ref Optional - An identifer used to reference the source of a message.
  * 
  * @example
  * // "AdPlayer(God): This is a log output."
  * Util.log('This is a log output', 'God');
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

  _this.setClassName = function (domObj, className) {
    domObj.setAttribute('class', className);
    if (_this.isIE) { domObj.setAttribute('className', className); } // IE Fix        
  }
  
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
  
  /** 
  * List containing IDs of scripts being loaded.
  **/
  var _loadList = [];

  /**
  * Checks if obj is loaded or in process of being loaded, executes callback.
  *
  * @param objId        Id used to identify script.
              Note: Implemented to avoid use of eval();
  * @param objReturnFn  Function that returns object to check against.  
              Note: Implemented to avoid use of eval();
  * @param scriptSrc    The url of the script to load.
  * @param objId        The handler to be executed when script load is complete.
  */
  _this.loadScript = function (objId, objReturnFn, scriptSrc, callback) {
    var jsIntv;
    var obj;

    /* If script is not currently being loaded, attempt to load. */
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

    /* Attempts to create script element if object does not exist. */
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

    /* Remove from check list execute callback. */
    var setObj = function() {
      if(checkObj()) {
        clearInterval(jsIntv);
        removeFromList(objId);      
        callback();
      }
    };

    /* Checks if function returns valid object. */
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
     * 
     * @param id   The string ID to check.
     *
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
     * 
     * @param id   The string ID to remove.
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


