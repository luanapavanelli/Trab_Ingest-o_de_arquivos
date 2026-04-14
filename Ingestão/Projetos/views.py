import os
from django.shortcuts import render, redirect
from .models import Projeto, Arquivo


def dashboard(request):
    # Garante que sempre exista pelo menos um projeto para o MVP não quebrar
    projeto = Projeto.objects.first()
    if not projeto:
        projeto = Projeto.objects.create(nome="MVP - Gestão Inicial", descricao="Projeto de teste gerado pelo sistema.")

    # Lógica de Ingestão: Captura o arquivo enviado pelo HTML
    if request.method == 'POST':
        if 'arquivo_ingestao' in request.FILES:
            arquivo_recebido = request.FILES['arquivo_ingestao']
            nome = arquivo_recebido.name

            # Pega a extensão (.pdf, .txt) e padroniza para os filtros funcionarem depois
            extensao = os.path.splitext(nome)[1].lower()

            # Salva o registro no banco de dados SQLite e o arquivo na pasta /media/
            Arquivo.objects.create(
                projeto=projeto,
                documento=arquivo_recebido,
                nome_original=nome,
                tipo=extensao
            )

            # Recarrega a página para evitar que o usuário envie o arquivo duas vezes sem querer
            return redirect('dashboard')

            # Busca os arquivos que já estão salvos no banco para mostrar na tela
    arquivos_salvos = projeto.arquivos.all().order_by('-data_ingestao')

    contexto = {
        'projeto_atual': projeto,
        'arquivos': arquivos_salvos,
    }

    # Envia os dados para o Front-End
    return render(request, 'Projetos/dashboard.html', contexto)