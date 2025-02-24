export interface FileNode {
    name: string;
    path: string;
    file_type: "file" | "directory";
    children?: FileNode[];
}