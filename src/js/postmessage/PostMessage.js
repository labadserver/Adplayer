var PostMessage = (function () {
    var _this = {};
    var _postMsg;
    
  _this.OUTGOING = 'PostMessage.Outgoing';
  _this.INCOMING = 'PostMessage.Incoming';
  _this.FUNCTION = 'PostMessage.Function: ';
  
  function init() {
    if (typeof(window.postMessage) == typeof(Function)) {
      _postMsg = new PostMsgDefault();
    } else {
      _postMsg = new AbstractPostMsg();
    }
  }

  _this.send = function(obj, target) {
    obj.pmsgid = new Date().getTime(); 
    Util.jsonStringify(obj, null, function(msg){
      _postMsg.send(msg, target);
    });
  };
  
  init();
  return _this;
})();