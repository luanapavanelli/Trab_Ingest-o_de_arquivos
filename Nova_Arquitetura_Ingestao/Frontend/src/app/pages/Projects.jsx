import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Folder, Edit2, Trash2, X, Loader2 } from 'lucide-react';
import { getProjetos, createProjeto, updateProjeto, deleteProjeto } from '../services/api_gestao';
import { twMerge } from 'tailwind-merge';

export const Projects = () => {
  const navigate = useNavigate();
  const [projetos, setProjetos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [currentProject, setCurrentProject] = useState({ nome: '', descricao: '' });

  const loadProjetos = async () => {
    setIsLoading(true);
    try {
      const data = await getProjetos();
      setProjetos(data);
    } catch (error) {
      console.error("Erro ao carregar projetos", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjetos();
  }, []);

  const openCreateModal = () => {
    setModalMode('create');
    setCurrentProject({ nome: '', descricao: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (e, project) => {
    e.stopPropagation(); // Prevenir navegação ao clicar em editar
    setModalMode('edit');
    setCurrentProject(project);
    setIsModalOpen(true);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm("Tem certeza que deseja excluir este projeto? Todos os arquivos serão perdidos.")) {
      try {
        await deleteProjeto(id);
        loadProjetos();
      } catch (error) {
        alert("Erro ao excluir projeto.");
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'create') {
        await createProjeto(currentProject);
      } else {
        await updateProjeto(currentProject.id, currentProject);
      }
      setIsModalOpen(false);
      loadProjetos();
    } catch (error) {
      alert("Erro ao salvar projeto.");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-gray-200 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">KM</span>
            </div>
            <h1 className="text-2xl font-bold">Gestão de Projetos</h1>
          </div>
          <button 
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Novo Projeto
          </button>
        </header>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          </div>
        ) : projetos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-neutral-800 rounded-xl">
            <Folder className="w-12 h-12 text-neutral-600 mb-4" />
            <p className="text-gray-400">Nenhum projeto encontrado. Crie o seu primeiro!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projetos.map(projeto => (
              <div 
                key={projeto.id}
                onClick={() => navigate(`/projetos/${projeto.id}`)}
                className="group bg-neutral-900 border border-neutral-800 hover:border-indigo-500 rounded-xl p-6 cursor-pointer transition-all hover:shadow-lg hover:shadow-indigo-500/10 flex flex-col h-48 relative"
              >
                <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => openEditModal(e, projeto)}
                    className="p-1.5 text-gray-400 hover:text-indigo-400 hover:bg-neutral-800 rounded-md transition-colors"
                    title="Editar"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={(e) => handleDelete(e, projeto.id)}
                    className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-neutral-800 rounded-md transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center mb-4">
                  <Folder className="w-5 h-5 text-indigo-400" />
                </div>
                
                <h3 className="text-lg font-semibold text-gray-200 mb-2 truncate pr-16">{projeto.nome}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mt-auto">{projeto.descricao || 'Sem descrição'}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal CRUD */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-neutral-800">
              <h2 className="text-lg font-semibold text-gray-200">
                {modalMode === 'create' ? 'Novo Projeto' : 'Editar Projeto'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-5 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Nome do Projeto *</label>
                <input 
                  type="text" 
                  required
                  value={currentProject.nome}
                  onChange={e => setCurrentProject({...currentProject, nome: e.target.value})}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  placeholder="Ex: Marketing Q3"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Descrição</label>
                <textarea 
                  value={currentProject.descricao}
                  onChange={e => setCurrentProject({...currentProject, descricao: e.target.value})}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all min-h-[100px] resize-none"
                  placeholder="Breve descrição dos objetivos..."
                />
              </div>

              <div className="mt-4 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:bg-neutral-800 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                >
                  {modalMode === 'create' ? 'Criar Projeto' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
