/** Database component: connection TO BackEnd
 *
 * "Backend-Adapter"
 *
 */

export function createQueryFromPathElements(database, table) {
  /*
      Possible values for "query":
  
      "query": "GetDatabases"
      "query": {"GetTables":"mydatabase"}
      "query": {"GetTableContents":{
          "database": "mydatabase"
          "table": "mytable"
      }}
  */

  let query;

  if (table !== null) {
    query = {
      GetTableContents: {
        database: database,
        table: table,
      },
    };
  } else if (database !== null) {
    query = { GetTables: database };
  } else {
    query = "GetDatabases";
  }

  return query;
}

function getTaskFromQuery(fullQuery) {
  let q = fullQuery["query"];
  return Object.keys(q)[0];
}

export function toPathItems(fullQuery) {
  let q = fullQuery["query"];
  let database = null;
  let table = null;

  let task = getTaskFromQuery(fullQuery); // "CustomQuery", "GetDatabases", "GetTables", "GetTableContents"
  let task_info = q[task];
  switch (task) {
    case "CustomQuery":
      database = task_info["database"];
      break;
    case "GetDatabases":
      break;
    case "GetTables":
      database = task_info;
      break;
    case "GetTableContents":
      database = task_info["database"];
      table = task_info["table"];
      break;
    default:
  }
  let pathItems = {
    database: database,
    table: table,
  };

  return pathItems;
}

/* Import-Table-Contents */

export function createFullQuery(connection_string, query) {
  return {
    connection: {
      Stateless: connection_string,
    },
    query: query,
  };
}

export function getConnectionStringFromFullQuery(stateless_query) {
  return stateless_query["connection"]["Stateless"];
}

export function createCustomQuery(database, sqlQuery) {
  return {
    CustomQuery: {
      database: database,
      sql_query: sqlQuery,
    },
  };
}
