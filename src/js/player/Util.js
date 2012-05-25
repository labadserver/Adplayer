/**
 * @name $ADP.Util
 * @class
 * @description The Required Util methods that could be used across the various classes 
 */
$ADP.Util = {
  /**
   * @name $ADP.Util.JSON
   * @class
   * @description Fallback JSON class 
   */
  JSON: window.JSON || {
    /**
     * @name $ADP.Util.#JSON.stringify
     * @function
     * @description returns a json string for a supplied object
     * @param a Object to be stringified
     * @param b function variable
     * @param c function variable
     * @returns {string}
     */
    stringify: function (obj,replacer){
      function m(a) {
  		  var o= new Array(a.length);
			  for (var i= 0, n=a.length; i<n; i++) o[i]= s(a[i]);
			  return o;
	    }
	   
     function s(a,b,c){
		    for(b in(c=a==''+{}&&[])&&a)
			    c.push(s(b)+':'+s(a[b]));
		    return ''+a===a?'"'+a.replace(/[\x00-\x19\\]/g,function(x){return'\\x'+x.charCodeAt().toString(16)})+'"':a&&a.length?'['+m(a)+']':c?'{'+c+'}':a
	    }
      return s(obj);
    },
    /**
     * @name $ADP.Util.#JSON.stringify
     * @function
     * @description returns the JSON object for the JSON string
     * @param jsonstr The JSON string to be evaluated
     * @returns 
     */
    parse: function (jsonstr){
      var JSON_object = null;
      try {
        JSON_object = !(/[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/.test(text.replace(/"(\\.|[^"\\])*"/g, ''))) && eval('(' + text + ')');
      } catch(e) {}
      return JSON_object;
    }
  },
  
  /**
   * @name ADP.Util#btoa
   * @function
   * @description Converts from base string to base64 encoded string
   * @param a The string the be encoded
   * @param b function variable
   * @param c function variable
   * @param d function variable
   * @param e function variable
   * @returns
   */
  btoa: function(a,b,c,d,e) {
    for(b="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",d=e='';a.charAt(d|0)||(b='=',d%1);e+=b.charAt(63&c>>8-d%1*8))c=c<<8|a.charCodeAt(d-=-.75);
    return e
  },
  /**
   * @name ADP.Util#atob
   * @function
   * @description Converts base64 encoded string into a string.
   * @param d base64 encoded string
   * @param b function variable
   * @param c function variable
   * @param u function variable
   * @param r function variable
   * @param q function variable
   * @param x function variable
   * @returns
   */
  atob: function(d,b,c,u,r,q,x) {for(r=q=x='',b="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";c=d.charAt(x++);~c&&(u=q%4?u*64+c:c,q++%4)?r+=String.fromCharCode(255&u>>(-2*q&6)):0)c=b.indexOf(c);return r},
  
  /**
   * @name $ADP.Util#log
   * @function
   * @description Logs a message through the console; if available.
   * @param {string} msg The message to log.
   * @example
   *  $ADP.Util.log('This is a log output');  
   */
  log: function() {
    $ADP.Util.log.history = $ADP.Util.log.history || [];
    $ADP.Util.log.history.push(arguments);
    if(typeof console != 'undefined'){
      console.log(Array.prototype.slice.call(arguments));
    }
  },
  
  /**
   * @name $ADP.Util#safeString
   * @function
   * @description Replaces all &lt; and &gt; signs with &amp;lt; and &amp;gt; to prevent
   *              interpretation by browser.
   * @param {string} s The string to make safe.
   */
  safeString: function(s) {
    var safeString = s;
    safeString = safeString.split('<').join('&lt;');
    safeString = safeString.split('>').join('&gt;');
    return safeString;
  }
}