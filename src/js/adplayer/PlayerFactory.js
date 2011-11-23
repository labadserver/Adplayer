/**
 * @private
 * @name PlayerFactory
 * @class Returns an instance of an <code>AdPlayer</code>.
 * @description Returns an instance of an <code>AdPlayer</code>.</br>
 * @param {string} uid Unique ID used to identify an <code>AdPlayer</code>.
 * @param {string} domRefId DOM ID used to mark the start point of a DOM search.
 * @param {function} fnInit Callback executed when an <code>AdPlayer</code> is created.
 * @param {adplayer} refAdPlayer Optional - When defined, sets <code>refAdPlayer</code> 
 *                   as the primary <code>AdPlayer</code>. 
 * @return {adplayer} AdPlayer instance created through the factory search logic.
 * @author christopher.sancho@adtech.com
 */
var PlayerFactory = (function(uid, domRefId, fnInit, refAdPlayer){
   /** @private */ var _this = {};
   if(!uid) { Util.log('Unique ID is required.', 'AdPlayer'); return; }

   /** @private */ var _isInIFrame = (window.location != window.parent.location) ? true : false;

   /**
    * @private
    * @function
    * @description
    * Attempts to search for an <code>AdPlayer</code> using the following conditional order:
    * 1) uid, domId, null, refAdPlayer
    * 2) uid, domId, null, null
    * 3) uid, null, null, refAdPlayer
    * 4) uid, null, null, null 
    */
   function init() {
     if (domRefId && !refAdPlayer) {
       if(checkAdMgrDomList(domRefId)) {
         Util.ready(function(){return AdPlayerManager.getAdPlayerById(domRefId);}, _this, domRefAdPlayerInit, [domRefId, fnInit], returnDefault, [uid, domRefId, fnInit]);
       } else {
         addToAdMgrList(domRefId);
         Util.ready(function(){return document.getElementById(domRefId);}, _this, parentDomSearch, [uid, domRefId, fnInit], returnDefault, [uid, domRefId, fnInit]);
       }
     }
     else if (domRefId && refAdPlayer) {
       if(checkAdMgrDomList(domRefId)) {
         Util.ready(function(){return refAdPlayer;}, _this, refAdPlayerInit, [refAdPlayer, uid, domRefId, fnInit], returnDefault, [uid, domRefId, fnInit]);         
       } else {
         addToAdMgrList(domRefId);
         Util.ready(function(){return document.getElementById(domRefId);}, _this, refAdPlayerInit, [refAdPlayer, uid, domRefId, fnInit], returnDefault, [uid, domRefId, fnInit]);
       }

     }     
     else if(!domRefId && refAdPlayer) {
       domRefId = setDocWriteRef();
       addToAdMgrList(domRefId);
       Util.ready(function(){return document.getElementById(domRefId);}, _this, refAdPlayerInit, [refAdPlayer, uid, domRefId, fnInit], returnDefault, [uid, domRefId, fnInit]);
     }
     else if(!domRefId && !refAdPlayer) {
       domRefId = setDocWriteRef();
       if(checkAdMgrDomList(domRefId)) {
         Util.ready(function(){return AdPlayerManager.getAdPlayerById(domRefId);}, _this, domRefAdPlayerInit, [domRefId, fnInit], returnDefault, [uid, domRefId, fnInit]);
       } else {
         addToAdMgrList(domRefId);
         Util.ready(function(){return document.getElementById(domRefId);}, _this, parentDomSearch, [uid, domRefId, fnInit], returnDefault, [uid, domRefId, fnInit]);
       }       
     }
   }
   
   /**
    * @name PlayerFactory#refAdPlayerInit
    * @function
    * @description Executes a callback function with a reference <code>AdPlayer</code>.
    * @param {adplayer} refPlayer Primary <code>AdPlayer</code>. to use.
    * @param {string} uid Unique ID used to identify an <code>AdPlayer</code>.
    * @param {string} domRef domRef DOM ID used to mark the start point of a DOM search.
    * @param {function} fnInit Callback executed when a reference <code>AdPlayer</code> is created.
    */
   function refAdPlayerInit(refPlayer, uid, domRef, fnInit) {   
     if (document.getElementById(domRef)) {
       fnInit(new ReferencePlayer(uid, document.getElementById(domRef), refPlayer));
     } else {
       fnInit(new ReferencePlayer(uid, refPlayer.adDomElement(), refPlayer));
     }     
   }

   /**
    * @name PlayerFactory#domRefAdPlayerInit
    * @function
    * @description Executes a callback function when an <code>AdPlayer</code> is found by <code>AdPlayerManager.getAdPlayerById</code>.
    * @param {string} domRef domRef DOM ID used to mark the start point of a DOM search.
    * @param {function} fnInit Callback executed when an <code>AdPlayer</code> is located by <code>AdPlayerManager.getAdPlayerById</code>.
    * @see AdPlayerManager#getAdPlayerById 
    */
   function domRefAdPlayerInit(domRef, fnInit) {   
     fnInit(AdPlayerManager.getAdPlayerById(domRef));   
   }   

   /**
    * @name PlayerFactory#checkAdMgrDomList
    * @function
    * @description Checks if a DOM ID is located in <code>AdPlayerManager.domIdList</code>.
    * @param {string} domRef DOM ID used to mark the start point of a DOM search.
    * @see AdPlayerManager#domIdList
    */
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

   /**
    * @name PlayerFactory#addToAdMgrList
    * @function
    * @description Adds a DOM ID to <code>AdPlayerManager.domIdList</code>.
    * @param {string} domRef DOM ID used to mark the start point of a DOM search.
    * @see AdPlayerManager#domIdList
    */
   function addToAdMgrList(domRef) {
     for (var i=0; i < AdPlayerManager.domIdList().length; i++) {
       if(AdPlayerManager.domIdList()[i] == domRef) {
         return;
       }
     }
     AdPlayerManager.domIdList().push(domRef);
   }   

   /**
    * @name PlayerFactory#removeFromAdMgrList
    * @function
    * @description Removes a DOM ID from <code>AdPlayerManager.domIdList</code>.
    * @param {string} domRef DOM ID used to mark the start point of a DOM search.
    * @see AdPlayerManager#domIdList
    */
   function removeFromAdMgrList(domRef) {
     for (var i=0; i < AdPlayerManager.domIdList().length; i++) {
       if(AdPlayerManager.domIdList()[i] == domRef) {
         AdPlayerManager.domIdList().splice(i, 1);
         break;
       }
     }
   }

   /**
    * @name PlayerFactory#parentDomSearch
    * @function
    * @description Attempts to locate a parent AdPlayer from a DOM reference point.
    * @param {string} uid Unique ID used to identify an <code>AdPlayer</code>.
    * @param {string} domRef DOM ID used to mark the start point of a DOM search.
    * @param {function} fnInit Callback executed when a default <code>AdPlayer</code> is created.
    */
   function parentDomSearch(uid, domRef, fnInit) {
     // Attempt to find the top most player.
     var par = document.getElementById(domRef).parentNode;
     while (!AdPlayerManager.getAdPlayerById(par.id)) {
       par = par.parentNode;
       parName = par.nodeName.toLowerCase();
       if ((parName == 'body') || (parName == 'html')) { break; }
     }      
     if(par) {
       var adPlayer = AdPlayerManager.getAdPlayerById(par.id); 
       if(adPlayer) {
         // adPlayer.adDomElement().removeChild(document.getElementById(domRef));
         if(fnInit) {
           Util.log('Found player at '+adPlayer.adDomElement().id);
           fnInit(adPlayer);  
         }
         removeFromAdMgrList(domRef);
       } else {
         Util.log('No AdPlayer found after parent search. Creating new player for ' + uid);
          if (_isInIFrame) {
            
            // Check if Stub file is used
            if (String(window.location).search(/apstub.html\#\{(.*?)\}/) > -1) {
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
              setStub(uid, domRef);
              return;
            }
            
            var iframePlayer = new IframePlayer(uid, document.getElementById(domRef));
            fnInit(iframePlayer);
            
            // Check parent frame & temporarily add this factory to the player list with a UID
            var uAdId = uid + new Date().getTime();
            _this.uid = function() {
              return uAdId;
            }
            
            // Added for PostMessage target verification
            AdPlayerManager.factoryList().push(_this);    
            
            var obj = new Object();
            obj.postType = PostMessage.OUTGOING;
            obj.uid = _this.uid();
            obj.fn = 'iframePlayerVerify';
            PostMessage.send(obj, parent);
            
            _this.setIframePlayerType = function(json) {
              for (var i = 0; i < AdPlayerManager.list().length; i++) {
                if (AdPlayerManager.list()[i].uid() == _this.uid()) {
                  AdPlayerManager.list().splice(i, 1);
                  break;
                }
              }              
              if (json.params == true) {
                iframePlayer.disableAdChoice();
              } 
            }
         } else {
           fnInit(new DefaultPlayer(uid, document.getElementById(domRef)));  
         }         
         removeFromAdMgrList(domRef);
       }
     }     
   }

   /**
    * @name PlayerFactory#returnDefault
    * @function
    * @description Executes a callback function with a default <code>AdPlayer</code>.
    * @param {string} uid Unique ID used to identify an <code>AdPlayer</code>.
    * @param {string} domRef DOM ID used to mark the start point of a DOM search.
    * @param {function} fnInit Callback executed when a default <code>AdPlayer</code> is created.
    */
   function returnDefault(uid, domRef, fnInit) {
     fnInit(new DefaultPlayer(uid, document.getElementById(domRef)));
   }

   /**
    * @name PlayerFactory#setDocWriteRef
    * @function
    * @description Sets a <code>span</code> element using <code>document.write</code>.
    * @return {string} domId ID of the generated <code>span</code> element.
    */
   function setDocWriteRef() {
     var uAdId = new Date().getTime();
     Util.log('WARNING: No valid referral element specified for "'+uid+'". Referral will be created using "document.write"', 'parentDomSearch');
     domId = 'ref'+ uAdId;
     document.write('<span id="'+domId+'"></span>');
     return domId;
   }
   
   init();
   return _this;
});