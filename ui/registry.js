/** Central registry for functions that when called will manipulate a view
 *
 */

export let dbFullRequest = null;
export let dbRequestFromPathElements = null;

export function register_dbFullRequest(f) {
  dbFullRequest = f;
}

export function register_dbRequestFromPathElements(f) {
  dbRequestFromPathElements = f;
}
