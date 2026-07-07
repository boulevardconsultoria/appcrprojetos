from rest_framework import viewsets, permissions
from .models import Plano, Assinatura
from .serializers import PlanoSerializer, AssinaturaSerializer


class PlanoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Plano.objects.filter(ativo=True)
    serializer_class = PlanoSerializer
    permission_classes = (permissions.AllowAny,)


class AssinaturaViewSet(viewsets.ModelViewSet):
    serializer_class = AssinaturaSerializer

    def get_queryset(self):
        return Assinatura.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)
