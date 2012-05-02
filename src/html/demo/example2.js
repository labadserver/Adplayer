var ran = new Date().getTime();
document.write('<div id="ad-container'+ran+'"');
var adTechAdPlayer2 = new $ADP.AdPlayer('ADTECH-AdServer_MIDDLE', 'ad-container'+ran);
adTechAdPlayer2.addPrivacyInfo('ADTECH-AdServer2', 'Opt out of this campaign', 'http://www.adtech.com/adserver');
adTechAdPlayer2.enableAdChoice();
document.write('<scr'+'ipt language="javascript1.1" src="demo/example3.js?misc='+new Date().getTime()+'"></scri'+'pt>');
document.write('</div>');