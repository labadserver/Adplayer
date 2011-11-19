
-------------------------------------------------------------------------------------------
AdPlayer v0.5.6 (dev.111811)
Author: christopher.sancho@adtech.com, felix.ritter@adtech.com
-------------------------------------------------------------------------------------------

This file is part of AdPlayer v0.5.0.dev.100511.
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


Note: The test page (index.html) currently uses static ADTECH test tags.


------------------------------------------------------------------------------------------
Importing AdPlayer Project into Eclipse
------------------------------------------------------------------------------------------

1) File > Import > General > Existing Projects into Workspace
2) Check "Select root directory"
2) Click Browse and select the GIT repository, which should already be cloned to the system.
3) Ensure the directory is selected under the "Projects" section.
4) Click "Finish"
5) Project should be imported to current workspace

------------------------------------------------------------------------------------------
Building AdPlayer Project
------------------------------------------------------------------------------------------
1) Right click "build.xml" > Run As > Ant Build
2) A new "bin" directory will be created containing the Ant build output.
3) Note: Eclipse may require you to refresh the project folder's view.
	This can be done easily by right clicking the project folder and clicking "Refresh."
	
	
------------------------------------------------------------------------------------------
Testing
------------------------------------------------------------------------------------------
1) Open the generated index.html file from the bin directory in your favorite browser	
	Note: the index.html file in the root folder can't be used for testing directly, use
	the one in the bin folder instead!
	