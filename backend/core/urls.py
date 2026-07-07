from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/contas/', include('contas.urls')),
    path('api/catalogo/', include('catalogo.urls')),
    path('api/assinaturas/', include('assinaturas.urls')),
    path('api/pagamentos/', include('pagamentos.urls')),
    path('api/downloads/', include('downloads.urls')),
]
