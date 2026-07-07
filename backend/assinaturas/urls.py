from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('planos', views.PlanoViewSet)
router.register('minhas-assinaturas', views.AssinaturaViewSet, basename='minhas-assinaturas')

urlpatterns = [
    path('', include(router.urls)),
]
