// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

// use rusqlite::{Connection, Result};
// fn init_db() -> Result<()> {
//     let conn = Connection::open("bhed.db")?;

//     conn.execute(
//         "CREATE TABLE IF NOT EXISTS tasks (
//             id INTEGER PRIMARY KEY,
//             name TEXT NOT NULL,
//             time TEXT NOT NULL,
//             type TEXT NOT NULL,
//             content TEXT NOT NULL
//         )",
//         [],
//     )?;

//     Ok(())
// }

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
