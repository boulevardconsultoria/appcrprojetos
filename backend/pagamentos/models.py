from django.db import models
from django.conf import settings


class CompraAvulsa(models.Model):
    STATUS_CHOICES = [
        ('pendente', 'Pendente'),
        ('aprovado', 'Aprovado'),
        ('recusado', 'Recusado'),
        ('reembolsado', 'Reembolsado'),
    ]

    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='compras_avulsas'
    )
    projeto = models.ForeignKey(
        'catalogo.Projeto', on_delete=models.CASCADE,
        related_name='compras_avulsas'
    )
    valor_pago = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pendente')
    gateway_id = models.CharField(
        max_length=100, blank=True, default='',
        help_text='ID da cobrança no Asaas'
    )
    criada_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Compra Avulsa'
        verbose_name_plural = 'Compras Avulsas'

    def __str__(self):
        return f'{self.usuario.email} - {self.projeto.titulo}'
