import { useState } from "react";
import FileUpload from "./FileUpload.tsx";
import parseZip from "../../utils/parseZip.ts";
import FileTree from "./FileTree.tsx";
import "./FileExplorer.css";

interface FileNode {
    name: string;
    type: "file" | "directory";
    children?: FileNode[];
}

interface FileExplorerProps {
    setSelectedFileContent: (content: string | null) => void; // Function to pass file content to App
}

const FileExplorer: React.FC<FileExplorerProps>= ({ setSelectedFileContent }) => {
    const [fileTree, setFileTree] = useState<FileNode | null>(null);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);

    const handleZipUpload = async (file: File) => {
        const tree = await parseZip(file);
        setFileTree(tree);
    };

    const handleFileSelect = async (fileNode: FileNode) => {
        if (fileNode.type === "file") {
            const fileContent = await readFileContent(fileNode.name);
            setSelectedFileContent(fileContent);
            setSelectedFile(fileNode.name);
        }
    };

    const readFileContent = async (fileName: string): Promise<string> => {
        return `Simulated content of ${fileName}`; // Replace this with actual file reading logic
    };

    return (
        <div className="file-explorer">
            <h2>File Explorer</h2>
            <FileUpload onUpload={handleZipUpload} />
            <div className="file-list">
                {fileTree && <FileTree node={fileTree} selectedFile={selectedFile} setSelectedFile={handleFileSelect} />}
            </div>
        </div>
    );
};

export default FileExplorer;