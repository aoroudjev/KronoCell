import {invoke} from '@tauri-apps/api/core';
import {FileNode} from "../components/FileExplorer/FileNode.ts";

const parseDirectory = async (directoryPath: string): Promise<FileNode> => {
    try {
        const result = await invoke<FileNode>("parse_directory", {directoryPath});
        console.log(result);
        return result
    } catch (error) {
        console.error("Error invoking parse_directory:", error);
        throw error;
    }
};

export default parseDirectory;