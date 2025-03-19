import React from 'react';
interface FileUploaderProps {
    acceptedTypes?: string;
    maxSizeMB?: number;
    onSuccess?: () => void;
    saveAsTemplate?: boolean;
}
export declare const FileUploader: React.FC<FileUploaderProps>;
export default FileUploader;
