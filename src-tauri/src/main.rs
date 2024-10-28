// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod db;
mod util;

fn run_tauri_gui() -> Result<(), tauri::Error> {
    tauri::async_runtime::set(tokio::runtime::Handle::current());
    let res = tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            util::commands::get_autoclose_after_init
        ])
        .run(tauri::generate_context!());
    res
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error + Send>> {
    let res = if util::get_run_gui() {
        util::log_info("main", "starting gui");
        run_tauri_gui()
    } else {
        util::log_info("main", "skip starting gui");
        Ok(())
    };

    match res {
        Ok(_) => Ok(()),
        Err(_) => Ok((/* for now */)),
    }
}
