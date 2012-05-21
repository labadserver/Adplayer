/*
	$Revision: 1.7 $Date: 2012/05/02 08:24:02 $
	Author: ingrid.graefen@sevenonemedia.de
*/

/*
	Remarks

	- Iframe or popup case:
	If script is loaded asynchronously,
	there is no guaranteed order of registered info items,
	e.g. 0 2 1 3 N is possible
	This cannot be prevented (and does not matter anyway).

	- If party in iframe retrieves params but forgets to display button,
	No fallback button is created outside of iframe,
	i.e. privacy info is lost on all levels.
	This is a "feature", not a bug.
*/

(function() {
	var config = getConfig();
	var sz     = config.sz;
	var party  = config.party;
	var iframe = config.iframe;

	var obaId  = config.obaId;
	var isStart = false;
	if (!obaId) {
		// generate unique value for obaId
		obaId = config.obaId = parseInt(Math.random() * 100000000);
		isStart = true;
	}
	
	/************************************************************************/
	// Party 0 ... N iff privacy item must be added
	registerPrivacyInfo(
			obaId,
			{
				isStart:  isStart, // => create container for fallback button
				header:   'Header set by party ' + party, // optional
				footer:   'Footer set by party ' + party, // optional
				position: 'top-right', // optional
				display:  'layer', // optional
				title:    sz + ': party ' + party,
				text:     'OBA ' + obaId,
				url:      'http://www.w3.org',
				linkText: 'Mehr'
			}
		);
	/************************************************************************/

	/************************************************************************/
	var properties = getAdProperties(sz);

	// Party N only: add privacy button *before* ad code (=> top position correct without explicit setting)
	if (config.lastParty && obaId && !config.forgetful) {
		injectPrivacyInfo(
				obaId,
				{
					domId:    'my-oba-' + sz, // fresh domId(!) unique id,
					width:    properties.width,
					height:   properties.height,
					zindex:   properties.zindex,
					position: 'top-right',
					header:   'Datenschutz-Info',
					footer:   'Footer-Info'
				}
			);
	}
	/************************************************************************/

	// Generate ad code via document.write
	// iframe, redirect or physical as appropriate
	var ad_code = generateAdCode(config, properties);
	document.write(ad_code);
}())

/**********************************************************************************/

/*
	Functions for test suite
*/

// Merge script params and url params
function getConfig() {
	var config = retrieveScriptParams();
	var params = retrieveURLParams();
	// Merge
	for (var k in params) config[k] = params[k];

	simulateForgetfulParty(config);

	return config || {};
}

// Retrieve parameters of current script
function retrieveScriptParams() {
	var params = {};
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
				case 'party':
					params.party = data[1];
					break;
				case 'oba':
					params.obaId = data[1];
					break;
				case 'sz':
					params.sz = data[1];
					break;
				case 'chain':
					params.chain = Number(data[1]) || 0;
					break;
				case 'iframe':
					params.iframe = Number(data[1]) ? true : false;
					break;
			}
		}
		break;
	}
	if (!params.chain)  params.chain = 1;
	if (!params.party)  params.party = 0;
	if (!params.iframe) params.iframe = false;

	params.lastParty = params.party == 'N'
		|| (params.party == 0 && params.chain < 2 && !params.iframe) ?
			true : false;

	params.do_redirect = !params.lastParty && !params.iframe ?
		true : false;

	return params;
}

// Retrieve url params for various test scenarios
function retrieveURLParams() {
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
	return config;
}

// Simulation of randomly forgetful parties
function simulateForgetfulParty(config) {
	var forgetful = Math.random() < config.forgetful / 10 ? true : false;

	// Pink info panel
	if (forgetful) {
		var messages = parent.document.getElementById('messages');
		if (messages) {
			if (!messages.innerHTML) {
				messages.innerHTML += '<b>Buttons explictly inserted by a party are in top-right position.<br />'
					+ 'Fallback buttons appear after 2 secs in top-left position.</b><br /><br />';
				messages.style.backgroundColor = 'pink';
			}
			messages.innerHTML += config.sz + ': party ' + config.party + ' from ' + config.chain + ' forgets '
				+ (config.lastParty ? 'to create privacy button' : 'to pass oba parameter')
				+ '<br />';
		}
	}

	config.forgetful = forgetful;
}

function getNextParams(config) {
	if (config.lastParty) return '';

	// Party X [0...N-1] - Redirect
	var party = Number(config.party) || 0;
	var next;
	if (config.iframe) {
		next = party; // CAVEAT: never add recursive iframes
	}
	else if (party + 2 < config.chain) {
		next = party + 1
	}
	else {
		next = 'N';
	}

	var params = 'sz=' + config.sz + ';'
		+ 'party=' + next + ';';
	if (config.chain) params += 'chain=' + config.chain + ';'
	if (config.obaId && !config.forgetful)
		params += 'oba=' + config.obaId + ';';

	return params;
}

