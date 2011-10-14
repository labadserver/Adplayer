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

  _this.send = function(arr, target) {
    //arr.push('postType:'+PostMessage.OUTGOING);
    arr.push('pmsgid:' + new Date().getTime());
    var _msg = PostMessage.serialize(arr);
    _postMsg.send(_msg, target);
  };

  _this.serialize = function(arr) {
    // Escape all or each value?
    var s = '{';
    for (var i = 0; i < arr.length; i++) {
      var tmp = '"';
      tmp += arr[i].replace(/\s+/g, "");
      tmp = tmp.replace(':', '":"');
    if (i == (arr.length-1)) { tmp += '"'; }
      else { tmp += '", ';}
      s += tmp;
    }
    s += '}';
    return escape(s);
  }

  _this.deserialize = function(str) {
    _str = unescape(str);
    try { _str = (new Function( "return( " + _str + " );" ))() } 
    catch (e) { log('Could not deserialize.'); }
    return _str;
  }

  _this.stringify = function(json) {
    var arr = [];
    for (i in json) {
      var str = i + ":" + json[i]; 
      arr.push(str);
    }
    return _this.serialize(arr);
  }
  
  init();
  return _this;
})();