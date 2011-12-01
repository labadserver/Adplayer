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


------------------------------------------------------------------------------------------
Additional Info
------------------------------------------------------------------------------------------
Additional info:  https://github.com/labadserver/
Latest version of AdPlayer: https://github.com/labadserver/Adplayer/downloads