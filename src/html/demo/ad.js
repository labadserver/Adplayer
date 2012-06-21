var obaId = '54321'		// Pulled by the Ad-Server
var domId = 'adp_container_'+obaId;

document.write('<div id="'+domId+'"></div>');

var obaInformation = {
		title: 'Targeter II',
		text: 'Description',
		url: 'http://www.targeter-ii.com',
		linkText: 'More',
		usePopup: false, // ONLY set this attribute if you want to display the Ad in a layer instead of a popup. This can leads to display-errors
		domId: domId
}

$ADP.Registry.register(obaId, obaInformation);

$ADP.Registry.createPlayer(obaId);

// Your Ad-Code

document.write('<img src="http://placehold.it/728x90" />');