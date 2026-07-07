from django.db import models
from django.conf import settings


class Plano(models.Model):
    PERIODICIDADE_CHOICES = [
        ('mensal', 'Mensal'),
        ('trimestral', 'Trimestral'),
        ('semestral', 'Semestral'),
        ('anual', 'Anual'),
    ]

    nome = models.CharField(max_length=100)
    valor = models.DecimalField(max_digits=10, decimal_places=2)
    periodicidade = models.CharField(max_length=20, choices=PERIODICIDADE_CHOICES)
    limite_de_downloads = models.PositiveIntegerField(null=True, blank=True)
    ativo = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'Plano'
        verbose_name_plural = 'Planos'

    def __str__(self):
        return f'{self.nome} - R$ {self.valor}'


class Assinatura(models.Model):
    STATUS_CHOICES = [
        ('ativa', 'Ativa'),
        ('cancelada', 'Cancelada'),
        ('expirada', 'Expirada'),
        ('pendente', 'Pendente'),
    ]

    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='assinaturas'
    )
    plano = models.ForeignKey(
        Plano, on_delete=models.PROTECT, related_name='assinaturas'
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pendente')
    data_inicio = models.DateTimeField(null=True, blank=True)
    data_fim = models.DateTimeField(null=True, blank=True)
    gateway_id = models.CharField(
        max_length=100, blank=True, default='',
        help_text='ID da assinatura no Asaas'
    )
    criada_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Assinatura'
        verbose_name_plural = 'Assinaturas'

    def __str__(self):
        return f'{self.usuario.email} - {self.plano.nome}'