// Define dimension and z-index for a given ad slot
function getAdProperties(sz) {
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

	return {
			width:  w,
			height: h,
			zindex: z
		};
}

function generateAdCode(config, properties) {
	var sz = config.sz;

	var w = properties.width;
	var h = properties.height;
	var z = properties.zindex;

	var code = '';
	if (config.lastParty) {
		// Party N => Physical Ad
		var style = 'position:relative;'
			+ 'z-index:' + z + ';'
			+ 'background-color:seagreen;'
			+ 'width:' + w + 'px;'
			+ 'height:' + h + 'px;';
		code = '<div id="ad-' + sz + '" style="' + style + '"></div>';
	}
	else {
		var params = getNextParams(config);

		if (config.do_redirect) {
			// Redirect
			code = '<script type="text/javascript" src="./adserver.js?' + params + '"></script>';
		}
		else if (config.iframe) {
			// Iframe
			var style = 'margin:0px;'
				+ 'padding:0px;'
				+ 'width:' + w + 'px;'
				+ 'height:' + h + 'px;';
			code = '<iframe id="ad-' + sz + '-iframe" src="./adserver.html?' + params + '"'
				+ ' style="' + style + '" frameborder="0" scrolling="no"></iframe>';
		}
	}
	return code;
}

/**********************************************************************************/

/*
	Functions to be defined by parties
*/

/*
	- p(0) must load adplayer scripts
	- p(0) should
		- generate unique obaId (regardless of a need to pass privacy info)
		- provide container for fallback button with unique domId
		- register instance obaId with domId
	- p(0) may pass privacy info when registering instance
	- p(0) must pass obaId to next party if existent

	- p(x) may generate unique obaId iff non-existent
	- p(x) may register privacy info for obaId
	- p(x) must pass obaId to next party if existent
	- p(x) should provide container for fallback button with unique domId
		iff obaId was created by p(x)
		If so, domId must be passed to register method

	- p(n) may generate unique obaId iff non-existent
	- p(n) may register privacy info for obaId
	- p(n) must
		- provide final container for privacy button (id fresh and unique)
		- must inject privacy button into this container
		- must take responsibility for this button (hide, show, move, ...)
*/

function loadADPScript() {
	if (window.$ADP) return;

	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = './adplayer.js';
	try {
		document.body.insertBefore(script, document.body.firstChild);
	}
	catch(e) {}
}

// Party 0 ... N
function registerPrivacyInfo(obaId, args) {
	if (args.isStart) {
		delete args.isStart;

		// Container for fallback button iff fresh obaId was created
		args.domId = 'my-oba-fallback-' + obaId; // some arbitrary unique value

		// Must have position relative(!), height 0,
		// and a "good guess" for a sufficiently high z-index
		var style = 'position:relative;'
			+ 'z-index:1000;'
			+ 'height:0px;';

		// Only create fallback button for fresh obaId
		// => no fallback button within iframe if obaId was passed (!!)
		document.write('<div id="' + args.domId + '" style="' + style + '"></div>');
	}

	if (window.$ADP) {
		try {
			$ADP.Registry.register(obaId, args);
		}
		catch(e) {
			alert('Error with registerPrivacyInfo for ' + args.title + ': ' + e.message);
		}
	}
	else {
		if (!arguments.callee.loading) {
			arguments.callee.loading = true;
			loadADPScript();
		}

		if (!arguments.callee.attempts) arguments.callee.attempts = 0;
		++arguments.callee.attempts;
		if (arguments.callee.attempts < 100) {
			// 0 interval important for correct order of subsequent registrations
			setTimeout(function() {registerPrivacyInfo(obaId, args)}, 0);
		}

		return;
	}
}

// Party N
function injectPrivacyInfo(obaId, args) {
	if (window.$ADP) {
		// Last party might also set position absolute if this is safe
		// Or - for small ads or in iframes - create an outer container with position relative,
		// and an inner container with position absolute, full height and overflow auto
		var style = 'position:relative;'
			+ 'z-index:' + ((args.zindex || 0) + 1) + ';' // lowest possible z-index
			+ 'height:0px;';
		if (args.width) style += 'width:' + args.width + 'px;';

		document.write('<div id="' + args.domId + '" style="' + style + '"></div>');

		try {
			$ADP.Registry.createInstance(obaId, args);
		}
		catch(e) {
			alert('Error with injectPrivacyInfo: ' + e.message);
		}
	}
	else {
		if (!arguments.callee.loading) {
			arguments.callee.loading = true;
			loadADPScript();
		}

		if (!arguments.callee.attempts) arguments.callee.attempts = 0;
		++arguments.callee.attempts;
		if (arguments.callee.attempts < 100) {
			// 0 interval important for correct order of subsequent registrations
			setTimeout(function() {injectPrivacyInfo(obaId, args)}, 0);
		}
	}
}
