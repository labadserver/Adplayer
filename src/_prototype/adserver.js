/*
	$Revision: 1.4 $Date: 2012/04/25 11:41:19 $
	Author: ingrid.graefen@sevenonemedia.de
*/

(function() {
	// Retrieve current script params
	var sz;
	var oba;
	var chain     = 1;
	var publisher = 0;
	var iframe    = false;

	var scripts = document.getElementsByTagName('script');
	for (var i = scripts.length - 1; i >= 0; i--) {
		var script = scripts[i];
		if (!script.src) continue;
		var found = script.src.match(/adserver\.js\?(.*)/);
		if (!found) continue;
		
		var pairs = found[1].split(/[&;]/);
		for (var j = 0; j < pairs.length; j++) {
			var data = pairs[j].split(/=/);
			switch (data[0]) {
				case 'publisher':
					publisher = data[1];
					break;
				case 'oba':
					oba = data[1];
					break;
				case 'sz':
					sz = data[1];
					break;
				case 'chain':
					chain = Number(data[1]) || 0;
					break;
				case 'iframe':
					iframe = Number(data[1]) ? true : false;
					break;
			}
		}
		break;
	}

	// Retrieve url params for various test scenarios
	var config = {};
	try {
		var search = String(top.location.search.substr(1));
		var pairs = search.split(/&/);
		for (var i = 0; i < pairs.length; i++) {
			var data = pairs[i].split(/=/);
			config[data[0]] = data[1];
		}
		config.forgetful = Number(config.forgetful) || 0;
	}
	catch (e) {}

	/************************************************************************/
	// Publisher 0 ... N if privacy info must be added (oba might be undefined)
	// returns fresh oba if oba was undefined
	oba = registerPrivacyInfo(
			oba,
			{
				title:    sz + ': publisher ' + publisher,
				text:     'OBA',
				url:      'http://www.w3.org',
				linkText: 'Mehr'
			}
		);
	/************************************************************************/
	
	var do_redirect = chain > 1 && publisher != 'N' && !iframe ? true : false;

	// Simulation of forgetful publisher who is not passing oba param,
	// or not creating privacy button
	var forgetful = Math.random() < config.forgetful / 10 ? true : false;
	if (forgetful) {
		var messages = document.getElementById('messages');
		if (messages) {
			if (!messages.innerHTML) {
				messages.innerHTML += '<b>Publisher inserted buttons are in top-right position.<br />'
					+ 'Emergency buttons appear after 2 secs in top-left position.</b><br /><br />';
				messages.style.backgroundColor = 'pink';
			}
			messages.innerHTML += sz + ': publisher ' + publisher + ' from ' + chain + ' forgets '
				+ (do_redirect ? 'to pass oba parameter' : 'to create privacy button')
				+ '<br />';
		}
	}

	var params = '';
	if (do_redirect || iframe) {
		// Publisher X [0...N-1] - Redirect
		var next = Number(publisher) + 2 < chain ? Number(publisher) + 1 : 'N';
		params = 'sz=' + sz + ';'
			+ 'publisher=' + next + ';';
		if (chain) params += 'chain=' + chain + ';'
		if (oba && !forgetful) params += 'oba=' + oba + ';';
	}

	// Define ad dimensions
	var w;
	var h;
	var z;
	switch (sz) {
		case 'banner':
			var small = Math.random() < 0.3 ? true : false;
			w = small ? 468 : 728;
			h = small ?  60 :  90;
			z = 100;
			break;
		case 'skyscraper':
			var narrow = Math.random() < 0.3 ? true : false;
			w = narrow ? 120 : 160;
			h = 600;
			z = 200;
			break;
		case 'rectangle1':
			var halfpage = Math.random() < 0.3 ? true : false;
			w = 300;
			h = 250;
			z = 300;
			break;
		case 'rectangle2':
			w = 300;
			h = 250;
			z = 300;
			break;
		default:
			w = 180;
			h = 120;
			z = 400;
			break;
	}

	// Ad code - iframe, redirect or physical
	if (iframe) {
		// Iframe
		document.write('<iframe id="ad-' + sz + '-iframe" src="./adserver.html?' + params + '" style="margin:0px;padding:0px;width:' + w + 'px;height:' + h + 'px;" scrolling="no"></iframe>');
	}
	else {
		// Redirect or physical
		if (do_redirect) {
			document.write('<script type="text/javascript" src="./adserver.js?' + params + '"></script>');
		}
		else {
			// Publisher N - Physical Ad

			/************************************************************************/
			// Privacy info before ad code
			// FIXME: not yet working in iframe
			if (window == parent && !forgetful && oba)
				injectPrivacyInfo(oba, {sz: sz, w: w, z: z + 1});
			/************************************************************************/

			// physical ad
			document.write('<div id="ad-' + sz + '" style="position:relative;z-index:' + z + ';background-color:seagreen;width:' + w + 'px;height:' + h + 'px;"></div>')
		}
	}
}())

/*
	Functions to be defined by publishers
*/

function checkADPScript() {
	if (window.$ADP) return true;

	var script = document.createElement('script');
	script.type = 'text/javascript';
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
