// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tokio::sync::mpsc;

mod db;
mod util;

fn run_tauri_gui(
    channel_to_db_tx: mpsc::Sender<db::types::FullQuery>,
    channel_to_tauri_rx: mpsc::Receiver<db::types::DatabaseQueryResult>,
) -> Result<(), tauri::Error> {
    tauri::async_runtime::set(tokio::runtime::Handle::current());
    let res = tauri::Builder::default()
        .manage(db::types::StateHalfpipeToDb::from(channel_to_db_tx))
        .manage(db::types::StateHalfpipeToTauri::from(channel_to_tauri_rx))
        .invoke_handler(tauri::generate_handler![
            db::commands::db_query,
            db::commands::suggest_query,
            db::commands::test_connection_string,
            util::commands::get_autoclose_after_init
        ])
        .run(tauri::generate_context!());
    res
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error + Send>> {
    let (channel_to_tauri_tx, channel_to_tauri_rx) =
        mpsc::channel::<db::types::DatabaseQueryResult>(1);
    let (channel_to_db_tx, channel_to_db_rx) = mpsc::channel::<db::types::FullQuery>(1);

    tokio::spawn(db::db_task(channel_to_db_rx, channel_to_tauri_tx));

    let res = if util::get_run_gui() {
        util::log_info("main", "starting gui");
        run_tauri_gui(channel_to_db_tx, channel_to_tauri_rx)
    } else {
        util::log_info("main", "skip starting gui");
        Ok(())
    };

    match res {
        Ok(_) => Ok(()),
        Err(_) => Ok((/* for now */)),
    }
}
