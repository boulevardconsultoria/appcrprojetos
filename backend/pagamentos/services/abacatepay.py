from abacatepay import AbacatePay
from abacatepay.products import Product
from abacatepay.customers import CustomerMetadata
from django.conf import settings


class AbacatePayClient:
    def __init__(self):
        self.client = AbacatePay(settings.ABACATEPAY_API_KEY)

    def criar_cliente(self, nome: str, email: str, celular: str = '', tax_id: str = '') -> str:
        metadata = CustomerMetadata(
            name=nome,
            email=email,
            cellphone=celular,
            tax_id=tax_id,
        )
        customer = self.client.customers.create(metadata)
        return customer.id

    def criar_checkout(
        self,
        projeto_titulo: str,
        valor_centavos: int,
        customer_id: str | None = None,
        customer_metadata: CustomerMetadata | None = None,
        return_url: str = '',
        completion_url: str = '',
    ) -> dict:
        product = Product(
            external_id='projeto',
            name=projeto_titulo,
            quantity=1,
            price=valor_centavos,
        )

        kwargs = {
            'products': [product],
            'return_url': return_url,
            'completion_url': completion_url,
        }
        if customer_id:
            kwargs['customer_id'] = customer_id
        elif customer_metadata:
            kwargs['customer'] = customer_metadata

        billing = self.client.billing.create(**kwargs)
        return {
            'id': billing.id,
            'url': billing.url,
            'amount': billing.amount,
            'status': billing.status,
            'dev_mode': billing.dev_mode,
        }

    def listar_cobrancas(self):
        return self.client.billing.list()
