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

const INDENT_SIZE = 20; // Base indent size

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
            <div style={{marginLeft: `${indent * INDENT_SIZE}px`}}>
                <div
                    className={`fileTree-item ${node.type} ${selectedFile === node ? "selected" : ""}`}
                    onClick={node.type === "directory" ? toggleExpanded : handleFileClick}
                    data-fullname={node.name}
                >
                    <span className="file-name">
                        {node.type === "directory" ? (expanded ? <AiOutlineFolderOpen/> : <AiOutlineFolder/>) :
                            <AiOutlineFile/>}
                        {node.name}
                    </span>
                </div>
            </div>

            {/* Children */}
            <div className={`file-children expanded ${expanded ? "expanded" : "collapsed"}`}>
                {node.children?.map((child: FileNode, index) => (
                    <FileTree
                        key={`${child.name}-${index}`}
                        node={child}
                        indent={indent + 1}
                        selectedFile={selectedFile}
                        setSelectedFile={setSelectedFile}
                    />
                ))}
            </div>
        </div>
    );
};

export default FileTree;
