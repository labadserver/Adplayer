/**
 * @private
 * @name PostMessageHandler
 * @class 
 * @description Handles both incoming and outgoing messages from <code>PostMessage</code>.
 * @author christopher.sancho@adtech.com
 */
var PostMessageHandler = (function () {
  /** @private */ var _this = {};

  /**
   * @name PostMessageHandler#domRefPlayerWait
   * @function
   * @description Waits for DOM element to become available and then determines if iframe
   *              verification is needed or message can be processed.
   * @param {dom} dom DOM object this needs to be checked.
   * @param {object} json JSON object to check or pass through.
   */
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
    function iframeVerifyErr() {
      Util.log('Could not verify a parent iframe AdPlayer.');
    }
    Util.ready(function(){return _this.dom;}, this, iframeVerify, [_this.dom, _this.json], iframeVerifyErr, null);
  }

  /**
   * @name PostMessageHandler#getPlayerByDomSearch
   * @function
   * @description Attempts to locate a parent AdPlayer from a DOM reference point.
   * @param {dom} dom DOM object that needs to be checked.
   */
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

  /**
   * @name PostMessageHandler#readyTest
   * @function
   * @description Parses JSON object and executes requests.
   * @param {dom} iframe Target iframe to communicate with.
   * @param {object} json JSON object.
   * @param {adplayer} player Current AdPlayer.
   */
  function readyTest(iframe, json, player) {
    if (player) {
      var params = json.params.split(',');
      for (var t=0; t < params.length; t++) {
        // Checks if it contains a function, which is needs to be properly wrapped and send off
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
  
  /**
   * @name PostMessageHandler#inMsgHandler
   * @function
   * @description Handles specific incoming messages.
   * @param {object} json JSON object evaluate.
   */
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
      // Need to target the current player and send back
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