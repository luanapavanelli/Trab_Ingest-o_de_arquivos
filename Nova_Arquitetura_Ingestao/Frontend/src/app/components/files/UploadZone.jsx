import React, { useRef, useState } from 'react';
import { UploadCloud, Loader2 } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export const UploadZone = ({ onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFile = async (file) => {
    if (!file) return;
    setIsUploading(true);
    try {
      await onUpload(file);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    processFile(file);
    // Reset input so the same file can be selected again
    e.target.value = '';
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !isUploading && fileInputRef.current?.click()}
      className={twMerge(
        "w-full p-8 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer group",
        isDragging 
          ? "border-indigo-500 bg-indigo-500/10" 
          : "border-neutral-700 hover:border-indigo-500 hover:bg-neutral-800/50",
        isUploading && "opacity-50 cursor-not-allowed pointer-events-none"
      )}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
        className="hidden"
      />
      
      {isUploading ? (
        <div className="flex flex-col items-center">
          <Loader2 className="w-10 h-10 text-indigo-400 animate-spin mb-3" />
          <p className="text-gray-300 font-medium">Enviando arquivo...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="p-3 bg-neutral-800 rounded-full group-hover:bg-neutral-700 transition-colors mb-3">
            <UploadCloud className="w-8 h-8 text-indigo-400" />
          </div>
          <p className="text-gray-300 font-medium mb-1">
            Clique ou arraste um arquivo para esta área
          </p>
          <p className="text-xs text-gray-500">
            Suporta PDF, TXT, CSV, JPG, PNG e mais
          </p>
        </div>
      )}
    </div>
  );
};
