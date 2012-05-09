/**
 * @name $ADP.Util
 * @class
 * @description The Required Util methods that could be used across the various classes 
 */
$ADP.Util = {
  JSON: window.JSON || {stringify:function s(a,b,c){for(b in(c=a==''+{}&&[])&&a)c.push(s(b)+':'+s(a[b]));return''+a===a?'"'+a.replace(/[\x00-\x19\\]/g,function(x){return'\\x'+x.charCodeAt().toString(16)})+'"':a&&a.map?'['+a.map(s)+']':c?'{'+c+'}':a}},
  btoa: function(a,b,c,d,e) {for(b="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",d=e='';a.charAt(d|0)||(b='=',d%1);e+=b.charAt(63&c>>8-d%1*8))c=c<<8|a.charCodeAt(d-=-.75);return e},
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
    log.history = log.history || [];
    log.history.push(arguments);
    if(typeof console != 'undefined'){
      console.log(Array.prototype.slice.call(arguments));
    }
  }
}