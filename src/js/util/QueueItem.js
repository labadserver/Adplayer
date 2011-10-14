// TODO -- RENAME QueueItem and move to separate file and add to build list
var QueueItem = (function(){
  var _this = {};

  _this.onReady = function (evalStr, context, readyFn, readyParams, errorFn, errorParams, search) {
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
  
  return _this;
});