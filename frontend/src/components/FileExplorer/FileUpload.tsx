import * as React from "react";

interface FileUploadProps {
    onUpload: (file: File) => void;
}

/**
 * File upload component accepts zip, rar, and 7zip
 */
const FileUpload: React.FC<FileUploadProps> = ({onUpload}) => {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            onUpload(file);
        }
    };

    return (
        <div>
            <input type="file" accept=".zip,.rar,.7zip" onChange={handleFileChange}/>
        </div>
    );
};


export default FileUpload;