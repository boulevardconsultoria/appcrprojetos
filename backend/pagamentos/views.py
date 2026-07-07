import json
from decimal import Decimal
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import CompraAvulsa


@method_decorator(csrf_exempt, name='dispatch')
class AsaasWebhookView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        try:
            payload = request.data
            event = payload.get('event', '')
            payment = payload.get('payment', {})

            if event in ('PAYMENT_CONFIRMED', 'PAYMENT_RECEIVED'):
                gateway_id = payment.get('id')
                status_gateway = 'aprovado'
                compra = CompraAvulsa.objects.filter(
                    gateway_id=gateway_id
                ).first()
                if compra:
                    compra.status = status_gateway
                    compra.save()
                return Response({'status': 'ok'})

            if event == 'PAYMENT_REFUNDED':
                gateway_id = payment.get('id')
                compra = CompraAvulsa.objects.filter(
                    gateway_id=gateway_id
                ).first()
                if compra:
                    compra.status = 'reembolsado'
                    compra.save()
                return Response({'status': 'ok'})

            return Response({'status': 'ignored'})

        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
