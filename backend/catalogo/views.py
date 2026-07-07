from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Categoria, Projeto
from .serializers import (
    CategoriaSerializer, ProjetoListSerializer,
    ProjetoDetailSerializer, ProjetoAdminSerializer,
)


class CategoriaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    permission_classes = (permissions.AllowAny,)


class ProjetoViewSet(viewsets.ModelViewSet):
    queryset = Projeto.objects.filter(publicado=True)
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['categoria__slug', 'eh_gratuito', 'eh_premium']
    search_fields = ['titulo', 'descricao', 'tags']
    ordering_fields = ['criado_em', 'titulo', 'downloads_count']

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get_serializer_class(self):
        if self.action == 'list':
            return ProjetoListSerializer
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return ProjetoAdminSerializer
        return ProjetoDetailSerializer

    def perform_create(self, serializer):
        serializer.save()
