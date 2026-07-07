from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import CompraAvulsa
from .services.abacatepay import AbacatePayClient


@method_decorator(csrf_exempt, name='dispatch')
class AbacatePayWebhookView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        try:
            payload = request.data
            event = payload.get('event', '')
            data = payload.get('data', {})

            if event != 'transparent.completed':
                return Response({'status': 'ignored'})

            billing = data.get('transparent', {})
            billing_id = billing.get('id', '')
            status_pagamento = billing.get('status', '')

            if status_pagamento == 'PAID':
                compra = CompraAvulsa.objects.filter(
                    gateway_id=billing_id
                ).first()
                if compra:
                    compra.status = 'aprovado'
                    compra.save()

                    projeto = compra.projeto
                    projeto.downloads_count += 1
                    projeto.save(update_fields=['downloads_count'])

                return Response({'status': 'ok'})

            return Response({'status': 'ignored'})

        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class CriarCheckoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        projeto_id = request.data.get('projeto_id')
        if not projeto_id:
            return Response(
                {'error': 'projeto_id é obrigatório'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            from catalogo.models import Projeto
            projeto = Projeto.objects.get(id=projeto_id, publicado=True)
        except Projeto.DoesNotExist:
            return Response(
                {'error': 'Projeto não encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )

        if not projeto.eh_premium and not projeto.preco_avulso:
            return Response(
                {'error': 'Este projeto não requer pagamento'},
                status=status.HTTP_400_BAD_REQUEST
            )

        valor = int(float(projeto.preco_avulso) * 100) if projeto.preco_avulso else 5
        if valor < 5:
            valor = 5

        try:
            client = AbacatePayClient()

            user = request.user
            customer_metadata = {
                'name': user.get_full_name() or user.email,
                'email': user.email,
                'cellphone': user.telefone,
                'tax_id': user.cpf_cnpj,
            }

            checkout = client.criar_checkout(
                projeto_titulo=projeto.titulo,
                valor_centavos=valor,
                customer_metadata=customer_metadata,
                return_url='',
                completion_url=request.build_absolute_uri('/api/pagamentos/webhook/'),
            )

            CompraAvulsa.objects.create(
                usuario=user,
                projeto=projeto,
                valor_pago=projeto.preco_avulso or 0.05,
                gateway_id=checkout['id'],
            )

            return Response({
                'checkout_id': checkout['id'],
                'url': checkout['url'],
                'amount': checkout['amount'],
                'dev_mode': checkout['dev_mode'],
            })

        except Exception as e:
            return Response(
                {'error': f'Erro ao criar checkout: {str(e)}'},
                status=status.HTTP_502_BAD_GATEWAY
            )
