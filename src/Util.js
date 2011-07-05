/** 
 * @description Logs a message through the console; if available.
 * @param {string} msg The message to log.
 * @param {string} ref Optional - An identifer used to reference the source of a message.
 * 
 * @example
 * // "AdPlayer(God): This is a log output."
 * log('This is a log output', 'God');
 */
log = function(msg, ref) {
  if(typeof(console) !== 'undefined' && console != null) {
    if (ref) {
      console.log('AdPlayer(' + ref + '): ' + msg);
    } else {
      console.log('AdPlayer: ' + msg);
    }
	}
};