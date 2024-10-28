/**
 * Main - just initialize and bind together stuff
 */

/* For debugging hints : see hints.js */

const { invoke } = window.__TAURI__.tauri;
const { exit } = window.__TAURI__.process;


import { initNavigation, selectComponent } from "./navigation.js";

async function onEndInit() {
  // Is the programmed configured to close after init has completed?
  //
  // Note: used for testing purposes
  //

  let autoclose = await invoke("get_autoclose_after_init", {});
  if (autoclose) {
    setTimeout(() => {
      exit(0);
    }, 500);
  }
}

function indicateJsOkay() {
  for (const element of document.getElementsByClassName("js-error")) {
    element.classList.add("hidden");
  }
  for (const element of document.getElementsByClassName("js-okay")) {
    element.classList.remove("hidden");
  }
}

window.addEventListener("DOMContentLoaded", () => {
  initNavigation(["db", "connectors", "about"]);

  onEndInit();
  selectComponent("about");

  indicateJsOkay();
});
