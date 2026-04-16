from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from Projetos import views  # Isso conecta o seu app de projetos!

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name='home'),  # Tela de menu principal
    path('projeto/<int:projeto_id>/', views.dashboard, name='dashboard'), # Tela de arquivos
    # NOVAS ROTAS DE EXCLUSÃO:
    path('projeto/<int:projeto_id>/deletar/', views.deletar_projeto, name='deletar_projeto'),
    path('arquivo/<int:arquivo_id>/deletar/', views.deletar_arquivo, name='deletar_arquivo'),
]

# Isso permite que os PDFs e arquivos abram no navegador depois do upload
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)