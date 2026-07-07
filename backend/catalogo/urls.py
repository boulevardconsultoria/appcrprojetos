from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('categorias', views.CategoriaViewSet)
router.register('projetos', views.ProjetoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
