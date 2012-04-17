/*
   -------------------------------------------------------------------------------------------
   AdPlayer v0.8.0 (dev.041712)
   Author: christopher.sancho@adtech.com, felix.ritter@adtech.com
   -------------------------------------------------------------------------------------------
  
   This file is part of AdPlayer v0.8.0 (dev.041712).
   AdPlayer is free software: you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation, either version 3 of the License, or
   (at your option) any later version.
 
   AdPlayer is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.
 
   You should have received a copy of the GNU General Public License
   along with AdPlayer.  If not, see <http://www.gnu.org/licenses/>.
  
  --------------------------------------------------------------------------------------------
*/
var ran = new Date().getTime();
document.write('<div id="ad-container'+ran+'">');
var adTechAdPlayer = new AdPlayer('ADTECH-AdServer_OUTER', 'ad-container'+ran);
adTechAdPlayer.addPrivacyInfo('ADTECH-AdServer_OUTER', 'Opt out of this campaign', 'http://www.adtech.com/adserver');
adTechAdPlayer.addEventListener($ADP.AdEvent.INIT, adtechPlayerInit);
adTechAdPlayer.addEventListener($ADP.AdEvent.PRIVACY_OPEN, adtechPlayerPrivacyOpen);
adTechAdPlayer.addEventListener($ADP.AdEvent.PRIVACY_CLOSE, adtechPlayerPrivacyClose);
adTechAdPlayer.addEventListener($ADP.AdEvent.PRIVACY_CLICK, adtechPlayerInfoClick);        
document.write('<scr'+'ipt language="javascript1.1" src="http://adserver.adtechus.com/addyn/3.0/5071/2132472/0/170/ADTECH;loc=100;target=_blank;key=key1+key2+key3+key4;grp=[group];misc='+new Date().getTime()+'"></scri'+'pt>');
document.write('<scr'+'ipt language="javascript1.1" src="demo/example2.js?misc='+new Date().getTime()+'"></scri'+'pt>');
document.write('</div>');