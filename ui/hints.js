/* Hints for Debugging */

// How to invoke a rust function

const { invoke } = window.__TAURI__.core;
let query = await invoke("suggest_query", {});
invoke("db_query", { query: query })
  .then((message) => {
    console.log("Message:" + JSON.stringify(message));
  })
  .catch((error) => {
    console.log("Error:" + JSON.stringify(error));
  });

/* Query Types */

// Query: backend request to database as defined by rust backend
//        Examples: GetDatabases, GetTables, CustomQuery
//
//        For instance:
//
//        {
//          CustomQuery: {
//            database: database,
//            sql_query: sqlQuery
//          }
//        }
//
//        or
//
//        "GetDatabases"
//
//        or
//
//        { "GetTables" : "mydatabase" }
//
// Path: [Database], [Path]
//        Query can be created from this
//
// Connection: determines which database to connect to
//        Currently is simply a string,
//        contains (host, port, user, password)
//
//       {
//         Stateless: connection_string
//       }
//
// FullQuery: Query + Connection
//
//       {
//         "connection": <some connection>,
//         "query": <query>
//       }
//
// Definitive: db.rs
