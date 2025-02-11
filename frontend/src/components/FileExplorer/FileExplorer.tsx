import React, { useState } from "react";
import FileUpload from "./FileUpload.tsx";
import parseZip from "../../utils/parseZip.ts";
import FileTree from "./FileTree.tsx";
import "./FileExplorer.css";
import JSZip from "jszip";

interface FileNode {
    name: string;
    type: "file" | "directory";
    zipEntry?: JSZip.JSZipObject;
    children?: FileNode[];
}

interface FileExplorerProps {
    setSelectedFileContent: (content: string | null) => void; // Function to pass file content to App
}

const FileExplorer: React.FC<FileExplorerProps>= ({ setSelectedFileContent }) => {
    const [fileTree, setFileTree] = useState<FileNode | null>(null);
    const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);

    const handleZipUpload = async (file: File) => {
        const tree = await parseZip(file);
        setFileTree(tree);
    };

    const handleFileSelect = async (fileNode: FileNode) => {
        if (fileNode.type === "file" && fileNode.zipEntry) {
            const blob = await fileNode.zipEntry.async("blob"); // Extract on demand
            const blobURL = URL.createObjectURL(blob);
            setSelectedFileContent(blobURL);
            setSelectedFile(fileNode);
        }
    };

    return (
        <div className="file-explorer">
            <h2>File Explorer</h2>
            <FileUpload onUpload={handleZipUpload} />
            <div className="file-tree">
                {fileTree && <FileTree node={fileTree} selectedFile={selectedFile} setSelectedFile={handleFileSelect} />}
            </div>
        </div>
    );
};

export default FileExplorer;