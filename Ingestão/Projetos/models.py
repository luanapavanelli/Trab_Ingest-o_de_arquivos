from django.db import models

class Projeto(models.Model):
    nome = models.CharField(max_length=100)
    data_criacao = models.DateTimeField(auto_now_add=True)
    descricao = models.TextField(blank=True, null=True, verbose_name="Descrição")
    ultima_alteracao = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.nome

class Arquivo(models.Model):
    # A mágica do relacionamento acontece AQUI, na mesma página:
    projeto = models.ForeignKey(Projeto, on_delete=models.CASCADE, related_name='arquivos')
    documento = models.FileField(upload_to='arquivos/')
    nome_original = models.CharField(max_length=255)
    tipo = models.CharField(max_length=20) 
    data_ingestao = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nome_original