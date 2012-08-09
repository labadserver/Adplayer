try {
    $ADP.Player.adpTranslation = {
        /*
         * Important: Texts should be entity-encoded
         */

        sv: {
            header: '<strong class="adp-header-strong">Information ang&#229;ende beteendestyrd annonsering</strong><br/> Med denna annons sparas anonym data om ditt anv&#228;ndarbeteende f&#246;r att ge dig en f&#246;rb&#228;ttrad annonseringsupplevelse. Du kan st&#228;nga av insamlingen av data, per f&#246;retag, om du inte vill se mer beteendestyrd annonsering fr&#229;n nedanst&#229;ende f&#246;retag. &quot;St&#228;nga av&quot; inneb&#228;r inte att du inte kommer visas annonser i forts&#228;ttningen. Det betyder att annonserna inte kommer visas baserat p&#229; data som inh&#228;mtats anonymt av fr&#229;n dig.',
            footer: 'Om du vill l&#228;ra dig mer om beteendestyrd annonsering, klicka <a href="http://www.youronlinechoices.eu/se/" target="_blank">h&#228;r</a>. D&#228;r kan du &#228;ven st&#228;nga av eller sl&#229; p&#229; insamling fr&#229;n andra leverant&#246;rer. Du kan &#228;ven se status p&#229; insamling av data fr&#229;n olika leverant&#246;rer.'
        },
        da: {
            header: '<strong class="adp-header-strong">Information om adf&#230;rdsbaseret annoncering</strong><br/> I denne annonce bliver data om din adf&#230;rd gemt anonymt og brugt til at optimere annonceringen for dig. Hvis du ikke &#248;nsker at se adf&#230;rdsbaseret annoncering fra annonc&#248;rerne nedenfor, kan du slukke for opsamlingen af data. At &quot;slukke for opsamlingen af data&quot; betyder ikke, at du ikke vil se annoncer fremover. Det betyder blot, at kampagner ikke vil blive vist p&#229; baggrund af anonymt opsamlet data.',
            footer: 'Klik <a href="http://www.youronlinechoices.eu/" target="_blank">her</a>, hvis du &#248;nsker at l&#230;re mere om adf&#230;rdsbaseret annoncering. Her kan du ogs&#229; &quot;slukke&quot; eller &quot;t&#230;nde&quot; for indsamlingen fra andre annonc&#248;rer. Ydermere kan du se statussen p&#229; dataindsamlingen fra forskellige annonc&#248;rer.'
        },
        no: {
            header: '<strong class="adp-header-strong">Informasjon vedr&#248;rende annonsering basert p&#229; brukerm&#248;nster (Behavioral Advertising).</strong><br/> I den gjeldende annonse blir ditt bruksm&#248;nster anonymt lagret for &#229; gi deg mer tilpassede annonser. Du kan velge &#229; stenge innsamlingen av data, per selskap, dersom du ikke vil se m&#229;lrettet annonsering fra selskapene nedenfor. &quot;Stenge&quot; betyr ikke at du ikke vil motta annonser i fremtiden. Det betyr at annonsene ikke blir levert basert p&#229; brukerm&#248;nsteret som er samlet inn anonymt.',
            footer: 'Dersom du &#248;nsker &#229; l&#230;re mer om annonsering basert p&#229; brukerm&#248;nster (Behavioral Advertising), klikk <a href="http://www.youronlinechoices.eu/nor/" target="_blank">her</a>. Her kan du ogs&#229; &quot;stenge&quot; eller &quot;&#229;pne&quot; innsamling fra andre leverand&#248;rer. I tillegg kan du se status p&#229; innsamling av data fra flere ulike leverand&#248;rer.'
        }
    }
    $ADP.Util.log('Loaded Adplayer translation successfully.');
} catch (e) {
    $ADP.Util.log('Failed to add  Aplayer translation: ' + e.message);
}