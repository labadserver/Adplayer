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
   if(!uid) { log('Unique ID is required.', 'AdPlayer'); return; }
   //if(!document.getElementById(domId)) { log('Dom element does not exist in document.', 'AdPlayer'); return; }
   
   // uid, domId, null, refAdPlayer
   // uid, domId, null, null
   // uid, null, null, refAdPlayer
   // uid, null, null, null
    
   function init() {

       /*
      var _isInIFrame = (window.location != window.parent.location) ? true : false;
      if (_isInIFrame) {
        // TODO: If in iFrame - change to FramePlayer 
        fnInit(new DefaultPlayer(uid, adDomElement));
        return;
      }
    */
     
     
     if (domRefId && !refAdPlayer) {
       if(checkAdMgrDomList(domRefId)) {
         domRefObjWait(AdPlayerManager.isSearching(), domRefPlayerWait, returnDefault, [domRefId, fnInit, returnDefault]);
       } else {
         addToAdMgrList(domRefId);
         if (AdPlayerManager.isSearching()) {
           domRefObjWait(AdPlayerManager.isSearching(), domRefObjWait, returnDefault, [document.getElementById(domRefId), parentDomSearch, returnDefault, [uid, domRefId, fnInit]]);
         } else {
           domRefObjWait(document.getElementById(domRefId), parentDomSearch, returnDefault, [uid, domRefId, fnInit]);
         }
       }
     }
     else if (domRefId && refAdPlayer) {
       if(checkAdMgrDomList(domRefId)) {
         refPlayerWait(refAdPlayer, fnInit, returnDefault);
       } else {
         addToAdMgrList(domRefId);
         domRefObjWait(document.getElementById(domRefId), refPlayerWait, returnDefault, [refAdPlayer, fnInit, returnDefault]);
       }

     }     
     else if(!domRefId && refAdPlayer) {
       domRefId = setDocWriteRef();
       addToAdMgrList(domRefId);
       domRefObjWait(AdPlayerManager.isSearching(), domRefObjWait, returnDefault, [document.getElementById(domRefId), refPlayerWait, returnDefault, [refAdPlayer, fnInit, returnDefault]]);
     }
     else if(!domRefId && !refAdPlayer) {
       domRefId = setDocWriteRef();
       if(checkAdMgrDomList(domRefId)) {
         domRefObjWait(AdPlayerManager.isSearching(), domRefPlayerWait, returnDefault, [domRefId, fnInit, returnDefault]);
       } else {
         addToAdMgrList(domRefId);
         if (AdPlayerManager.isSearching()) {
           domRefObjWait(AdPlayerManager.isSearching(), domRefObjWait, returnDefault, [document.getElementById(domRefId), parentDomSearch, returnDefault, [uid, domRefId, fnInit]]);
         } else {
           domRefObjWait(document.getElementById(domRefId), parentDomSearch, returnDefault, [uid, domRefId, fnInit]);
         }
       }       
     }
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
         removeFromAdMgrList(domRef);
       } else {
         log('No AdPlayer found after parent search. Creating new player for ' + uid);
         fnInit(new DefaultPlayer(uid, document.getElementById(domRef)));
         removeFromAdMgrList(domRef);
       }
     }     
   }
   
   function returnDefault(uid, domRef, fnInit) {
     fnInit(new DefaultPlayer(uid, document.getElementById(domRef)));
   }
   
   function domRefObjWait(waitObj, readyFn, errorFn, params) {
     //AdPlayerManager.isSearching = true;
     AdPlayerManager.searchCount++;
     var _interval = setInterval(check, 100);
     var _this = this;
     var _timeout = 0;
     function check() {
       //console.log(waitObj);
       _timeout ++;
       if (_timeout == 20) {
         clearInterval(_interval);
         //AdPlayerManager.isSearching = false;
         AdPlayerManager.searchCount--;
         errorFn.apply(_this, params);
       }
       if (waitObj) {
         clearInterval(_interval);
         //AdPlayerManager.isSearching = false;
         AdPlayerManager.searchCount--;
         readyFn.apply(_this, params);
       }
     }
   }
   
   function domRefPlayerWait(domRef, readyFn, errorFn) {
     //AdPlayerManager.isSearching = true;
     AdPlayerManager.searchCount++;
     console.log('DOM REF PLAYER WIAT!');
     var _interval = setInterval(check, 100);
     var _this = this;
     var _timeout = 0;
     function check() {
       _timeout ++;
       if (_timeout == 100) {
         clearInterval(_interval);
         console.log('Could not find a player: ' + domRef);
         //AdPlayerManager.isSearching = false;
         AdPlayerManager.searchCount--;
         errorFn.apply(_this, [uid, domRef, fnInit]);
       }
       if (AdPlayerManager.getAdPlayerById(domRef)) {
         clearInterval(_interval);
         console.log('Found adplayer:' + domRef);
         //AdPlayerManager.isSearching = false;
         AdPlayerManager.searchCount--;
         readyFn.apply(_this, [AdPlayerManager.getAdPlayerById(domRef)]);
       }
     }
   }
   
   function refPlayerWait(refPlayer, readyFn, errorFn) {
     //AdPlayerManager.isSearching = true;
     AdPlayerManager.searchCount++;
     var _interval = setInterval(check, 100);
     var _this = this;
     var _timeout = 0;
     function check() {
       _timeout ++;
       if (_timeout == 100) {
         clearInterval(_interval);
//         console.log('Could not find a player: ' + refPlayer);
         //AdPlayerManager.isSearching = false;
         AdPlayerManager.searchCount--;
         errorFn.apply(_this, [uid, domRef, fnInit]);
       }
       if (refPlayer) {
         clearInterval(_interval);
//         console.log('Found adplayer ('+refPlayer.uid()+') from ref player wait:' + uid);
         //AdPlayerManager.isSearching = false;
         AdPlayerManager.searchCount--;
         if (document.getElementById(domRefId)) {
           readyFn.apply(_this, [new ReferencePlayer(uid, document.getElementById(domRefId), refPlayer)]);
         } else {
           readyFn.apply(_this, [new ReferencePlayer(uid, refPlayer.adDomElement(), refPlayer)]);
         }
       }
     }
   }     
   
   function setDocWriteRef() {
     var uAdId = new Date().getTime();
     log('WARNING: No valid referral element specified for "'+uid+'". Referral will be created using "document.write"', 'parentDomSearch');
     domId = 'ref'+ uAdId;
     document.write('<span id="'+domId+'"></span>');
     return domId;
   }

   init();
});