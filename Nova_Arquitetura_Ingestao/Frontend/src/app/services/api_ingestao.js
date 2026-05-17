export const getArquivosPorProjeto = async (projetoId) => {
  try {
    const response = await fetch(`http://localhost:8002/api/arquivos/projeto/${projetoId}`);
    if (!response.ok) throw new Error('Erro ao buscar arquivos');
    return await response.json();
  } catch (error) {
    console.error('API Error (Ingestão - GET):', error);
    // Fallback mock
    return [
      { id: 1, nome_original: "relatorio_financeiro.pdf", projeto_id: projetoId, tipo: "pdf", tamanho_bytes: 2048576, data_ingestao: new Date().toISOString() },
      { id: 2, nome_original: "notas_reuniao.txt", projeto_id: projetoId, tipo: "txt", tamanho_bytes: 1024, data_ingestao: new Date(Date.now() - 3600000).toISOString() },
      { id: 3, nome_original: "dados_clientes.csv", projeto_id: projetoId, tipo: "csv", tamanho_bytes: 512000, data_ingestao: new Date(Date.now() - 86400000).toISOString() }
    ];
  }
};

export const uploadArquivo = async (projetoId, file) => {
  try {
    const formData = new FormData();
    formData.append('projeto_id', projetoId.toString());
    formData.append('file', file);
    
    const response = await fetch('http://localhost:8002/api/arquivos/', {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Erro no upload');
    return await response.json();
  } catch (error) {
    console.error('API Error (Ingestão - POST):', error);
    // Fallback mock para previsualização funcional
    const extensao = file.name.split('.').pop() || 'unknown';
    return {
      id: Math.floor(Math.random() * 10000) + 10,
      nome_original: file.name,
      projeto_id: projetoId,
      tipo: extensao.toLowerCase(),
      tamanho_bytes: file.size,
      data_ingestao: new Date().toISOString()
    };
  }
};

export const getDownloadUrl = (projetoId, arquivoId) => {
  return `http://localhost:8002/api/arquivos/download/${projetoId}/${arquivoId}`;
};
