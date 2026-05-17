import { Filter, FileText, File, FileCode, LayoutGrid, ArrowLeft } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useNavigate } from 'react-router';

export const Sidebar = ({ currentFilter, onFilterChange, availableTypes, projetos, currentProject, onProjectChange }) => {
  const navigate = useNavigate();
  
  const getIconForType = (type) => {
    switch (type) {
      case 'pdf': return <File className="w-4 h-4" />;
      case 'txt': return <FileText className="w-4 h-4" />;
      case 'csv': return <FileCode className="w-4 h-4" />;
      default: return <File className="w-4 h-4" />;
    }
  };

  return (
    <aside className="w-64 bg-neutral-900 border-r border-neutral-800 h-screen flex flex-col">
      <div className="p-6">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-300 transition-colors mb-4 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar aos projetos
        </button>
        <h1 className="text-xl font-bold text-gray-200 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <span className="text-white font-bold">KM</span>
          </div>
          Knowledge
        </h1>
      </div>

      <div className="px-4 py-4 border-b border-neutral-800">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">Projeto Ativo</h2>
        <div className="px-2">
          <select
            value={currentProject?.id || ''}
            onChange={(e) => onProjectChange(e.target.value)}
            className="w-full bg-neutral-800 text-gray-200 text-sm rounded-lg border border-neutral-700 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.75rem center',
              backgroundSize: '1rem'
            }}
          >
            {projetos?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="px-4 py-4">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">Filtros de Arquivo</h2>
        <nav className="space-y-1">
          <button
            onClick={() => onFilterChange('all')}
            className={twMerge(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              currentFilter === 'all' 
                ? "bg-neutral-800 text-gray-200" 
                : "text-gray-400 hover:bg-neutral-800 hover:text-gray-200"
            )}
          >
            <LayoutGrid className="w-4 h-4" />
            Todos os Arquivos
          </button>
          
          {availableTypes.map((type) => (
            <button
              key={type}
              onClick={() => onFilterChange(type)}
              className={twMerge(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors uppercase",
                currentFilter === type 
                  ? "bg-neutral-800 text-gray-200" 
                  : "text-gray-400 hover:bg-neutral-800 hover:text-gray-200"
              )}
            >
              {getIconForType(type)}
              {type}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};
