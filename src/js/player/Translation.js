try {
	$ADP.Player.adpTranslation = {
		/*
		 * Example
		 */
		 
/*
		'fr' : {
			'header': 'Headertext in Französisch',
			'footer': 'Footertext in Französisch'
		}
*/
	}
	$ADP.Util.log('Loaded Adplayer translation successfully.');
} catch (e) {
	$ADP.Util.log('Failed to add  Aplayer translation: ' + e.message);
}