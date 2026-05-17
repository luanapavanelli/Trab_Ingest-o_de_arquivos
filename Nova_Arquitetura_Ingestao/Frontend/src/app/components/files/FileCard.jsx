import React from 'react';
import { FileText, File, FileCode, Download, Image as ImageIcon } from 'lucide-react';
import { format } from 'date-fns';
import { getDownloadUrl } from '../../services/api_ingestao';

export const FileCard = ({ file }) => {
  const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  const getIcon = () => {
    const type = file.tipo?.toLowerCase();
    switch (type) {
      case 'pdf': return <File className="w-8 h-8 text-red-400" />;
      case 'txt': return <FileText className="w-8 h-8 text-blue-400" />;
      case 'csv': return <FileCode className="w-8 h-8 text-green-400" />;
      case 'jpg':
      case 'png':
      case 'jpeg': return <ImageIcon className="w-8 h-8 text-purple-400" />;
      default: return <File className="w-8 h-8 text-gray-400" />;
    }
  };

  const handleDownload = () => {
    const url = getDownloadUrl(file.projeto_id, file.id);
    window.open(url, '_blank');
  };

  const formattedDate = format(new Date(file.data_ingestao), 'dd/MM/yyyy HH:mm');

  return (
    <div 
      onClick={handleDownload}
      className="group flex flex-col p-4 bg-neutral-800 border border-gray-700 rounded-lg cursor-pointer hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/10 transition-all"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-neutral-900 rounded-lg group-hover:scale-110 transition-transform">
          {getIcon()}
        </div>
        <button 
          className="text-gray-500 hover:text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
          title="Fazer download"
          onClick={(e) => {
            e.stopPropagation();
            handleDownload();
          }}
        >
          <Download className="w-4 h-4" />
        </button>
      </div>
      
      <h3 className="text-sm font-medium text-gray-200 truncate mb-1" title={file.nome_original}>
        {file.nome_original}
      </h3>
      
      <div className="flex items-center justify-between mt-auto pt-2 text-xs text-gray-500">
        <span className="uppercase font-medium">{file.tipo}</span>
        <span>{formatBytes(file.tamanho_bytes)}</span>
      </div>
      <div className="text-[10px] text-gray-600 mt-1">
        {formattedDate}
      </div>
    </div>
  );
};
