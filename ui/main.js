/**
 * Main - just initialize and bind together stuff
 */

function indicateJsOkay() {
  for (const element of document.getElementsByClassName("js-error")) {
    element.classList.add("hidden");
  }
  for (const element of document.getElementsByClassName("js-okay")) {
    element.classList.remove("hidden");
  }
}

window.addEventListener("DOMContentLoaded", () => {
  indicateJsOkay();
});
