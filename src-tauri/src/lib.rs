// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

use rusqlite::{Connection, Result};
use tauri::{
    menu::{Menu, MenuItem},
    tray::{MouseButton, TrayIconBuilder, TrayIconEvent},
    Manager,
};

fn init_db() -> Result<()> {
    let conn = Connection::open("bhed.db")?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            time TEXT NOT NULL,
            kind TEXT NOT NULL,
            content TEXT NOT NULL,
            day TEXT NOT NULL
        )",
        [],
    )?;

    Ok(())
}

#[tauri::command]
fn add_task(
    name: String,
    time: String,
    kind: String,
    content: String,
    day: String,
) -> Result<(), String> {
    let conn = Connection::open("bhed.db").map_err(|e| e.to_string())?;

    conn.execute(
        "INSERT INTO tasks (name, time, kind, content, day) VALUES (?1,?2,?3,?4,?5)",
        rusqlite::params![name, time, kind, content, day],
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}

use serde::Serialize;

#[derive(Serialize)]
struct Task {
    id: i32,
    name: String,
    time: String,
    kind: String,
    content: String,
    day: String,
}

#[tauri::command]
fn read_task() -> Result<Vec<Task>, String> {
    let conn = Connection::open("bhed.db").map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare("SELECT id, name, time, kind, content, day FROM tasks")
        .map_err(|e| e.to_string())?;

    let rows = stmt
        .query_map([], |row| {
            Ok(Task {
                id: row.get(0)?,
                name: row.get(1)?,
                time: row.get(2)?,
                kind: row.get(3)?,
                content: row.get(4)?,
                day: row.get(5)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let mut result = Vec::new();

    for row in rows {
        result.push(row.map_err(|e| e.to_string())?);
    }

    Ok(result)
}

#[tauri::command]
fn delete_task(id: i32) -> Result<(), String> {
    let conn = Connection::open("bhed.db").map_err(|e| e.to_string())?;

    conn.execute("DELETE FROM tasks WHERE id=?1", rusqlite::params![id])
        .map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
fn update_task(
    id: i32,
    name: String,
    time: String,
    kind: String,
    content: String,
    day: String,
) -> Result<(), String> {
    let conn = Connection::open("bhed.db").map_err(|e| e.to_string())?;

    conn.execute(
        "UPDATE tasks SET name = ?1, time = ?2, kind = ?3, content = ?4, day=?5 WHERE id = ?6",
        rusqlite::params![name, time, kind, content, day, id],
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    init_db().expect("Failed to init DB");

    tauri::Builder::default()
        .setup(|app| {
            let quit = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
            let show = MenuItem::with_id(app, "show", "Show", true, None::<&str>)?;

            let menu = Menu::with_items(app, &[&show, &quit])?;

            let _tray = TrayIconBuilder::new()
                .menu(&menu)
                .on_menu_event(|app, event| match event.id.as_ref() {
                    "quit" => {
                        app.exit(0);
                    }
                    "show" => {
                        let window = app.get_webview_window("main").unwrap();
                        window.show().unwrap();
                        window.set_focus().unwrap();
                    }
                    _ => {}
                })
                .build(app)?;

            Ok(())
        })
        .on_tray_icon_event(|tray, event| {
            if let TrayIconEvent::Click { button, .. } = event {
                if button == MouseButton::Left {
                    let app = tray.app_handle();
                    let window = app.get_webview_window("main").unwrap();

                    if window.is_visible().unwrap() {
                        window.hide().unwrap();
                    } else {
                        window.show().unwrap();
                    }
                }
            }
        })
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            add_task,
            read_task,
            delete_task,
            update_task
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
