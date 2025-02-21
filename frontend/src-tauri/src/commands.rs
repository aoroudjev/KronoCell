use std::fs;
use std::path::Path;
use tauri::command;

#[derive(serde::Serialize)]
pub struct FileNode {
    pub name: String,
    pub file_type: String,
    pub children: Option<Vec<FileNode>>,
}

#[command]
pub fn parse_directory(directory_path: String) -> FileNode {
    let path = Path::new(&directory_path);

    let mut root = FileNode {
        name: path.file_name()
            .unwrap_or_else(|| path.as_os_str())
            .to_string_lossy()
            .to_string(),
        file_type: "directory".to_string(),
        children: Some(vec![]),
    };

    if let Ok(entries) = fs::read_dir(path) {
        for entry in entries.flatten() {
            let entry_path = entry.path();
            let is_file = entry_path.is_file();

            let node = FileNode {
                name: entry.file_name().to_string_lossy().to_string(),
                file_type: if is_file { "file".to_string() } else { "directory".to_string() },
                children: if is_file { None } else { Some(vec![]) },
            };

            root.children.as_mut().unwrap().push(node);

//             if !is_file || entry_path.extension().map(|ext| ext == "jpeg" || ext == "jpg" || ext == "png" || ext == "tiff").unwrap_or(false) {
//                 root.children.as_mut().unwrap().push(node);
//             }
        }
    }

    root
}