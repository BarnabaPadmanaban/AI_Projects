
import React, { useState, useCallback } from 'react';

interface FileUploadProps {
  files: File[];
  onFileChange: (files: FileList | null) => void;
  onSummarize: () => void;
  error: string;
}

const UploadIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-500 group-hover:text-cyan-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const FileIcon: React.FC<{ fileName: string }> = ({ fileName }) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  let icon;
  if (extension === 'pdf') {
    icon = '📄';
  } else if (['png', 'jpg', 'jpeg', 'webp'].includes(extension || '')) {
    icon = '🖼️';
  } else {
    icon = '📁';
  }
  return <span className="text-2xl mr-3">{icon}</span>;
};


export const FileUpload: React.FC<FileUploadProps> = ({ files, onFileChange, onSummarize, error }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileChange(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFileChange(e.target.files);
  };
  
  const hasFiles = files.length > 0;

  return (
    <div className="p-6 md:p-10 flex flex-col items-center justify-center space-y-6">
       <input
        type="file"
        id="file-upload"
        multiple
        accept=".pdf,.png,.jpg,.jpeg,.webp"
        className="hidden"
        onChange={handleFileSelect}
      />
      <label
        htmlFor="file-upload"
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`group w-full flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300
          ${isDragging ? 'border-cyan-400 bg-slate-700/50' : 'border-slate-600 hover:border-cyan-500 hover:bg-slate-700/30'}
        `}
      >
        <UploadIcon />
        <p className="mt-4 text-slate-400 group-hover:text-slate-200 transition-colors">
          <span className="font-semibold text-cyan-400">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-slate-500">PDF, PNG, JPG, or WEBP files</p>
      </label>

      {error && <p className="text-red-400 text-sm animate-pulse">{error}</p>}
      
      {hasFiles && (
        <div className="w-full space-y-3 pt-4">
            <h3 className="font-semibold text-slate-300">Selected Files:</h3>
            <ul className="max-h-48 overflow-y-auto bg-slate-900/50 p-3 rounded-md border border-slate-700">
                {files.map((file, index) => (
                    <li key={index} className="flex items-center text-slate-300 text-sm p-2 rounded truncate bg-slate-800/50 mb-1 last:mb-0">
                        <FileIcon fileName={file.name}/>
                        <span className="truncate">{file.name}</span>
                    </li>
                ))}
            </ul>
        </div>
      )}

      <button
        onClick={onSummarize}
        disabled={!hasFiles}
        className="w-full md:w-auto px-12 py-3 text-lg font-semibold rounded-lg bg-cyan-500 text-white shadow-lg shadow-cyan-500/20
        hover:bg-cyan-400 transform hover:-translate-y-1 transition-all duration-300
        disabled:bg-slate-600 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
      >
        Summarize
      </button>
    </div>
  );
};
