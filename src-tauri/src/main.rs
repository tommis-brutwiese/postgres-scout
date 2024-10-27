// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn run_tauri_gui() -> Result<(), tauri::Error> {
    tauri::async_runtime::set(tokio::runtime::Handle::current());
    let res = tauri::Builder::default().run(tauri::generate_context!());
    res
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error + Send>> {
    let res = run_tauri_gui();

    match res {
        Ok(_) => Ok(()),
        Err(_) => Ok((/* for now */)),
    }
}
