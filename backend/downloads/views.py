import boto3
from django.conf import settings
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Download
from .serializers import DownloadSerializer
from catalogo.models import Projeto


class DownloadCreateView(generics.CreateAPIView):
    serializer_class = DownloadSerializer

    def perform_create(self, serializer):
        download = serializer.save()
        projeto = download.projeto
        projeto.downloads_count += 1
        projeto.save(update_fields=['downloads_count'])


class DownloadListView(generics.ListAPIView):
    serializer_class = DownloadSerializer

    def get_queryset(self):
        return Download.objects.filter(usuario=self.request.user)


class GerarPresignedUrlView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, projeto_id):
        try:
            projeto = Projeto.objects.get(id=projeto_id, publicado=True)
        except Projeto.DoesNotExist:
            return Response(
                {'error': 'Projeto não encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )

        if projeto.eh_premium:
            user = request.user
            assinatura_ativa = user.assinaturas.filter(
                status='ativa'
            ).exists()
            compra_avulsa = user.compras_avulsas.filter(
                projeto=projeto, status='aprovado'
            ).exists()
            if not assinatura_ativa and not compra_avulsa and not user.is_staff:
                return Response(
                    {'error': 'Acesso negado. Assine ou compre o projeto.'},
                    status=status.HTTP_403_FORBIDDEN
                )

        if not projeto.arquivo_principal_key:
            return Response(
                {'error': 'Arquivo não disponível'},
                status=status.HTTP_404_NOT_FOUND
            )

        url = self._generate_presigned_url(projeto.arquivo_principal_key)
        return Response({'url': url})

    def _generate_presigned_url(self, object_key: str, expires_in: int = 3600) -> str:
        session = boto3.Session(
            aws_access_key_id=settings.R2_ACCESS_KEY_ID,
            aws_secret_access_key=settings.R2_SECRET_ACCESS_KEY,
        )
        client = session.client(
            's3',
            endpoint_url=f'https://{settings.R2_ACCOUNT_ID}.r2.cloudflarestorage.com',
            region_name='auto',
        )
        url = client.generate_presigned_url(
            'get_object',
            Params={'Bucket': settings.R2_BUCKET_NAME, 'Key': object_key},
            ExpiresIn=expires_in,
        )
        return url
