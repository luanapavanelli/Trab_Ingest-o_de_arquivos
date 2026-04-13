from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from Projetos import views  # Isso conecta o seu app de projetos!

urlpatterns = [
    path('admin/', admin.site.urls),
    # Esta é a linha que estava faltando. Ela diz que a URL raiz ('') vai carregar o seu HTML:
    path('', views.dashboard, name='dashboard'), 
]

# Isso permite que os PDFs e arquivos abram no navegador depois do upload
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)