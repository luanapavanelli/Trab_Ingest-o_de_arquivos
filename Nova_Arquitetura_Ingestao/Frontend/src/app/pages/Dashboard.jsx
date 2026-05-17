import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { FileList } from '../components/files/FileList';
import { UploadZone } from '../components/files/UploadZone';
import { getProjetoById, getProjetos } from '../services/api_gestao';
import { getArquivosPorProjeto, uploadArquivo } from '../services/api_ingestao';
import { Loader2 } from 'lucide-react';

export const Dashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projetos, setProjetos] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [files, setFiles] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Carregar lista de projetos para a Sidebar
  useEffect(() => {
    const fetchProjetos = async () => {
      try {
        const dataProjetos = await getProjetos();
        setProjetos(dataProjetos);
      } catch (error) {
        console.error("Erro ao buscar projetos", error);
      }
    };
    fetchProjetos();
  }, []);

  // Carregar projeto ativo baseado no ID da URL
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const projeto = await getProjetoById(id);
        if (projeto) {
          setCurrentProject(projeto);
          const projectFiles = await getArquivosPorProjeto(projeto.id);
          setFiles(projectFiles);
        } else {
          // Projeto não encontrado, volta para lista
          navigate('/');
        }
      } catch (error) {
        console.error("Erro ao iniciar dashboard", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [id, navigate]);

  // Trocar de projeto usando roteamento
  const handleProjectChange = (projetoId) => {
    navigate(`/projetos/${projetoId}`);
  };

  // Upload
  const handleUpload = async (file) => {
    if (!currentProject) return;
    
    try {
      const novoArquivo = await uploadArquivo(currentProject.id, file);
      // Adiciona imediatamente ao estado, sem recarregar a API
      setFiles((prev) => [novoArquivo, ...prev]);
    } catch (error) {
      console.error("Falha no upload", error);
      alert("Ocorreu um erro ao enviar o arquivo.");
    }
  };

  // Filtragem e Ordenação no Client-Side
  const processedFiles = useMemo(() => {
    let result = [...files];

    // Filtrar
    if (filter !== 'all') {
      result = result.filter(f => f.tipo?.toLowerCase() === filter.toLowerCase());
    }

    // Ordenar do mais recente para o mais antigo
    result.sort((a, b) => {
      return new Date(b.data_ingestao).getTime() - new Date(a.data_ingestao).getTime();
    });

    return result;
  }, [files, filter]);

  // Tipos únicos para o Sidebar
  const availableTypes = useMemo(() => {
    const types = new Set(files.map(f => f.tipo?.toLowerCase()).filter(Boolean));
    return Array.from(types).sort();
  }, [files]);

  if (isLoading) {
    return (
      <div className="flex h-screen bg-neutral-950 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <p className="text-gray-400 font-medium">Carregando conhecimento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-neutral-950 text-gray-200 overflow-hidden font-sans">
      <Sidebar 
        currentFilter={filter} 
        onFilterChange={setFilter} 
        availableTypes={availableTypes}
        projetos={projetos}
        currentProject={currentProject}
        onProjectChange={handleProjectChange}
      />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <Header currentProject={currentProject} />
        
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Upload Zone */}
            <section>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Adicionar Conhecimento
              </h3>
              <UploadZone onUpload={handleUpload} />
            </section>
            
            {/* Files List */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  Arquivos do Projeto ({processedFiles.length})
                </h3>
              </div>
              <FileList files={processedFiles} />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};
