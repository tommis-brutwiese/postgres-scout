import { toPathItems } from "./backend_adapter_db.js";
import { dbRequestFromPathElements } from "./registry.js";

let dbTable;

export function getDbTable() {
  if (!dbTable) {
    dbTable = document.querySelector("#db-table table");
  }
  return dbTable;
}

function determineCellFunctionality(cellData, fullQuery) {
  let cellType = Object.keys(cellData)[0];
  let cellText = cellData[cellType];
  let cellClass = cellText;
  let cellFunction = null;

  let pathItems = toPathItems(fullQuery);
  let lastDatabase = pathItems["database"];

  switch (cellType) {
    case "Text":
      {
        cellFunction = null;
      }
      break;
    case "Database":
      {
        cellClass += " link";
        let database = cellText;
        cellFunction = () => {
          dbRequestFromPathElements(database, null);
        };
      }
      break;
    case "Table":
      {
        cellClass += " link";
        let database = lastDatabase;
        let table = cellText;
        cellFunction = () => {
          dbRequestFromPathElements(database, table);
        };
      }
      break;
  }

  return {
    text: cellText,
    cellClass: cellClass,
    cellFunction: cellFunction,
  };
}

function amendCell(domCell, text, cls, f) {
  domCell.innerHTML = text;
  if (cls !== null) {
    domCell.className = cls;
  }
  if (f !== null) {
    domCell.addEventListener("click", f);
  }
}

function insertCellData(domCell, cellInfo) {
  amendCell(
    domCell,
    cellInfo["text"],
    cellInfo["cellClass"],
    cellInfo["cellFunction"],
  );
}

export function replaceTableContents(table, lastQuery) {
  if (table) {
    // Clear old table contents
    let num_rows = getDbTable().rows.length;

    for (let i = 0; i < num_rows; i++) {
      getDbTable().deleteRow(-1);
    }

    // Insert table header
    let tr = getDbTable().insertRow();
    table.columns.forEach((column_name) => {
      let th = tr.appendChild(document.createElement("th"));
      amendCell(th, column_name, null, null);
    });

    // Insert table contents
    table.fields.forEach(function (row) {
      let tr = getDbTable().insertRow();

      row.forEach(function (cellData) {
        let cellInfo = determineCellFunctionality(cellData, lastQuery);
        // regular row
        var cell = tr.insertCell();
        insertCellData(cell, cellInfo);
      });
    });
  }
}
