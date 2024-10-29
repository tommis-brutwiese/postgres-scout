/** Common UI functions used by multiple components
 *
 */

export function InformStatus(message) {
  let s = document.querySelector("#statusbar");
  s.textContent = message;
}

export function onEnterRun(event, f) {
  if (event.keyCode === 13) {
    // Prevent the default action
    event.preventDefault();

    f();
  }
}
