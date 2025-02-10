import JSZip from "jszip";

interface FileNode {
    name: string;
    type: "file" | "directory";
    children?: FileNode[];
}

const parseZip = async (file: File): Promise<FileNode> => {
    const zip = await JSZip.loadAsync(file);
    const root: FileNode = { name: file.name, type: "directory", children: [] };

    zip.forEach((relativePath, zipEntry) => {
        const parts = relativePath.split("/").filter((part) => part !== ""); // Ensure no empty parts
        let current = root;

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            let existingNode = current.children?.find((node) => node.name === part);

            if (!existingNode) {
                const isFile = i === parts.length - 1 && !zipEntry.dir;
                existingNode = {
                    name: part,
                    type: isFile ? "file" : "directory",
                    children: isFile ? undefined : [],
                };

                // Ensure we only push if `current.children` exists
                if (current.children) {
                    current.children.push(existingNode);
                }
            }

            current = existingNode;
        }
    });

    return root;
};

export default parseZip;
