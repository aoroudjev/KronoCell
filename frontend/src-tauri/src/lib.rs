mod commands;

use tauri_plugin_dialog;
use tauri_plugin_fs;
use commands::parse_directory;
use commands::load_image_file;


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())// Initialize plugin
        .invoke_handler(tauri::generate_handler![parse_directory, load_image_file]) // Register commands
        .run(tauri::generate_context!())
        .expect("error while running Tauri application");
}
