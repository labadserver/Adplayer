// TODO -- CLEAN WAIT QUEUE COUNTS

/** @private */
    /**
     * @private
     * @description Returns an instance of an <code>AdPlayer</code>. A referral name,
     *              specified by a DOM element, is used as a start point of
     *              a reverse DOM search of a <code>DIV</code> element previously
     *              associated with an <code>AdPlayer</code>.
     *              
     * @param refName {String} Referral id used to mark the start point of a DOM search. 
     * @return {Adplayer} AdPlayer instance associated with id. 
     * 
     * @example
     * &lt;div id=&quot;adPlayerContainer&quot;&gt;
     *  &lt;script type=&quot;text/javascript&quot;&gt;
     *    var adPlayer = new AdPlayer(document.getElementById('adPlayerContainer'));
     *    adPlayer.addPrivacyInfo('1ST_SERVER', 'My info message.', 'http://adplayer.aboutthisad.com');
     *  &lt;/script&gt;
     *  &lt;script type=&quot;text/javascript&quot; id=&quot;adServerTag&quot;&gt;
     *    // Sample third party response
     *    AdPlayerManager.getAdPlayer("uid", function (adPlayer) {
     *      adPlayer.track(new AdEvent(AdEvent.SHOW));
     *      adPlayer.addPrivacyInfo('3RD_SERVER', 'My info message.', 'http://adplayer.aboutthisad.com');
     *    }); 
     *  &lt;/script&gt;
     * &lt;/div&gt;
     * &lt;script type=&quot;text/javascript&quot;&gt;
     *  // Outputs 1ST_SERVER & 3RD_SERVER info
     *  console.log(adPlayer.privacyInfoList());
     * &lt;/script&gt;
     */
