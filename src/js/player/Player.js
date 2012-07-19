if(!$ADP.Player) {

	/**
	 * @name $ADP.Player
	 * @class
	 * @description The <code>$ADP.Player</code> class.
	 * @param id See {@link $ADP.Registry#register}
	 * @param args See {@link $ADP.Registry#register}
	 * @example TODO
	 */
	$ADP.Player = function (id, args) {
		return this instanceof $ADP.Player ? this.init(id, args) : new $ADP.Player(id, args);
	}
	
	$ADP.Player.prototype = {
		/**
		 * @private
		 * @name $ADP.Player#attempts
		 * @field
		 * @description Used to keep track of current attempts being made.
		 * 
		 * @type integer
		 */
	    attempts: 0,
	
	    /**
		 * @name $ADP.Player#maxAttempts
		 * @field
		 * @description The maximum amount of attempts to wait for the
		 *              <code>Player</code>'s container to be available in the
		 *              DOM.
		 * 
		 * @default 50
		 * @type integer
		 */
	    maxAttempt: 50,
	    
	    browserLanguage: undefined,
	
	    /**
		 * @name $ADP.Player#adChoicesTranslation
		 * @description Array with the Translations from "Datenschutzinfo" in all
		 *              languages
		 */
	    
	    translation: {
	    	'de' : {
	    		'adchoices' : 'Datenschutzinfo',
	    		'header' : '<strong class="adp-header-strong">Informationen zu nutzungsbasierter Online-Werbung</strong><br/>In der vorliegenden Anzeige werden Ihre Nutzungsdaten anonym erhoben bzw. verwendet, um Werbung f&uuml;r Sie zu optimieren. Wenn Sie keine nutzungsbasierte Werbung mehr von den hier gelisteten Anbietern erhalten wollen, k&ouml;nnen Sie die Datenerhebung beim jeweiligen Anbieter direkt deaktivieren. Eine Deaktivierung bedeutet nicht, dass Sie k&uuml;nftig keine Werbung mehr erhalten, sondern lediglich, dass die Auslieferung der konkreten Kampagne nicht anhand anonym erhobener Nutzungsdaten ausgerichtet ist.',
	    		'footer' : 'Wenn Sie mehr &uuml;ber nutzungsbasierte Online-Werbung erfahren wollen, klicken Sie <a href="http://meine-cookies.org" target="_blank">hier</a>. Dort k&ouml;nnen Sie dar&uuml;ber hinaus auch bei weiteren Anbietern die Erhebung der Nutzungsinformationen deaktivieren bzw. aktivieren und den Status der Aktivierung bei unterschiedlichen Anbietern <a href="http://meine-cookies.org/cookies_verwalten/praeferenzmanager-beta.html" target="_blank">einsehen</a>.'
	    	},
			'en' : {
				'adchoices' : 'AdChoices',
				'header' : 'Headertext in English',
				'footer' : 'Headertext in English'
			},
			'fr' : {
				'adchoices': 'Choisir sa pub'
			},
			'nl' : {
				'adchoices': 'Info reclamekeuze'
			},
			'bg' : {
				'adchoices': 'Вашият избор'
			},
			'cs' : {
				'adchoices': 'Volby reklamy'
			},
			'da' : {
				'adchoices': 'Annoncevalg'
			},
			'fi' : {
				'adchoices': 'Mainokseni'
			},
			'el' : {
				'adchoices': 'Οι διαφημίσεις μου'
			},
			'it' : {
				'adchoices': 'Scegli tu!'
			},
			'nl' : {
				'adchoices': 'Info'
			},
			'no' : {
				'adchoices': 'Annonsevalg'
			},
			'pl' : {
				'adchoices': 'Informacja'
			},
			'ro' : {
				'adchoices': 'Optiuni'
			},
			'sk' : {
				'adchoices': 'Vaša voľba'
			},
			'es' : {
				'adchoices': 'Gestión anuncios'
			},
			'sv' : {
				'adchoices': 'Annonsval'
			}
	    },
	
	    /**
		 * @private
		 * @name $ADP.Player#init
		 * @function
		 * @description Class constructor.
		 */
	    init: function (id, args) {
	      this.id = id;
	      this.domId = args.domId;
	      this.translationFile = args.translation;
	      this.header = args.header;
	      this.footer = args.footer;
	      this.publisherInfo = args.publisherInfo;
	      this.position = args.position || 'top-right';
	      this.usePopup = !!args.usePopup;
	      this.renderCloseButton = !!args.renderCloseButton;
	      this.popup = !!args.popup;
	      this.browserLanguage = $ADP.Util.getBrowserLanguage();
	    },
	
	    /**
		 * @name $ADP.Player#getId
		 * @function
		 * @description Returns the OBA id that is used to identify this player's
		 *              unique privacy messages.
		 * 
		 * @returns {integer} The player's OBA id.
		 */
	    getId: function () {
	      return this.id;
	    },
	
	    /**
		 * @name $ADP.Player#getDOMId
		 * @function
		 * @description Returns the OBA DOM id that is used to identify this
		 *              player's unique privacy messages.
		 * 
		 * @returns {integer} The player's OBA DOM id.
		 */
	    getDOMId: function () {
	      return this.domId;
	    },
	
	    /**
		 * @name $ADP.Player#getDOMId
		 * @function
		 * @description Returns the OBA DOM id that is used to identify this
		 *              player's unique privacy messages.
		 * 
		 * @returns {integer} The player's OBA DOM id.
		 */
	    getTranslationFile: function () {
	      return $ADP.Registry.translationFile ? $ADP.Registry.translationFile : false;
	    },
	
	    /**
		 * @name $ADP.Player#getPosition
		 * @function
		 * @description Returns the position of the OBA button.
		 * 
		 * @returns {string} The OBA button position. <b>Default:</b> top-right
		 */
	    getPosition: function () {
	      return this.position || 'top-right';
	    },
	
	    /**
		 * @name $ADP.Player#getHeader
		 * @function
		 * @description Returns the player's header message displayed in the privacy
		 *              window.
		 * 
		 * @returns {string} The player's header message. <b>Default:</b>
		 *          Datenschutzbestimmungen
		 */
	    getHeader: function () {
	      return (this.header || this.getText({'type': 'header'}));
	    },
	
	    /**
		 * @name $ADP.Player#getFooter
		 * @function
		 * @description Returns the player's footer message displayed in the privacy
		 *              window.
		 * 
		 * @returns {string} The player's footer message. <b>Default:</b> <i>empty
		 *          string</i>
		 */
	    getFooter: function () {
	        return (this.footer || this.getText({'type': 'footer'}));
	    },
	    
	    /**
		 * @name $ADP.Player#getPublisherInfo
		 * @function
		 * @description Returns the player's publisher info message displayed in the
		 *              privacy window.
		 * 
		 * @returns {string} The player's publisher message. <b>Default:</b>
		 *          <i>empty string</i>
		 */
	    getPublisherInfo: function () {
	      return (this.publisherInfo || '');
	    },
	    
	    /**
		 * @name $ADP.Player#getPrivacyButtonText
		 * @function
		 * @description Returns the text displayed when hovering the privacy button.
		 * @todo: localization still has to be done, decission about dealing with
		 *        special html characters
		 * 
		 * @returns {string} The player's privacy button text. <b>Default:</b>
		 *          <i>Datenschutzinfo</i>
		 */
	    getPrivacyButtonText: function () {
	    	return this.getText({'type': 'adchoices'});
	    },
	    
	    /**
		 * @name $ADP.Player#usePopupForPrivacyInfo
		 * @function
		 * @description Returns whether the privacy info should be displayed in a
		 *              popup window.
		 * 
		 * @returns {boolean}
		 */
	    usePopupForPrivacyInfo: function () {
	      return this.usePopup == false ? false : true;
	    },
	    
	    /**
		 * @name $ADP.Player#renderCloseButtonForPrivacyInfo
		 * @function
		 * @description Returns whether the close button should be displayed (in a
		 *              popup window).
		 * 
		 * @returns {boolean}
		 */
	    renderCloseButtonForPrivacyInfo: function () {
	      return this.renderCloseButton ? true : false;
	    },
	
	    /**
		 * @name $ADP.Player#hasPrivacyInfo
		 * @function
		 * @description Returns boolean determining whether the player contains any
		 *              privacy information.
		 * 
		 * @returns {boolean} <code>true</code> / <code>false</code>
		 * 
		 * @see $ADP.PrivacyInfo
		 */
	    hasPrivacyInfo: function () {
	      return Boolean(this.items.length);
	    },
	
	    /**
		 * @name $ADP.Player#getPopup
		 * @function
		 * @description Returns this popup reference
		 * 
		 * @returns {object} The list containing privacy information.
		 * 
		 * @see $ADP.PrivacyInfo
		 */
	    getPopup: function () {
	      return this.popup;
	    },
	
	    /**
		 * @name $ADP.Player#getPrivacyInfos
		 * @function
		 * @description Returns a list containing the player's privacy information.
		 * 
		 * @returns {array} The list containing privacy information.
		 * 
		 * @see $ADP.PrivacyInfo
		 */
	    getPrivacyInfos: function () {
	      return this.items;
	    },
	
	    /**
		 * @private
		 * @name $ADP.Player#inject
		 * @function
		 * @description Assumes arguments have been predefined at instantiation and
		 *              initializes player setup when invoked.
		 * 
		 * @see $ADP.Registry#createPlayer
		 */
	    inject: function () {
	      var obaId = this.getId();
	      var domId = this.getDOMId();
	      var position = this.getPosition();
	      if (!obaId) {
	        // No obaId specified for $ADP.Play/er.inject into ' + domId
	        return;
	      }
	      if (!domId) {
	        if (window == window.top && document.body) return;
	        var iframeButton = document.createElement('DIV');
	        iframeButton.id = domId = 'iframe-button-' + Math.round(Math.random() * 9999);
	        document.body.insertBefore(iframeButton, document.body.firstChild);
	      }
	      var container = iframeButton || document.getElementById(domId);
	      if (container) {
	        container.innerHTML = '<div id="adp-wrapper-' + obaId + '" class="adp-wrapper adp-' + position + '" style="z-index:99999999;" onmouseover="this.className += \' adp-admarker-hover\';" onmouseout="this.className = this.className.replace(/adp-admarker-hover/, \'\');">' + '<div id="adp-admarker-' + obaId + '" class="adp-admarker" >' + '<div id="adp-admarker-icon-' + obaId + '" class="adp-admarker-icon adp-' + position + '" onClick="$ADP.Registry.collectPrivacy('+obaId+');"><\/div>' + '<div id="adp-admarker-text-' + obaId + '" class="adp-admarker-text adp-' + position + '"  onClick="$ADP.Registry.collectPrivacy('+obaId+');">' + this.getPrivacyButtonText() + '<\/div>' + '<\/div>';
	      } else {
	        if (this.attempts > this.maxAttempts) {
	          $ADP.Util.log('Too many attempts for ' + obaId + ', ' + domId);
	          return;
	        } else {
	          ++this.attempts;
	          var that = this;
	          setTimeout(function () {
	            that.inject();
	          }, 100);
	        }
	      }
	    },
	    /**
		 * @name $ADP.Player#getPanelHTML
		 * @function
		 * @description This compiles the html to be displayed in the privacy panel
		 * @return {string} The panel HTML string
		 */
	    getPanelHTML: function() {
	      var obaId = this.getId();
	      var position = this.getPosition();
	      var header = this.getHeader();
	      var footer = this.getFooter();
	      var publisherInfo = this.getPublisherInfo();
	      var items = this.getPrivacyInfos();
	      var usePopup = this.usePopupForPrivacyInfo();
	      var closeAction = !usePopup ?"$ADP.Registry.playerCmd("+obaId+",'hidePrivacy');":'window.close();';
	      var renderCloseButton = this.renderCloseButtonForPrivacyInfo();
	      var privacy_info = '';
	      for (var i = 0; i < items.length; i++) {
	        var item = items[i];
	        if(i != 0) { privacy_info += "<br /><br />\n" }
	        try {
	          privacy_info += item.render();
	        } catch (e) {}
	      }
	      
	      var panelContent = '';
	      panelContent = panelContent.concat('<div class="adp-panel-wrapper">');
	      if(header != '') panelContent = panelContent.concat('<div class="adp-panel-header">' + header + '<\/div>');
	      if(publisherInfo != '') panelContent = panelContent.concat('<div class="adp-panel-publisherinfo">' + publisherInfo + '<\/div>');
	      panelContent = panelContent.concat('<div class="adp-panel-info">' + privacy_info + '<\/div>');
	      if(footer != '') panelContent = panelContent.concat('<div class="adp-panel-footer">' + footer + '<\/div>');
	      panelContent = panelContent.concat('<\/div>');
	      var HTML = '';
	      if(!usePopup || (usePopup && renderCloseButton)) HTML += '<div id="adp-panel-close-' + obaId + '" class="adp-panel-close" onClick="'+closeAction+'">x<\/div>'
	      HTML += panelContent;
	      return HTML;
	    },
	    
	    /**
		 * @name $ADP.Player#showPrivacy
		 * @function
		 * @description Will show the privacy information
		 * @param {integer}
		 *            obaid
		 */
	    showPrivacy: function() {
	      var position = this.getPosition();
	      var obaId = this.getId();
	      var usePopup = this.usePopupForPrivacyInfo();
	      function renderInLayer() {
	        var panel = document.getElementById('adp-panel-' + obaId);
	        if (!panel) {
	          var wrapper = document.getElementById('adp-wrapper-'+obaId);
	          if(!wrapper) return;
	          var panel = document.createElement('DIV');
	          panel.id='adp-panel-' + obaId;
	          panel.className='adp-panel adp-' + position;
	          panel.display='block';
	          panel.innerHTML = this.getPanelHTML();
	          wrapper.appendChild(panel);
	        } else panel.style.display = 'block';
	      }
	      if (!usePopup) {
	    	var popup = this.getPopup();
	    	if (popup) { popup.close() }
	        renderInLayer.apply(this);
	      } else {
	        var title = "Privacy Information";
	        var styles = document.styleSheets;
	        var popwin = this.getPopup();
	        if(!popwin) { renderInLayer.apply(this); }
	        else {
	          var popdoc = popwin.document;
	          window.popwin = popwin;
	          popdoc.write('<!doctype html><html><head><title>'+title+'</title>');
	          for (var k in styles)
	            if (styles[k].href) popdoc.write('<link rel="stylesheet" href="'+styles[k].href+'">');
	          popdoc.write('</head><body class="adp-popup"><div class="adp-wrapper"><div class="adp-panel">');
	          popdoc.write(this.getPanelHTML());
	          popdoc.write('</div></div></body></html>');
	          popdoc.close();
	          popwin.focus();
	        }
	      }
	    },
	
	    /**
		 * @name $ADP.Player#hidePrivacy
		 * @function
		 * @description hides the privacy information
		 * @param {integer}
		 *            obaid
		 */
	    hidePrivacy: function() {
	      var obaId = this.getId();
	      var panel = document.getElementById('adp-panel-' + obaId);
	      if (panel) panel.style.display = 'none';
	    },
	    
	    /**
	     * @name $ADP.Player#getText
	     * @function
	     * @descripton Returns the text in browser language. If the browser language is not german or english, the adplayer-translation.js will be tryed to load. If there a translation is missing, english will be used as fallback.
	     * @param {array} arg
	     * @return Text in browser language
	     */
	    
	    getText: function (args) {
		  	if(args['type']) {
		  		if(!(this.browserLanguage == 'de' || this.browserLanguage == 'en') && !document.getElementById('adptranslation') && this.getTranslationFile()) {
		  		   try {
		  	           var adpTranslationSrc = document.createElement('script');
		  	           adpTranslationSrc.type = 'text/javascript';
		  	           adpTranslationSrc.async = true;
		  	           adpTranslationSrc.id = 'adptranslation';
		  	           adpTranslationSrc.src = this.getTranslationFile();
		  	           adpTranslationSrc.charset = 'utf-8';
		  	           document.getElementsByTagName('head')[0].appendChild(adpTranslationSrc);
		  	           $ADP.Util.log('Try to load translation file: ' + this.getTranslationFile())
		  		   } catch (e) { $ADP.Util.log('Failed to load translation file: ' + e.message); }
				}
		  		
		  		$ADP.Util.log('UTF8 Check (greek): ' + this.translation['el']['adchoices']);
		  		
	  			if(this.translation[this.browserLanguage] && this.translation[this.browserLanguage][args['type']]) {
		  			return this.translation[this.browserLanguage][args['type']];
		  		}
		  		else if($ADP.Player.adpTranslation && $ADP.Player.adpTranslation[this.browserLanguage] && $ADP.Player.adpTranslation[this.browserLanguage][args['type']]) {
		  			return $ADP.Player.adpTranslation[this.browserLanguage][args['type']];
		  		}
		  		else {
		  			return this.translation['en'][args['type']];
		  		}
		  	}
	    }
	}
} // closing if(!$ADP.Player)
