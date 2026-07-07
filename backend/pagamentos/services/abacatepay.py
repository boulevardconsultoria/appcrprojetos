import httpx
from django.conf import settings

BASE_URL = 'https://api.abacatepay.com/v1'


class AbacatePayClient:
    def __init__(self):
        self.headers = {
            'Authorization': f'Bearer {settings.ABACATEPAY_API_KEY}',
            'Content-Type': 'application/json',
        }

    def criar_checkout(
        self,
        projeto_titulo: str,
        valor_centavos: int,
        customer_name: str = '',
        customer_email: str = '',
        customer_cellphone: str = '',
        customer_tax_id: str = '',
        return_url: str = '',
        completion_url: str = '',
    ) -> dict:
        payload = {
            'products': [{
                'externalId': 'projeto',
                'name': projeto_titulo,
                'description': projeto_titulo,
                'quantity': 1,
                'price': valor_centavos,
            }],
            'returnUrl': return_url or 'https://appcrprojetos.pages.dev/catalogo',
            'completionUrl': completion_url or 'https://appcrprojetos.pages.dev/dashboard',
            'frequency': 'ONE_TIME',
            'methods': ['PIX'],
        }

        if customer_name and customer_tax_id:
            payload['customer'] = {
                'name': customer_name,
                'email': customer_email,
                'cellphone': customer_cellphone,
                'taxId': customer_tax_id,
            }

        resp = httpx.post(
            f'{BASE_URL}/billing/create',
            json=payload,
            headers=self.headers,
        )

        if resp.status_code != 200:
            error_msg = resp.json().get('error', str(resp.text))
            raise Exception(f'AbacatePay error: {error_msg}')

        data = resp.json()['data']
        return {
            'id': data['id'],
            'url': data['url'],
            'amount': data['amount'],
            'status': data['status'],
            'dev_mode': data['devMode'],
            'customer_id': data.get('customer', {}).get('id', ''),
        }
