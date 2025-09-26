
import React, { useRef, useState } from 'react';
import { IconUpload, IconX } from './Icons';

interface FileUploadProps {
    onFileChange: (file: File | null) => void;
    imagePreviewUrl: string | null;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileChange, imagePreviewUrl }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileSelect = (files: FileList | null) => {
        if (files && files.length > 0) {
            onFileChange(files[0]);
        }
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        handleFileSelect(e.dataTransfer.files);
    };

    const handleClearFile = () => {
        onFileChange(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Upload Test Paper</h2>
            <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${isDragging ? 'border-indigo-500 bg-indigo-50 dark:bg-gray-700' : 'border-gray-300 dark:border-gray-600'}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => handleFileSelect(e.target.files)}
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                />
                {!imagePreviewUrl ? (
                    <>
                        <div className="mx-auto bg-gray-100 dark:bg-gray-700 rounded-full w-16 h-16 flex items-center justify-center">
                            <IconUpload className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                        </div>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                            >
                                Click to upload
                            </button> or drag and drop
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">PNG, JPG, or WEBP</p>
                    </>
                ) : (
                    <div className="relative group">
                        <img src={imagePreviewUrl} alt="Test paper preview" className="max-h-80 w-auto mx-auto rounded-lg shadow-md" />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center rounded-lg">
                             <button
                                onClick={handleClearFile}
                                className="opacity-0 group-hover:opacity-100 bg-red-600 text-white rounded-full p-2 hover:bg-red-700 transition-opacity"
                                aria-label="Remove image"
                            >
                                <IconX className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileUpload;
