/* Hints for Debugging */

// How to invoke a rust function

const { invoke } = window.__TAURI__.tauri;
let query = await invoke("suggest_query", {});
invoke("db_query",{ query: query})
.then((message) => {console.log("Message:" + JSON.stringify(message))})
.catch((error) => {console.log("Error:" + JSON.stringify(error))});
