import os
from django.shortcuts import render, redirect, get_object_or_404
from .models import Projeto, Arquivo

def home(request):
    """
    Tela Inicial: Lista projetos e permite a criação de um novo.
    """
    # Lógica de Criação: Se o usuário enviou o formulário de novo projeto
    if request.method == 'POST':
        nome_projeto = request.POST.get('nome')
        descricao_projeto = request.POST.get('descricao')
        
        # Só cria se tiver pelo menos o nome preenchido
        if nome_projeto:
            novo_projeto = Projeto.objects.create(
                nome=nome_projeto,
                descricao=descricao_projeto
            )
            # Redireciona instantaneamente para o dashboard do projeto recém-criado
            return redirect('dashboard', projeto_id=novo_projeto.id)

    # Busca padrão para renderizar a tela (mais recentes primeiro)
    projetos = Projeto.objects.all().order_by('-ultima_alteracao')
    return render(request, 'Projetos/home.html', {'projetos': projetos})

def dashboard(request, projeto_id):
    """
    Tela do Projeto: Exibe arquivos e lida com uploads de um projeto específico.
    """
    # Busca o projeto exato pelo ID que vem da URL
    projeto = get_object_or_404(Projeto, id=projeto_id)

    # Lógica de Ingestão: Captura o arquivo enviado pelo formulário
    if request.method == 'POST':
        if 'arquivo_ingestao' in request.FILES:
            arquivo_recebido = request.FILES['arquivo_ingestao']
            nome = arquivo_recebido.name

            # Extrai a extensão (.pdf, .png, etc) para os filtros do Front-End
            extensao = os.path.splitext(nome)[1].lower()

            # Salva no banco de dados vinculado ao projeto atual
            Arquivo.objects.create(
                projeto=projeto,
                documento=arquivo_recebido,
                nome_original=nome,
                tipo=extensao
            )

            # Redireciona de volta para o dashboard DESTE projeto específico
            return redirect('dashboard', projeto_id=projeto.id)

    # Busca apenas os arquivos que pertencem a este projeto
    arquivos_salvos = projeto.arquivos.all().order_by('-data_ingestao')

    contexto = {
        'projeto_atual': projeto,
        'arquivos': arquivos_salvos,
    }

    # Renderiza o dashboard.html (ajuste o caminho se estiver dentro de uma subpasta)
    return render(request, 'Projetos/dashboard.html', contexto)