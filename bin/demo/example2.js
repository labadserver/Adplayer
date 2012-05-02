/*
   -------------------------------------------------------------------------------------------
   AdPlayer v0.8.3 (dev.042012)
   Author: christopher.sancho@adtech.com, felix.ritter@adtech.com
   -------------------------------------------------------------------------------------------
  
   This file is part of AdPlayer v0.8.3 (dev.042012).
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
document.write('<div id="ad-container'+ran+'"');
var adTechAdPlayer2 = new $ADP.AdPlayer('ADTECH-AdServer_MIDDLE', 'ad-container'+ran);
adTechAdPlayer2.addPrivacyInfo('ADTECH-AdServer2', 'Opt out of this campaign', 'http://www.adtech.com/adserver');
adTechAdPlayer2.enableAdChoice();
document.write('<scr'+'ipt language="javascript1.1" src="demo/example3.js?misc='+new Date().getTime()+'"></scri'+'pt>');
document.write('</div>');