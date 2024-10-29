/** Connectivity check for database
 *
 * Contains both backend calls and DOM manipulation.
 *
 */

import { callBackend } from "./bridge_frontend_backend.js";
import { onEnterRun } from "./common_ui.js";
import { useConnectionString } from "./component_db_browser.js"; /* should be part of browsers interface */
import { dbFullRequest } from "./registry.js";
import { selectComponent } from "./navigation.js";

import {
  createQueryFromPathElements,
  createFullQuery,
} from "./backend_adapter_db.js";

/* connection configuration and test */

export async function initEventsForConnectionConfig() {
  let suggested_query = await callBackend("suggest_query", {});
  let connection_string = suggested_query["connection"]["Stateless"];

  let elem_con_string = document.querySelector(".connection-string");
  let elem_con_test = document.querySelector(".connection-test");
  let elem_con_test_result = document.querySelector(".connection-result");
  let elem_con_select = document.querySelector(".connection-select");
  let elem_con_select_confirm = document.querySelector(
    ".connection-select-confirm",
  );

  const mark_okay = "&check; (okay)";
  const mark_fail = "&cross; (fail)";

  let resetConcheck = () => {
    elem_con_test_result.innerHTML = "";
    elem_con_select_confirm.innerHTML = "";
  };

  let run_concheck = () => {
    resetConcheck();
    callBackend("test_connection_string", {
      connectionString: elem_con_string.value,
    })
      .then((bool_result) => {
        if (bool_result) {
          elem_con_test_result.innerHTML = mark_okay;
        } else {
          elem_con_test_result.innerHTML = mark_fail;
        }
      })
      .catch((/* error */) => {
        elem_con_test_result.innerHTML = "error running test";
      });
  };

  elem_con_string.value = connection_string;

  // Pressing enter will run connection check
  elem_con_string.addEventListener("keyup", (event) => {
    onEnterRun(event, run_concheck);
  });

  // Change to input will result in resetting
  elem_con_string.addEventListener("input", () => {
    resetConcheck();
  });

  // Click on "check" will run connection check
  elem_con_test.addEventListener("click", () => {
    run_concheck();
  });

  // Click on "select" will use connection string for other requests
  //
  // See also: initialQuery()
  //
  // Please note and regret the inconsistent use of where
  // the connection string is stored (inside query / global
  // string).
  //
  elem_con_select.addEventListener("click", () => {
    elem_con_select_confirm.innerHTML = "";

    useConnectionString(elem_con_string.value);

    dbFullRequest(
      createFullQuery(
        elem_con_string.value,
        createQueryFromPathElements(null, null),
      ),
    )
      .then(() => {
        elem_con_select_confirm.innerHTML = mark_okay;
        selectComponent("db");
      })
      .catch(() => {
        elem_con_select_confirm.innerHTML = mark_fail;
      });
  });
}
