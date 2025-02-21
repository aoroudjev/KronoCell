export interface FileNode {
    name: string;
    file_type: "file" | "directory";
    children?: FileNode[];
}