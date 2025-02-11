import React, {useState} from "react";
import "./FileExplorer.css";
import {AiOutlineFile, AiOutlineFolder, AiOutlineFolderOpen} from "react-icons/ai";


interface FileNode {
    name: string;
    type: "file" | "directory";
    children?: FileNode[];
}

interface FileTreeProps {
    node: FileNode;
    indent?: number;
    selectedFile: FileNode | null;
    setSelectedFile: (fileName: FileNode) => void;
}

const FileTree: React.FC<FileTreeProps> = ({node, selectedFile, setSelectedFile, indent = 0}) => {
    const [expanded, setExpanded] = useState<boolean>(false);

    const toggleExpanded = () => {
        if (node.type === "directory") {
            setExpanded(!expanded);
        }
    };

    const handleFileClick = () => {
        if (node.type === "file") {
            setSelectedFile(node);
        }
    };

    return (
        <div>
            {/* Display logic for nodes */}
            <div
                className={`fileTree-item ${node.type} ${selectedFile === node ? "selected" : ""}`}
                onClick={node.type === "directory" ? toggleExpanded : handleFileClick}
                data-fullname={node.name}
            >
                <span className="file-name">
                    {node.type === "directory" ? (expanded ? <AiOutlineFolderOpen /> : <AiOutlineFolder />) : <AiOutlineFile />}
                    {node.name}
                </span>
            </div>

            {/* Children */}
            {expanded && (
                <div className={`file-children ${expanded ? "expanded" : "collapsed"}`}>
                    {node.children?.map((child: FileNode, index) => (
                        <FileTree
                            key={`${child.name}-${index}`}
                            node={child}
                            indent={indent + 1} // Increase indent for child nodes
                            selectedFile={selectedFile}
                            setSelectedFile={setSelectedFile}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default FileTree;

