/**
 * @private
 * @name PostMsgDefault
 * @class 
 * @description Handles communication for postMessage supported browsers.
 * @author christopher.sancho@adtech.com
 */
var PostMsgDefault = (function(){
  /** @private */ var _this = new AbstractPostMsg();
  
  /**
   * @private
   * @function 
   * @description Attaches a message listener on initialization.
   */  
  function init() {
    if (window.addEventListener) {  // all browsers except IE before version 9
      window.addEventListener ("message", _this.receive, false);
    }
    else {
      if (window.attachEvent) {   // IE before version 9
        window.attachEvent("onmessage", _this.receive);
      }
    }
  }

  /*
   * Override concrete implementation 
   */
  
  _this.send = function(msg, target) {
    target.postMessage(msg, "*");
  };

  _this.receive = function(evt) {
    Util.jsonParse(evt.data, null, function(json){      
      if(json.postType == PostMessage.OUTGOING) {
        for (var i=0; i < document.getElementsByTagName('iframe').length; i++){
          if(document.getElementsByTagName('iframe')[i].contentWindow == evt.source) {
            var iframe = document.getElementsByTagName('iframe')[i];
            PostMessageHandler.domRefPlayerWait(iframe, json);          
            break;
          }      
        }
      } else if (json.postType == PostMessage.INCOMING){
        PostMessageHandler.inMsgHandler(json)
      }      
    });
  };
  

  init();
  return _this;
});