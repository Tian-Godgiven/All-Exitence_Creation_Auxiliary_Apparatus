use serde::Deserialize;
use std::{fs::File, io::Write};
use zip::{CompressionMethod, ZipWriter, write::SimpleFileOptions};

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct EpubFile {
    path: String,
    content: String,
}

#[tauri::command]
fn write_epub(path: String, files: Vec<EpubFile>) -> Result<(), String> {
    if !path.to_lowercase().ends_with(".epub") {
        return Err("导出文件必须使用 .epub 扩展名。".into());
    }

    let file = File::create(path).map_err(|error| error.to_string())?;
    let mut archive = ZipWriter::new(file);
    let stored = SimpleFileOptions::default().compression_method(CompressionMethod::Stored);
    archive.start_file("mimetype", stored).map_err(|error| error.to_string())?;
    archive.write_all(b"application/epub+zip").map_err(|error| error.to_string())?;

    let compressed = SimpleFileOptions::default().compression_method(CompressionMethod::Deflated);
    for entry in files {
        if entry.path.is_empty() || entry.path.contains("..") || entry.path.contains('\\') || entry.path.starts_with('/') {
            return Err("EPUB 包含无效的内部文件路径。".into());
        }
        archive.start_file(entry.path, compressed.clone()).map_err(|error| error.to_string())?;
        archive.write_all(entry.content.as_bytes()).map_err(|error| error.to_string())?;
    }
    archive.finish().map_err(|error| error.to_string())?;
    Ok(())
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![greet, write_epub])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
