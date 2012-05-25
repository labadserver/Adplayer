/**
 * @name $ADP#init
 * @function
 * @description The initializer method for the ADP sub classes 
 */
if (!$ADP.init) {
  $ADP.init = function() {
    $ADP.Registry.init();
  };

  $ADP.init();
}
