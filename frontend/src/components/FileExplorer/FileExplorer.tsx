import React, {useState} from "react";

import FileUpload from "./FileUpload.tsx";
import {FileNode} from "./FileNode.ts";
import FileTree from "./FileTree.tsx";
import "./FileExplorer.css";

import parseDirectory from "../../utils/parseDirectory.ts";
import {readFile} from "@tauri-apps/plugin-fs";

interface FileExplorerProps {
    setSelectedFileContent: (content: Uint8Array | null) => void; // Function to pass file content to App
}

const FileExplorer: React.FC<FileExplorerProps> = ({setSelectedFileContent}) => {
    const [fileTree, setFileTree] = useState<FileNode | null>(null);
    const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);

    const handleDirectoryUpload = async (directory: string) => {
        const tree = await parseDirectory(directory);
        setFileTree(tree);
    };

    const handleFileSelect = async (fileNode: FileNode) => {
        if (fileNode.type === "file") {
            const content = await readFile(fileNode.name) // Extract on demand
            setSelectedFileContent(content);
            setSelectedFile(fileNode);
        }
    };

    return (
        <div className="file-explorer">
            <h2>File Explorer</h2>
            <FileUpload onUpload={handleDirectoryUpload}/>
            <div className="file-tree">
                {fileTree && <FileTree node={fileTree} selectedFile={selectedFile} setSelectedFile={handleFileSelect}/>}
            </div>
        </div>
    );
};

export default FileExplorer;