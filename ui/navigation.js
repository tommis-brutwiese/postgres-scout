// Functionality for selecting components in the navigation pane

let unselectComponents = () => {
  document
    .querySelectorAll(".component")
    .forEach((node) => node.classList.add("hidden"));
  document
    .querySelectorAll(".nav")
    .forEach((node) => node.classList.remove("nav-selected"));
};

export function selectComponent(componentName) {
  unselectComponents();

  let component = document.querySelector(".component." + componentName);
  component.classList.remove("hidden");

  let nav = document.querySelector(".nav." + componentName);
  nav.classList.add("nav-selected");
}

let initComponentNavigation = (componentName) => {
  document
    .querySelector(".nav." + componentName)
    .addEventListener("click", () => {
      selectComponent(componentName);
    });
};

export function initNavigation(component_names) {
  unselectComponents();

  // Note the following could be done automatically, by looking at classes
  // attached to DOM.
  component_names.forEach((component) => {
    initComponentNavigation(component);
  });
}
