import * as React from "react";
import { open } from '@tauri-apps/plugin-dialog';

interface FileUploadProps {
    onUpload: (path: string) => void;
}

/**
 * File upload component accepts zip, rar, and 7zip
 */
const FileUpload: React.FC<FileUploadProps> = ({ onUpload }) => {
    const selectDirDialog = async () => {
        try {
            const file = await open({
                multiple: false,
                directory: true,
            });

            if (file) {
                onUpload(file);
            }
        } catch (e) {
            console.error("Error selecting directory:", e);
        }
    };

    return (
        <div>
            <button onClick={selectDirDialog}>Select Directory</button>
        </div>
    );
};

export default FileUpload;
