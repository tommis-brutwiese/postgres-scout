/** Breadcrumbs for database browser page
 *
 */

import { dbRequestFromPathElements } from "./registry.js";

let breadcrumbs;

function getBreadcrumbs() {
  if (!breadcrumbs) {
    breadcrumbs = document.querySelector("#breadcrumbs");
  }
  return breadcrumbs;
}

function addTextLiTo(parent, className, textContent, linkFunction) {
  let li = document.createElement("li");

  li.appendChild(document.createTextNode(textContent));

  if (linkFunction !== null) {
    li.addEventListener("click", linkFunction);
  }

  if (className !== null) {
    li.className = className;
  }

  parent.appendChild(li);
}

// Add an element to the breadcrumbs including link
function addBreadcrumbIfGiven(altLinkText, database, table) {
  let lastPathElement;
  if (table) {
    lastPathElement = table;
  } else if (database) {
    lastPathElement = database;
  } else {
    lastPathElement = "(placeholder)";
  }

  if (lastPathElement !== null) {
    addTextLiTo(getBreadcrumbs(), "breadcrumb_separator", ">", null);

    // Choose Text for link
    let linkText;
    if (altLinkText !== null) {
      linkText = altLinkText;
    } else {
      linkText = lastPathElement;
    }

    addTextLiTo(getBreadcrumbs(), "link", linkText, () =>
      dbRequestFromPathElements(database, table),
    );
  }
}

export function updateBreadcrumbs(pathElements) {
  // Breadcrumbs show everything but the main information
  getBreadcrumbs().innerHTML = "";

  let database = pathElements["database"];
  let table = pathElements["table"];

  addBreadcrumbIfGiven("home", null, null);
  if (database) {
    addBreadcrumbIfGiven(null, database, null);
  }
  if (table) {
    addBreadcrumbIfGiven(null, database, table);
  }
}
