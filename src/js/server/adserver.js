/*
  Functions to be defined by publishers
*/

function checkADPScript() {
  if (window.$ADP) return true;
  var script = document.createElement('script');
  script.type = 'text/javascript';
  // FIXME: Update base on build file name.  Possibly separate to variable.
  script.src = './adplayer.js';
  try {
    document.body.insertBefore(script, document.body.firstChild)
  }
  catch(e) {}

  return false;
}

// Publisher 0 ... N
// returns the oba id used for registration (passed as first argument, or fresh)
function registerPrivacyInfo(oba, args) {
  var domId;
  if (!oba) {
    oba = parseInt(Math.random() * 100000000);
    domId = 'publisher-oba-emergency-' + oba;
    // Must have position relative, height 0, high z-index
    // FIXME: not working yet in iframe case
    document.write('<div id="' + domId + '" style="position:relative;z-index:99999999;height:0px;"></div>');
  }

  if (!window.$ADP) {
    var ok = checkADPScript();
    if (!ok) {
      if (!arguments.callee.attempts) arguments.callee.attempts = 0;
      ++arguments.callee.attempts;
      if (arguments.callee.attempts < 50) {
        setTimeout(function() {registerPrivacyInfo(oba, args)}, 100);
      }
      return oba;
    }
  }

  var info = {
      title:    args.title,
      text:     args.text,
      url:      args.url,
      linkText: args.linkText
    };
  if (domId) info.domId = domId;

  // For testing only
  info.text += ' ' + oba;

  try {
    $ADP.Registry.register(oba, info);
  }
  catch(e) {
    alert(e.message);
  }

  return oba;
}

// Publisher N
function injectPrivacyInfo(oba, args) {
  if (!window.$ADP) {
    var ok = checkADPScript();
    if (!ok) {
      if (!arguments.callee.attempts) arguments.callee.attempts = 0;
      ++arguments.callee.attempts;
      if (arguments.callee.attempts < 50) {
        setTimeout(function() {injectPrivacyInfo(oba, args)}, 100);
      }
      return;
    }
  }
  
  // FIXME: Use legible names.  Variables modified during compression.
  var sz  = args.sz;
  var z   = args.z;
  var w   = args.w;
  var domId = 'publisher-oba-' + sz; // this publisher knows that this id is unique
  document.write('<div id="' + domId + '" style="position:relative;z-index:' + z + ';width:' + w + 'px;height:0px;"></div>');
  try {
    $ADP.Registry.createPlayer(oba, {domId: domId, position: 'top-right', header: 'Datenschutz-Info', footer: 'Footer-Info'});
  }
  catch(e) {
    alert(e.message);
  }
}
