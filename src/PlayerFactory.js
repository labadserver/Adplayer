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
var PlayerFactory = (function(uid, domId, adDomElement, fnInit){
  /*
   * CASES:
   * 
   * if DOM object <<<<<<<
   *    - Lookup List if the DOM has a player <<<<<<<
   *      - if yes found in LIST <<<<<<<
   *          set player pass to fnInit <<<<<<<
   *      - if not found in LIST <<<<<<<
   *          Look through DOM page <<<<<<<
   *            - Set Ref OBj for scanning <<<<<<<
   *              - wait for ref obj to load <<<<<<<
   *              - on ref object load... <<<<<<<
   *                - if found in DOM page <<<<<<<
   *                    set player pass to fnInit <<<<<<<
   *                - if not found in DOM page <<<<<<<
   *                    create a new player and pass to fnInit <<<<<<<
   * Else (NO DOM Obj) <<<<<<<
   *    - Look through DOM page
   *            - Set Ref OBj for scanning
   *              - wait for ref obj to load
   *              - on ref object load...
   *                - if found in DOM page
   *                    set player pass to fnInit
   *                - if not found in DOM page
   *                    create a new player and pass to fnInit
   */  
  
  var _isInIFrame = (window.location != window.parent.location) ? true : false;
  if (_isInIFrame) {
    // TODO: If in iFrame - change to FramePlayer 
    fnInit(new DefaultPlayer(uid, adDomElement));
    return;
  }
  
  if (adDomElement) {
    var domPlayer = AdPlayerManager.getPlayerByDomElement(adDomElement);
    if(domPlayer) {
      fnInit(domPlayer);
    } else {
      parentDomSearch(uid, domId, adDomElement, fnInit);
    }
  } else {
    parentDomSearch(uid, domId, adDomElement, fnInit);
  }
  
  function parentDomSearch(uid, domId, adDomElement, fnInit) {
    var uAdId = new Date().getTime();
    
    var dom = document.getElementById(domId);
    if (!dom) {
      log('WARNING: No valid referral element specified for "'+uid+'". Referral will be created using "document.write"', 'parentDomSearch');
      domId = 'ref'+ uAdId;
      document.write('<span id="'+domId+'"></span>');
    }
    
    function refWait(domId, readyFn) {
      var _interval = setInterval(check, 100);
      var _this = this;
      var _timeout = 0;
      function check() {
//      log('finding...'+domId);
        _timeout ++;
        if (_timeout == 100) {
          clearInterval(_interval);
          log('No Valid Ad Player could be found. Creating default...', 'refWait');
          fnInit(new DefaultPlayer(uid, adDomElement));
        }
        if (document.getElementById(domId)) {
//        log('found ===> ' + domId);
          clearInterval(_interval);
          readyFn(domId);
        }
      }
    }    
    
    function searchDom(domId){
      var par = document.getElementById(domId).parentNode;
      while (!AdPlayerManager.getAdPlayerById(par.id)) {
        par = par.parentNode;
        parName = par.nodeName.toLowerCase();
        if ((parName == 'body') || (parName == 'html')) { break; }
      }
      if(par) {
        var adPlayer = AdPlayerManager.getAdPlayerById(par.id);
        if(adPlayer) {
//          adPlayer.adDomElement().removeChild(document.getElementById(domId));
          if(fnInit) {
//          log('Found player at '+adPlayer.adDomElement().id);
            fnInit(adPlayer);
          }  
        } else {
//        log('No AdPlayer found after parent search. Creating new player for '+domId);
          fnInit(new DefaultPlayer(uid, adDomElement));
        }
      }
    }
    
    refWait(domId, searchDom);
  }

});