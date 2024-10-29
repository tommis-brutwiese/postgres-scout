/** Module for functionality that reacts to user input or modifies the DOM
 *
 * Also expose database browsing functionality
 *
 * Contains and calls subcomponents:
 *
 * * breadcrumbs
 * * one main table for database contents
 *
 */

/* methods */

import { InformStatus, onEnterRun } from "./common_ui.js";
import { callBackend } from "./bridge_frontend_backend.js";
import { updateBreadcrumbs } from "./component_db_breadcrumbs.js";
import { replaceTableContents } from "./component_db_maintable.js";
import {
  toPathItems,
  getConnectionStringFromFullQuery,
} from "./backend_adapter_db.js";
import { createFullQuery, createCustomQuery, createQueryFromPathElements } from "./backend_adapter_db.js";

import {
  register_dbFullRequest,
  register_dbRequestFromPathElements,
} from "./registry.js";

let customSqlQuery;
let customDatabase;

function getCustomSqlQuery() {
  if (!customSqlQuery) {
    customSqlQuery = document.querySelector(".custom-sql .sql-query");
  }
  return customSqlQuery;
}

function getCustomDatabase() {
  if (!customDatabase) {
    customDatabase = document.querySelector(".custom-sql .database");
  }
  return customDatabase;
}


// The only global variable that keeps a value? Perhaps get rid of it?
let globalConnectionString;

export function useConnectionString(connection_string) {
  globalConnectionString = connection_string;
}

function getGlobalConnectionString() {
  return globalConnectionString;
}


/** Will run a query to the database and process results (including DOM manipulation)
 *
 * @param fullQuery containing connection and specific query
 */
export async function dbFullRequest(fullQuery) {
  InformStatus("Running query: " + JSON.stringify(fullQuery));
  callBackend("db_query", { query: fullQuery })
    .then((queryResult) => {
      let tableResult = queryResult.table;
      if (Object.hasOwn(tableResult, "Ok")) {

        getCustomSqlQuery().value = queryResult.sql_query.replace(/\s+/g, " ");
        getCustomSqlQuery().size = getCustomSqlQuery().value.length;
        if (queryResult.database !== null) {
          getCustomDatabase().value = queryResult.database;
        }

        InformStatus("Read " + tableResult.Ok.fields.length + " rows");
        replaceTableContents(tableResult.Ok, fullQuery);
        updateBreadcrumbs(toPathItems(fullQuery)); // just copy the query verbatim as current path
      } else {
        let err =
          "Error: No successful query-results for query '" +
          queryResult.sql_query +
          "'";
        if (queryResult.database !== null) {
          err += " on database '" + queryResult.database + "'";
        }
        InformStatus(err);
      }
    })
    .catch((error) => {
      InformStatus(
        "Error: Call to db_query returned an error: " + JSON.stringify(error),
      );
    });
}

export async function initialQuery(selectComponent) {
  selectComponent("db");
  // Could split into "suggest_query" and "suggest_connection_string"
  let fullQuery = await callBackend("suggest_query", {});
  useConnectionString(getConnectionStringFromFullQuery(fullQuery));
  await dbFullRequest(fullQuery);
}

async function dbRequestFromPathElements(database, table) {
  await dbFullRequest(
    createFullQuery(
      getGlobalConnectionString(),
      createQueryFromPathElements(database, table),
    ),
  );
}

async function runCustomQuery() {
  await dbFullRequest(
    createFullQuery(
      getGlobalConnectionString(),
      createCustomQuery(getCustomDatabase().value, getCustomSqlQuery().value),
    ),
  );
}


export function initEventsForCustomQuery() {
  getCustomSqlQuery().addEventListener("keyup", (event) => {
    onEnterRun(event, runCustomQuery);
  });
  getCustomSqlQuery().addEventListener("input", () => {
    getCustomSqlQuery().size = getCustomSqlQuery().value.length;
  });
  getCustomDatabase().addEventListener("keyup", (event) => {
    onEnterRun(event, runCustomQuery);
  });
}

export function registerDatabaseBrowserFunctions() {
  register_dbFullRequest(dbFullRequest);
  register_dbRequestFromPathElements(dbRequestFromPathElements);
}

