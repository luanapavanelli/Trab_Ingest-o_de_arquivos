export const getProjetos = async () => {
  try {
    const response = await fetch('http://localhost:8001/api/projetos/');
    if (!response.ok) throw new Error('Erro ao buscar projetos');
    return await response.json();
  } catch (error) {
    console.error('API Error (Gestão - GET):', error);
    // Mock local storage fallback para suportar CRUD no preview
    const cached = localStorage.getItem('mock_projetos');
    if (cached) return JSON.parse(cached);
    
    const initialMocks = [
      { id: 1, nome: "MVP - Gestão Inicial", descricao: "Projeto mock de demonstração" },
      { id: 2, nome: "Projeto Secundário", descricao: "Outro projeto para testes" }
    ];
    localStorage.setItem('mock_projetos', JSON.stringify(initialMocks));
    return initialMocks;
  }
};

export const getProjetoById = async (id) => {
  try {
    const response = await fetch(`http://localhost:8001/api/projetos/${id}`);
    if (!response.ok) throw new Error('Erro ao buscar projeto');
    return await response.json();
  } catch (error) {
    console.error('API Error (Gestão - GET ID):', error);
    const cached = JSON.parse(localStorage.getItem('mock_projetos') || '[]');
    return cached.find(p => p.id === parseInt(id)) || null;
  }
};

export const createProjeto = async (data) => {
  try {
    const response = await fetch('http://localhost:8001/api/projetos/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Erro ao criar projeto');
    return await response.json();
  } catch (error) {
    console.error('API Error (Gestão - POST):', error);
    const cached = JSON.parse(localStorage.getItem('mock_projetos') || '[]');
    const newProject = { 
      id: Math.max(0, ...cached.map(p => p.id)) + 1, 
      ...data 
    };
    localStorage.setItem('mock_projetos', JSON.stringify([...cached, newProject]));
    return newProject;
  }
};

export const updateProjeto = async (id, data) => {
  try {
    const response = await fetch(`http://localhost:8001/api/projetos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Erro ao atualizar projeto');
    return await response.json();
  } catch (error) {
    console.error('API Error (Gestão - PUT):', error);
    const cached = JSON.parse(localStorage.getItem('mock_projetos') || '[]');
    const updated = cached.map(p => p.id === parseInt(id) ? { ...p, ...data } : p);
    localStorage.setItem('mock_projetos', JSON.stringify(updated));
    return updated.find(p => p.id === parseInt(id));
  }
};

export const deleteProjeto = async (id) => {
  try {
    const response = await fetch(`http://localhost:8001/api/projetos/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Erro ao deletar projeto');
    return true;
  } catch (error) {
    console.error('API Error (Gestão - DELETE):', error);
    const cached = JSON.parse(localStorage.getItem('mock_projetos') || '[]');
    const filtered = cached.filter(p => p.id !== parseInt(id));
    localStorage.setItem('mock_projetos', JSON.stringify(filtered));
    return true;
  }
};
