/**
 * @name $ADP#getVersion
 * @function
 * @description Returns a map indicating the current version of the AdPlayer.
 *              This method should also be used for internal backwards compatibility.
 *
 * @returns A map of version information.
 *
 * @example
 * var version = $ADP.getVersion();
 * console.log('Major: ' + version.major);
 * console.log('Minor: ' + version.minor);
 * console.log('Patch: ' + version.patch);
 * console.log('Stage: ' + version.stage);
 * 
 * // Major: _@VERSION_MAJOR@_
 * // Minor: _@VERSION_MINOR@_
 * // Patch: _@VERSION_PATCH@_
 * // Stage: _@VERSION_STAGE@_
 */
$ADP.getVersion = $ADP.getVersion || function() {
  return {
    major: _@VERSION_MAJOR@_,
    minor: _@VERSION_MINOR@_,
    patch: _@VERSION_PATCH@_,
    stage: '_@VERSION_STAGE@_'
  };
};

