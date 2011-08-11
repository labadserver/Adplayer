var PostMessageManager = (function () {
  var _this = {};

  /* TODO: Clean dom search and share with PlayerFactory searching */
  
  _this.getPlayerByDomSearch = function (dom) {
    
    AdPlayerManager.searchCount++;
    var par = dom.parentNode;
    while (!AdPlayerManager.getAdPlayerById(par.id)) {
      par = par.parentNode;
      parName = par.nodeName.toLowerCase();
      if ((parName == 'body') || (parName == 'html')) { break; }
    }
    if(par) {
      var adPlayer = AdPlayerManager.getAdPlayerById(par.id);
      if(adPlayer) {
        //if(fnInit) {
//          log('Found player at '+adPlayer.adDomElement().id);
          AdPlayerManager.searchCount--;
          return(adPlayer);
        //}
        //removeFromAdMgrList(domRef);
      } else {
//        log('No AdPlayer found after parent search for "' + dom.id + '."');
        AdPlayerManager.searchCount--;
        return null;
      }
    }     
  }    
    
    _this.domRefPlayerWait = function (dom, msg, iframe, readyFn, errorFn) {
      AdPlayerManager.searchCount++;
      var _interval = setInterval(check, 100);
      var _this = this;
      var _timeout = 0;
      function check() {
        _timeout ++;
        if (_timeout == 100) {
          clearInterval(_interval);
//          console.log('Could not find a player: ' + domRef);
          AdPlayerManager.searchCount--;
          //errorFn.apply(_this, [uid, domRef, fnInit]);
        }
        if (dom) {
          clearInterval(_interval);
//        console.log('Found adplayer:' + dom.id);
          
          var json = (new Function( "return( " + msg + " );" ))();          
          var player = _this.getPlayerByDomSearch(dom);
          if (player) {
            if (json.fn == "iframePlayerVerify") {
              var jsonVal = '{ "postType":"'+PostMessage.INCOMING+'", "uid":"'+json.uid+'", "fn":"iframePlayerVerify", "params":"true" }';
              iframe.contentWindow.postMessage (jsonVal, "*");            
              return;
            }
            readyTest(player,msg,iframe);
          } else {
            var jsonVal = '{ "postType":"'+PostMessage.INCOMING+'", "uid":"'+json.uid+'", "fn":"iframePlayerVerify", "params":"false" }';
            dom.contentWindow.postMessage (jsonVal, "*");
          }
          AdPlayerManager.searchCount--;
          
          
          
          
        }
      }
    }
    
    _this.errorFn = function (){
//      console.log('Error');
    }
  
    function readyTest(player, msg, iframe) {
      if (player) {
        var jsonValue = (new Function( "return( " + msg + " );" ))();
        var params = jsonValue.params.split(',');
        for (var t=0; t < params.length; t++) {
          // CHECKS if any contains a function to properly wrap and send off
          switch (jsonValue.fn){
            case 'addEventListener':
              if (unescape(params[t]).match(PostMessage.FUNCTION)) {
                var funcN = unescape(params[t]).slice(PostMessage.FUNCTION.length);
                function funcMe (evt) {
                  var jsonVal = '{ "postType":"'+PostMessage.INCOMING+'", "uid":"'+jsonValue.uid+'", "fn":"'+funcN+'", "evtType":"'+evt.type()+'", "uidName:":"'+jsonValue.uidName+'"}';
                  iframe.contentWindow.postMessage (jsonVal, "*");
                }
                funcMe.uidName = jsonValue.uidName;
                params[t] = funcMe;
              }
              break;
          }
        }
        
        switch (jsonValue.fn){
          case 'removeEventListener':
              params.push(jsonValue.uidName.toString());
            break;
          case 'track':
            adEvtObj = new AdEvent(params[0]);
            adEvtObj.target(player);
            adEvtObj.currentTarget(player);
            player.track(new AdEvent(params[0]), params[1]);
            return;
            break;
        }

        player[jsonValue.fn].apply(player, params);
      }
    }      
    
    
  function messageHandler(evt) {
    //console.log(evt.source.location);
    //console.log(evt.source);
    //console.log(event.origin);
    var json = (new Function( "return( " + evt.data + " );" ))();
    if(json.postType == PostMessage.OUTGOING) {
      outMsgHandler(evt);
    } else if (json.postType == PostMessage.INCOMING){
      inMsgHandler(evt)
    }
  } 
  
  function outMsgHandler(evt) {
    for (var i=0; i < document.getElementsByTagName('iframe').length; i++){
      if(document.getElementsByTagName('iframe')[i].contentWindow == evt.source) {
        var iframe = document.getElementsByTagName('iframe')[i];
        _this.domRefPlayerWait(iframe, evt.data, iframe, readyTest, _this.erroFn);          
        break;
      }      
    }      
  }
  
  function inMsgHandler(evt) {
    var json = (new Function( "return( " + evt.data + " );" ))();
    
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
    
  function init() {
    if (window.addEventListener) {  // all browsers except IE before version 9
        window.addEventListener ("message", messageHandler, false);
    }
    else {
        if (window.attachEvent) {   // IE before version 9
            window.attachEvent("onmessage", messageHandler);
        }
    }    
  }
  
  init();
  return _this;
});