/**
 * Main - just initialize and bind together stuff
 */

/* For debugging hints : see hints.js */

const { invoke } = window.__TAURI__.core;
const { exit } = window.__TAURI__.process;

import { initNavigation, selectComponent } from "./navigation.js";
import {
  initialQuery,
  initEventsForCustomQuery,
  registerDatabaseBrowserFunctions,
} from "./component_db_browser.js";

registerDatabaseBrowserFunctions();

import { initEventsForConnectionConfig } from "./component_db_concheck.js";

async function dbInitEvents() {
  await initEventsForConnectionConfig();
  await initEventsForCustomQuery();
}

function initEventFunctions() {
  dbInitEvents();
}

async function onEndInit() {
  // Is the programmed configured to close after init has completed?
  //
  // Note: used for testing purposes
  //

  let autoclose = await invoke("get_autoclose_after_init", {});
  if (autoclose) {
    setTimeout(() => {
      /**
       * Note the following is not a clean shutdown.
       * A better option might be to shut down cleanly from backend.
       */
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
  initEventFunctions();

  initialQuery(selectComponent);

  onEndInit();
  selectComponent("db");

  indicateJsOkay();
});
