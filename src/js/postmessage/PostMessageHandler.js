// TODO: Add error callback for queue routine

var PostMessageHandler = (function () {
  var _this = {};

  _this.domRefPlayerWait = function (dom, json) {
    _this.dom = dom;
    _this.json = json;
    
    function iframeVerify(dom, json) {
      var obj = new Object();
      obj.postType = PostMessage.INCOMING;
      obj.uid = json.uid;
      obj.fn = 'iframePlayerVerify';      
      var player = _this.getPlayerByDomSearch(dom);
      if (player) {
        if (json.fn == "iframePlayerVerify") {
          obj.params = true;
          PostMessage.send(obj, dom.contentWindow);   
          return;
        }
        readyTest(dom, json, player);
      } else {
        obj.params = false;
        PostMessage.send(obj, dom.contentWindow);          
      }
    }
    Util.ready(function(){return _this.dom;}, this, iframeVerify, [_this.dom, _this.json], null, null);
  }

  _this.getPlayerByDomSearch = function (dom) {
    var par = dom.parentNode;
    while (!AdPlayerManager.getAdPlayerById(par.id)) {
      par = par.parentNode;
      parName = par.nodeName.toLowerCase();
      if ((parName == 'body') || (parName == 'html')) { break; }
    }
    if(par) {
      var adPlayer = AdPlayerManager.getAdPlayerById(par.id);
      if(adPlayer) {
        Util.log('Found player at '+adPlayer.adDomElement().id);
          return(adPlayer);
      } else {
        Util.log('No AdPlayer found after parent search for "' + dom.id + '."');
        return null;
      }
    }     
  }    

  function readyTest(iframe, json, player) {
    if (player) {
      var params = json.params.split(',');
      for (var t=0; t < params.length; t++) {
        // CHECKS if any contains a function to properly wrap and send off
        switch (json.fn){
          case 'addEventListener':
            if (unescape(params[t]).match(PostMessage.FUNCTION)) {
              var funcN = unescape(params[t]).slice(PostMessage.FUNCTION.length);
              function funcMe (evt) {
                var obj = new Object();
                obj.postType = PostMessage.INCOMING;
                obj.uid = json.uid;
                obj.fn = funcN;
                obj.evtType = evt.type();
                obj.uidName = json.uidName;
                PostMessage.send(obj, iframe.contentWindow);
              }
              funcMe.uidName = json.uidName;
              params[t] = funcMe;
            }
            break;
        }
      }
      
      switch (json.fn){
        case 'removeEventListener':
            params.push(json.uidName.toString());
          break;
        case 'track':
          adEvtObj = new AdEvent(params[0]);
          adEvtObj.target(player);
          adEvtObj.currentTarget(player);
          player.track(new AdEvent(params[0]), params[1]);
          return;
          break;
      }

      player[json.fn].apply(player, params);
    }
  }      
  
  _this.inMsgHandler = function (json) {
    switch (json.fn){
      case 'iframePlayerVerify':
        var factoryPlayer; 
        for (var i = 0; i < AdPlayerManager.factoryList().length; i++) {
          if (AdPlayerManager.factoryList()[i].uid() == json.uid) {
            factoryPlayer = AdPlayerManager.factoryList()[i];
            break;
          }
        }
        if (factoryPlayer) {
          factoryPlayer.setIframePlayerType(json);
        }
        return;
      break;      
      case 'defaultTrackCallBack':
      break;
    default: 
      var func = (new Function( "return( " + json.fn + " );" ))();
      var player = AdPlayerManager.getPlayerByUID(json.uid);  
      // NEED TO TARGET THE CURRENT PLAYER THEN SEND BACK
      if (player) {
        var event = new AdEvent(json.evtType);
        event.target(player);
        func(event);
      }
      break;
    }
  }  
return _this;
})();