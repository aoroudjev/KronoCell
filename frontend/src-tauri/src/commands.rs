use std::fs;
use std::path::Path;
use tauri::command;
use mime_guess::from_path;
use base64::Engine;

#[derive(serde::Serialize)]
pub struct FileNode {
    pub path: String,
    pub name: String,
    pub file_type: String,
    pub children: Option<Vec<FileNode>>,
}

#[command]
pub fn parse_directory(directory_path: String) -> FileNode {
    let path = Path::new(&directory_path);
    let name = path
        .file_name()
        .map(|s| s.to_string_lossy().to_string())
        .unwrap_or_else(|| directory_path.clone());

    let mut node = FileNode {
        path: path.to_string_lossy().to_string(),
        name,
        file_type: if path.is_dir() {
            "directory".to_string()
        } else {
            "file".to_string()
        },
        children: if path.is_dir() { Some(vec![]) } else { None },
    };

    if path.is_dir() {
        match fs::read_dir(path) {
            Ok(entries) => {
                for entry in entries {
                    match entry {
                        Ok(entry) => {
                            let entry_path = entry.path();
                            if entry_path.is_dir() {
                                // Recursively parse directories.
                                node.children
                                    .as_mut()
                                    .unwrap()
                                    .push(parse_directory(entry_path.to_string_lossy().to_string()));
                            } else if let Some(ext) = entry_path.extension().and_then(|e| e.to_str()) {
                                let ext_lower = ext.to_lowercase();
                                if ext_lower == "jpeg"
                                    || ext_lower == "jpg"
                                    || ext_lower == "png"
                                    || ext_lower == "tiff"
                                {
                                    node.children.as_mut().unwrap().push(FileNode {
                                        path: entry_path.to_string_lossy().to_string(),
                                        name: entry
                                            .file_name()
                                            .to_string_lossy()
                                            .to_string(),
                                        file_type: "file".to_string(),
                                        children: None,
                                    });
                                }
                            }
                        }
                        Err(e) => eprintln!("Error reading an entry: {}", e),
                    }
                }
            }
            Err(e) => eprintln!("Error reading directory {}: {}", directory_path, e),
        }
    }

    node
}

#[command]
pub fn load_image_file(file_path: String) -> Result<(String, String), String> {
    // Read the file bytes
    match fs::read(&file_path) {
        Ok(data) => {
            // Base64 encode the data
            let encoded = base64::engine::general_purpose::STANDARD.encode(&data);
            // Guess the MIME type based on the file extension
            let mime_type = from_path(&file_path)
                .first_or_octet_stream()
                .essence_str()
                .to_string();
            Ok((encoded, mime_type))
        }
        Err(err) => Err(err.to_string()),
    }
}