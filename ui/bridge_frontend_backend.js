const { invoke } = window.__TAURI__.tauri;

/** Call to backend
 *
 * Currently the backend is a tauri-backend. In future, it may
 * something such as a webserver.
 *
 * @param {string} name - The name of the function to be called
 * @param {Object} params - The parameters to
 */
export async function callBackend(name, params) {
  return invoke(name, params);
}
