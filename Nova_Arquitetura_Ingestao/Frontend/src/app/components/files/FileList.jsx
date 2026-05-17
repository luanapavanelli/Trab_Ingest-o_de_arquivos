import { FileCard } from './FileCard';

export const FileList = ({ files }) => {
  if (!files || files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-neutral-700 rounded-xl text-gray-500">
        <p>Nenhum arquivo encontrado.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {files.map(file => (
        <FileCard key={file.id} file={file} />
      ))}
    </div>
  );
};
