/**
 * @private
 * @name $ADP.PlayerFactory
 * @class Returns an instance of an <code>$ADP.AdPlayer</code>.
 * @description Returns an instance of an <code>$ADP.AdPlayer</code>.</br>
 * @param {string} uid Unique ID used to identify an <code>$ADP.AdPlayer</code>.
 * @param {string} domRefId DOM ID used to mark the start point of a DOM search.
 * @param {function} fnInit Callback executed when an <code>$ADP.AdPlayer</code> is created.
 * @param {adplayer} refAdPlayer Optional - When defined, sets <code>refAdPlayer</code> 
 *                   as the primary <code>$ADP.AdPlayer</code>. 
 * @return {adplayer} AdPlayer instance created through the factory search logic.
 * @author christopher.sancho@adtech.com
 */
$ADP.PlayerFactory = (function(uid, domRefId, fnInit, refAdPlayer){
   /** @private */ var _this = {};
   if(!uid) { $ADP.Util.log('Unique ID is required.', 'AdPlayer'); return; }

   /** @private */ var _isInIFrame = (window.location != window.parent.location) ? true : false;

   /**
    * @private
    * @function
    * @description
    * Attempts to search for an <code>$ADP.AdPlayer</code> using the following conditional order:
    * 1) uid, domId, null, refAdPlayer
    * 2) uid, domId, null, null
    * 3) uid, null, null, refAdPlayer
    * 4) uid, null, null, null 
    */
   function init() {
     if (domRefId && !refAdPlayer) {
       if(checkAdMgrDomList(domRefId)) {
         $ADP.Util.ready(function(){return $ADP.AdPlayerManager.getAdPlayerById(domRefId);}, _this, domRefAdPlayerInit, [domRefId, fnInit], returnDefault, [uid, domRefId, fnInit]);
       } else {
         addToAdMgrList(domRefId);
         $ADP.Util.ready(function(){return document.getElementById(domRefId);}, _this, parentDomSearch, [uid, domRefId, fnInit], returnDefault, [uid, domRefId, fnInit]);
       }
     }
     else if (domRefId && refAdPlayer) {
       if(checkAdMgrDomList(domRefId)) {
         $ADP.Util.ready(function(){return refAdPlayer;}, _this, refAdPlayerInit, [refAdPlayer, uid, domRefId, fnInit], returnDefault, [uid, domRefId, fnInit]);         
       } else {
         addToAdMgrList(domRefId);
         $ADP.Util.ready(function(){return document.getElementById(domRefId);}, _this, refAdPlayerInit, [refAdPlayer, uid, domRefId, fnInit], returnDefault, [uid, domRefId, fnInit]);
       }

     }     
     else if(!domRefId && refAdPlayer) {
       domRefId = setDocWriteRef();
       addToAdMgrList(domRefId);
       $ADP.Util.ready(function(){return document.getElementById(domRefId);}, _this, refAdPlayerInit, [refAdPlayer, uid, domRefId, fnInit], returnDefault, [uid, domRefId, fnInit]);
     }
     else if(!domRefId && !refAdPlayer) {
       domRefId = setDocWriteRef();
       if(checkAdMgrDomList(domRefId)) {
         $ADP.Util.ready(function(){return $ADP.AdPlayerManager.getAdPlayerById(domRefId);}, _this, domRefAdPlayerInit, [domRefId, fnInit], returnDefault, [uid, domRefId, fnInit]);
       } else {
         addToAdMgrList(domRefId);
         $ADP.Util.ready(function(){return document.getElementById(domRefId);}, _this, parentDomSearch, [uid, domRefId, fnInit], returnDefault, [uid, domRefId, fnInit]);
       }       
     }
   }
   
   /**
    * @name $ADP.PlayerFactory#refAdPlayerInit
    * @function
    * @description Executes a callback function with a reference <code>$ADP.AdPlayer</code>.
    * @param {adplayer} refPlayer Primary <code>$ADP.AdPlayer</code>. to use.
    * @param {string} uid Unique ID used to identify an <code>$ADP.AdPlayer</code>.
    * @param {string} domRef domRef DOM ID used to mark the start point of a DOM search.
    * @param {function} fnInit Callback executed when a reference <code>$ADP.AdPlayer</code> is created.
    */
   function refAdPlayerInit(refPlayer, uid, domRef, fnInit) {   
     if (document.getElementById(domRef)) {
       fnInit(new $ADP.ReferencePlayer(uid, document.getElementById(domRef), refPlayer));
     } else {
       fnInit(new $ADP.ReferencePlayer(uid, refPlayer.adDomElement(), refPlayer));
     }     
   }

   /**
    * @name $ADP.PlayerFactory#domRefAdPlayerInit
    * @function
    * @description Executes a callback function when an <code>$ADP.AdPlayer</code> is found by <code>$ADP.AdPlayerManager.getAdPlayerById</code>.
    * @param {string} domRef domRef DOM ID used to mark the start point of a DOM search.
    * @param {function} fnInit Callback executed when an <code>$ADP.AdPlayer</code> is located by <code>$ADP.AdPlayerManager.getAdPlayerById</code>.
    * @see $ADP.AdPlayerManager#getAdPlayerById 
    */
   function domRefAdPlayerInit(domRef, fnInit) {   
     fnInit($ADP.AdPlayerManager.getAdPlayerById(domRef));   
   }   

   /**
    * @name $ADP.PlayerFactory#checkAdMgrDomList
    * @function
    * @description Checks if a DOM ID is located in <code>$ADP.AdPlayerManager.domIdList</code>.
    * @param {string} domRef DOM ID used to mark the start point of a DOM search.
    * @see $ADP.AdPlayerManager#domIdList
    */
   function checkAdMgrDomList(domRef) {
     var isListed = false;
     for (var i=0; i < $ADP.AdPlayerManager.domIdList().length; i++) {
       if($ADP.AdPlayerManager.domIdList()[i] == domRef) {
         isListed = true;
         break;
       }
     }
     return isListed;
   }

   /**
    * @name $ADP.PlayerFactory#addToAdMgrList
    * @function
    * @description Adds a DOM ID to <code>$ADP.AdPlayerManager.domIdList</code>.
    * @param {string} domRef DOM ID used to mark the start point of a DOM search.
    * @see $ADP.AdPlayerManager#domIdList
    */
   function addToAdMgrList(domRef) {
     for (var i=0; i < $ADP.AdPlayerManager.domIdList().length; i++) {
       if($ADP.AdPlayerManager.domIdList()[i] == domRef) {
         return;
       }
     }
     $ADP.AdPlayerManager.domIdList().push(domRef);
   }   

   /**
    * @name $ADP.PlayerFactory#removeFromAdMgrList
    * @function
    * @description Removes a DOM ID from <code>$ADP.AdPlayerManager.domIdList</code>.
    * @param {string} domRef DOM ID used to mark the start point of a DOM search.
    * @see $ADP.AdPlayerManager#domIdList
    */
   function removeFromAdMgrList(domRef) {
     for (var i=0; i < $ADP.AdPlayerManager.domIdList().length; i++) {
       if($ADP.AdPlayerManager.domIdList()[i] == domRef) {
         $ADP.AdPlayerManager.domIdList().splice(i, 1);
         break;
       }
     }
   }

   /**
    * @name $ADP.PlayerFactory#parentDomSearch
    * @function
    * @description Attempts to locate a parent AdPlayer from a DOM reference point.
    * @param {string} uid Unique ID used to identify an <code>$ADP.AdPlayer</code>.
    * @param {string} domRef DOM ID used to mark the start point of a DOM search.
    * @param {function} fnInit Callback executed when a default <code>$ADP.AdPlayer</code> is created.
    */
   function parentDomSearch(uid, domRef, fnInit) {
     // TODO (chris.sancho): separate into methods...
     
     // Attempt to find the top most player.
     var par = document.getElementById(domRef).parentNode;
     while (!$ADP.AdPlayerManager.getAdPlayerById(par.id)) {
       par = par.parentNode;
       parName = par.nodeName.toLowerCase();
       if ((parName == 'body') || (parName == 'html')) { break; }
     }      
     if(par) {
       var adPlayer = $ADP.AdPlayerManager.getAdPlayerById(par.id); 
       if(adPlayer) {
         if(fnInit) {
           $ADP.Util.log('Found player at ' + adPlayer.adDomElement().id);
           fnInit(adPlayer);  
         }
         removeFromAdMgrList(domRef);
       } else {
         $ADP.Util.log('No AdPlayer found after parent search for ' + uid);
          if (_isInIFrame) {
            
            // Check if Stub file is used
            if (String(window.location).search(/apstub.html\#\{(.*?)\}/) > -1) {
              function setStub(uid, domRef) {
                for (var i=0; i < parent.document.getElementsByTagName('iframe').length; i++){
                  if(parent.document.getElementsByTagName('iframe')[i].contentWindow == window) {
                    var player =  parent.$ADP.PostMessageHandler.getPlayerByDomSearch(
                        parent.document.getElementsByTagName('iframe')[i]);
                    if (player) {
                      fnInit(player);
                    } else {
                      fnInit(new $ADP.DefaultPlayer(uid, document.getElementById(domRef)));
                    }
                    break;
                  }
                }                 
              }
              setStub(uid, domRef);
              return;
            }
            
            var iframePlayer = new $ADP.IframePlayer(uid, document.getElementById(domRef));
            fnInit(iframePlayer);
            
            // Check parent frame & temporarily add this factory to the player list with a UID
            var uAdId = uid + new Date().getTime();
            _this.uid = function() {
              return uAdId;
            }
            
            // Added for PostMessage target verification
            $ADP.AdPlayerManager.factoryList().push(_this);    
            
            var obj = new Object();
            obj.postType = $ADP.PostMessage.OUTGOING;
            obj.uid = _this.uid();
            obj.fn = 'iframePlayerVerify';
            $ADP.PostMessage.send(obj, parent);
            
            _this.setIframePlayerType = function(json) {
              for (var i = 0; i < $ADP.AdPlayerManager.list().length; i++) {
                if ($ADP.AdPlayerManager.list()[i].uid() == _this.uid()) {
                  $ADP.AdPlayerManager.list().splice(i, 1);
                  break;
                }
              }              
              if (json.params == true) {
                iframePlayer.disableAdChoice();
              } 
            }
         } else {
           // Fixes IE issue where ads delivered using document.write
           // are written outside of container
           if ($ADP.Util.isIE) {
             $ADP.Util.log('isIE is set to true.  Searching for previous sibling player...');
             function getPrevSibling(n) {
               var x = n.previousSibling;
               if (x == null) {
                 return false;
               } else { 
                 while (x && x.nodeType != 1) {
                   x = x.previousSibling;
                   if ($ADP.AdPlayerManager.getAdPlayerById(x.id)) { break; }
                 }
                 return x;
               }
             }
             var ieAdPlayer = $ADP.AdPlayerManager.getAdPlayerById(getPrevSibling(
                 document.getElementById(domRef)).id);
             if (ieAdPlayer) {
               $ADP.Util.log('Found player at ' + ieAdPlayer.adDomElement().id);
               fnInit(ieAdPlayer);
               return;
             } else {
               $ADP.Util.log('Searching parent div...');
               var parChildren = document.getElementById(domRef).parentNode.childNodes;
               for (var i = 0; i < parChildren.length; i++) {
                 if (parChildren[i].id != '') {
                   ieAdPlayer = $ADP.AdPlayerManager.getAdPlayerById(parChildren[i].id);
                   if (ieAdPlayer) {
                     fnInit(ieAdPlayer);
                     return;
                   }
                 }
               }
               $ADP.Util.log('Creating new player for ' + uid);
               fnInit(new $ADP.DefaultPlayer(uid, document.getElementById(domRef)));
             }
           }
           $ADP.Util.log('Creating new player for ' + uid);
           fnInit(new $ADP.DefaultPlayer(uid, document.getElementById(domRef)));
         }         
         removeFromAdMgrList(domRef);
       }
     }     
   }

   /**
    * @name $ADP.PlayerFactory#returnDefault
    * @function
    * @description Executes a callback function with a default <code>$ADP.AdPlayer</code>.
    * @param {string} uid Unique ID used to identify an <code>$ADP.AdPlayer</code>.
    * @param {string} domRef DOM ID used to mark the start point of a DOM search.
    * @param {function} fnInit Callback executed when a default <code>$ADP.AdPlayer</code> is created.
    */
   function returnDefault(uid, domRef, fnInit) {
     fnInit(new $ADP.DefaultPlayer(uid, document.getElementById(domRef)));
   }

   /**
    * @name $ADP.PlayerFactory#setDocWriteRef
    * @function
    * @description Sets a <code>span</code> element using <code>document.write</code>.
    * @return {string} domId ID of the generated <code>span</code> element.
    */
   function setDocWriteRef() {
     var uAdId = new Date().getTime();
     $ADP.Util.log('WARNING: No valid referral element specified for "'+uid+'". Referral will be created using "document.write"', 'parentDomSearch');
     domId = 'ref' + uAdId;
     document.write('<span id="' + domId + '"></span>');
     return domId;
   }
   
   init();
   return _this;
});