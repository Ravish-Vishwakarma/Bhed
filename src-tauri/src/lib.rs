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
#[derive(Serialize, Debug)]
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

use chrono::{Datelike, Local, NaiveTime, Timelike, Weekday};
use serde_json;
use std::thread;
use std::time::Duration;

// ----------- HELPERS -----------

fn parse_days(day_str: &str) -> Vec<String> {
    serde_json::from_str(day_str).unwrap_or_default()
}

fn next_day_offset(task_days: &[String], today: Weekday) -> i64 {
    let week = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
    let today_idx = today.num_days_from_monday() as usize;

    for i in 0..7 {
        let check_day = week[(today_idx + i) % 7];
        if task_days.contains(&check_day.to_string()) {
            return i as i64;
        }
    }

    7 // fallback (should not happen)
}

fn total_wait_seconds(task: &Task) -> i64 {
    let now = Local::now();
    let now_time = now.time();
    let now_sec = now_time.num_seconds_from_midnight() as i64;

    let task_time = NaiveTime::parse_from_str(&task.time, "%H:%M:%S")
        .unwrap_or(NaiveTime::from_hms_opt(0, 0, 0).unwrap());

    let task_sec = task_time.num_seconds_from_midnight() as i64;

    let task_days = parse_days(&task.day);
    let today = now.weekday();

    let day_offset = next_day_offset(&task_days, today);

    let mut seconds = day_offset * 86400 + (task_sec - now_sec);

    // if time already passed today → push to next valid day
    if seconds < 0 {
        seconds += 86400;
    }

    seconds
}

// ----------- FILTER -----------

fn filter_tasks() -> Result<Vec<Task>, String> {
    let mut tasks = read_task()?;

    tasks.sort_by_key(|task| total_wait_seconds(task));

    Ok(tasks)
}

// ----------- BACKGROUND LOOP -----------

fn start_background_loop() {
    thread::spawn(move || {
        loop {
            let tasks = match filter_tasks() {
                Ok(t) => t,
                Err(e) => {
                    println!("Error: {}", e);
                    thread::sleep(Duration::from_secs(5));
                    continue;
                }
            };

            if tasks.is_empty() {
                println!("No tasks found");
                thread::sleep(Duration::from_secs(5));
                continue;
            }

            let next_task = &tasks[0];

            let wait_sec = total_wait_seconds(next_task);

            println!("Next task: {}", next_task.name);
            println!("Runs in {} seconds", wait_sec);

            thread::sleep(Duration::from_secs(wait_sec as u64));

            println!("Running task: {}", next_task.name);
            execute_task(next_task);
            thread::sleep(Duration::from_secs(1));
            // TODO: your execution logic here
        }
    });
}

use std::process::Command;

#[cfg(target_os = "windows")]
use std::os::windows::process::CommandExt;

#[cfg(target_os = "windows")]
const CREATE_NO_WINDOW: u32 = 0x08000000;

fn run_powershell(command: &str) {
    let mut cmd = Command::new("powershell");

    cmd.arg("-Command").arg(command);

    #[cfg(target_os = "windows")]
    cmd.creation_flags(CREATE_NO_WINDOW);

    match cmd.spawn() {
        Ok(_) => println!("PowerShell command executed"),
        Err(e) => println!("Error running command: {}", e),
    }
}

fn run_executable(path: &str) {
    let lower = path.to_lowercase();

    let mut cmd = if lower.ends_with(".bat") || lower.ends_with(".cmd") {
        let mut c = Command::new("cmd");
        c.arg("/C").arg(path);
        c
    } else if lower.ends_with(".ps1") {
        let mut c = Command::new("powershell");
        c.arg("-File").arg(path);
        c
    } else if lower.ends_with(".msi") {
        let mut c = Command::new("msiexec");
        c.arg("/i").arg(path);
        c
    } else {
        // default: exe or similar
        Command::new(path)
    };

    #[cfg(target_os = "windows")]
    cmd.creation_flags(CREATE_NO_WINDOW);

    match cmd.spawn() {
        Ok(_) => println!("Started: {}", path),
        Err(e) => println!("Error running {}: {}", path, e),
    }
}

fn execute_task(task: &Task) {
    match task.kind.as_str() {
        "command" => run_powershell(&task.content),
        "executable" => run_executable(&task.content),
        _ => println!("Unknown task kind: {}", task.kind),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    init_db().expect("Failed to init DB");

    tauri::Builder::default()
        .setup(|app| {
            start_background_loop();
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