var PlayerFactory = (function(uid, domRefId, fnInit, refAdPlayer){
   var _this = {};
   if(!uid) { log('Unique ID is required.', 'AdPlayer'); return; }
 
   //if(!document.getElementById(domId)) { log('Dom element does not exist in document.', 'AdPlayer'); return; }
   
   /* TODO: Clean wait and search into single method and share with PostMessageManager */
   
   //domRefId = domRefId;
   
   // uid, domId, null, refAdPlayer
   // uid, domId, null, null
   // uid, null, null, refAdPlayer
   // uid, null, null, null
   var _isInIFrame = (window.location != window.parent.location) ? true : false;
   
   function init() {
     if (domRefId && !refAdPlayer) {
       if(checkAdMgrDomList(domRefId)) {
         onReady('AdPlayerManager.getAdPlayerById(domRefId)', _this, domRefAdPlayerInit, [domRefId, fnInit], returnDefault, [uid, domRefId, fnInit], true);
       } else {
         addToAdMgrList(domRefId);
         if (AdPlayerManager.isSearching()) {
           onReady('document.getElementById(domRefId)', _this, parentDomSearch, [uid, domRefId, fnInit], returnDefault, [uid, domRefId, fnInit], true);
         } else {
           onReady('document.getElementById(domRefId)', _this, parentDomSearch, [uid, domRefId, fnInit], returnDefault, [uid, domRefId, fnInit], false);
         }
       }
     }
     else if (domRefId && refAdPlayer) {
       if(checkAdMgrDomList(domRefId)) {
         onReady('refAdPlayer', _this, refAdPlayerInit, [refAdPlayer, uid, domRefId, fnInit], returnDefault, [uid, domRefId, fnInit], false);         
       } else {
         addToAdMgrList(domRefId);
         onReady('document.getElementById(domRefId)', _this, refAdPlayerInit, [refAdPlayer, uid, domRefId, fnInit], returnDefault, [uid, domRefId, fnInit], false);
       }

     }     
     else if(!domRefId && refAdPlayer) {
       domRefId = setDocWriteRef();
       addToAdMgrList(domRefId);
       onReady('document.getElementById(domRefId)', _this, refAdPlayerInit, [refAdPlayer, uid, domRefId, fnInit], returnDefault, [uid, domRefId, fnInit], true);
     }
     else if(!domRefId && !refAdPlayer) {
       domRefId = setDocWriteRef();
       if(checkAdMgrDomList(domRefId)) {
         onReady('AdPlayerManager.getAdPlayerById(domRefId)', _this, domRefAdPlayerInit, [domRefId, fnInit], returnDefault, [uid, domRefId, fnInit], true);
       } else {
         addToAdMgrList(domRefId);
         if (AdPlayerManager.isSearching()) {
           onReady('document.getElementById(domRefId)', _this, parentDomSearch, [uid, domRefId, fnInit], returnDefault, [uid, domRefId, fnInit], true);
         } else {
           onReady('document.getElementById(domRefId)', _this, parentDomSearch, [uid, domRefId, fnInit], returnDefault, [uid, domRefId, fnInit], false);
         }
       }       
     }
   }
   
   function refAdPlayerInit(refPlayer, uid, domRefId, fnInit) {   
     if (document.getElementById(domRefId)) {
       fnInit(new ReferencePlayer(uid, document.getElementById(domRefId), refPlayer));
     } else {
       fnInit(new ReferencePlayer(uid, refPlayer.adDomElement(), refPlayer));
     }     
   }

   function domRefAdPlayerInit(domRefId, fnInit) {   
     fnInit(AdPlayerManager.getAdPlayerById(domRefId));   
   }   
   
   function checkAdMgrDomList(domRef) {
     var isListed = false;
     for (var i=0; i < AdPlayerManager.domIdList().length; i++) {
       if(AdPlayerManager.domIdList()[i] == domRef) {
         isListed = true;
         break;
       }
     }
     return isListed;
   }

   function addToAdMgrList(id) {
     for (var i=0; i < AdPlayerManager.domIdList().length; i++) {
       if(AdPlayerManager.domIdList()[i] == id) {
         return;
       }
     }
     AdPlayerManager.domIdList().push(id);
   }   
   
   function removeFromAdMgrList(id) {
     for (var i=0; i < AdPlayerManager.domIdList().length; i++) {
       if(AdPlayerManager.domIdList()[i] == id) {
         AdPlayerManager.domIdList().splice(i, 1);
         break;
       }
     }
   }
   
   function parentDomSearch(uid, domRef, fnInit) {
     AdPlayerManager.searchCount++;
     
     var par = document.getElementById(domRef).parentNode;
     while (!AdPlayerManager.getAdPlayerById(par.id)) {
       par = par.parentNode;
       parName = par.nodeName.toLowerCase();
       if ((parName == 'body') || (parName == 'html')) { break; }
     }
     if(par) {
       var adPlayer = AdPlayerManager.getAdPlayerById(par.id);
       if(adPlayer) {
//         adPlayer.adDomElement().removeChild(document.getElementById(domRef));
         if(fnInit) {
           log('Found player at '+adPlayer.adDomElement().id);
           fnInit(adPlayer);  
         }
         AdPlayerManager.searchCount--;
         removeFromAdMgrList(domRef);
       } else {
         
         log('No AdPlayer found after parent search. Creating new player for ' + uid);
          if (_isInIFrame) {
            
            // Check if Stub file is used
            if (String(window.location).search(/apstub.html\#\{(.*?)\}/) > -1) {
              AdPlayerManager.searchCount--;
              //AdPlayerManager.isSearching = true;
              
              function setStub(uid, domRef) {
                for (var i=0; i < parent.document.getElementsByTagName('iframe').length; i++){
                  if(parent.document.getElementsByTagName('iframe')[i].contentWindow == window) {
                    var player =  parent.PostMessageHandler.getPlayerByDomSearch(parent.document.getElementsByTagName('iframe')[i]);
                    if (player) {
                      fnInit(player);
                    } else {
                      fnInit(new DefaultPlayer(uid, document.getElementById(domRef)));
                    }
                    break;
                  }
                }                 
              }
              onReady('parent.AdPlayerManager.searchCount == 0', this, setStub, [uid, domRef], returnDefault, [uid, domRefId, fnInit], true);
              return;
            }
            
            var iframePlayer = new IframePlayer(uid, document.getElementById(domRef));
            fnInit(iframePlayer);
            AdPlayerManager.searchCount--;
            
            // CHECK parent frame
            // temporarily add this factory to the player list with a UID
            var uAdId = uid + new Date().getTime();
            _this.uid = function() {
              return uAdId;
            }
            AdPlayerManager.factoryList().push(_this);            
            var jsonArr = ['postType:'+PostMessage.OUTGOING, 'uid:'+_this.uid(), 'fn:iframePlayerVerify'];
            PostMessage.send(jsonArr, parent);
            
            _this.setIframePlayerType = function(json) {
              AdPlayerManager.searchCount--;
              for (var i = 0; i < AdPlayerManager.list().length; i++) {
                if (AdPlayerManager.list()[i].uid() == _this.uid()) {
                  AdPlayerManager.list().splice(i, 1);
                  break;
                }
              }              
              
              if (json.params == 'true') {
                iframePlayer.disableAdChoice();
              } 
            }
         } else {
           AdPlayerManager.searchCount--;
           fnInit(new DefaultPlayer(uid, document.getElementById(domRef)));  
         }         
         removeFromAdMgrList(domRef);
       }
     }     
   }
   
   function returnDefault(uid, domRef, fnInit) {
     fnInit(new DefaultPlayer(uid, document.getElementById(domRef)));
   }
   
   function setDocWriteRef() {
     var uAdId = new Date().getTime();
     log('WARNING: No valid referral element specified for "'+uid+'". Referral will be created using "document.write"', 'parentDomSearch');
     domId = 'ref'+ uAdId;
     document.write('<span id="'+domId+'"></span>');
     return domId;
   }

   function onReady(evalStr, context, readyFn, readyParams, errorFn, errorParams, search) {
     if(!search) { search = false; }
     function waitTimer(eStr, cTxt, rdyFn, rdyPar, errFn, errPar) {
       AdPlayerManager.searchCount++;
       var _timeout = 0;
       function check() {
         _timeout++;
         if (_timeout == 100) {
           clearInterval(_interval);
           AdPlayerManager.searchCount--;
           errFn.apply(cTxt, errorParams);
           return;
         }
         if (eval(eStr)) {
           clearInterval(_interval);
           AdPlayerManager.searchCount--;
           rdyFn.apply(cTxt, rdyPar);
           return;
         }
       }
       var _interval = setInterval(check, 100);
     }  
     if(search === true) {
       waitTimer('AdPlayerManager.isSearching() === true', this, waitTimer, [evalStr, context, readyFn, readyParams, errorFn, errorParams], errorFn, errorParams);   
     } else {
       waitTimer(evalStr, context, readyFn, readyParams, errorFn, errorParams);
     }
   };
   
   init();
   
   return _this;
});