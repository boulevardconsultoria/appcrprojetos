from django.contrib.auth.models import AbstractUser
from django.db import models


class Usuario(AbstractUser):
    telefone = models.CharField(max_length=20, blank=True, default='')
    cpf_cnpj = models.CharField(max_length=18, blank=True, default='')
    endereco = models.TextField(blank=True, default='')
    cep = models.CharField(max_length=9, blank=True, default='')
    eh_assinante_ativo = models.BooleanField(default=False)

    class Meta:
        verbose_name = 'Usuário'
        verbose_name_plural = 'Usuários'

    def __str__(self):
        return self.get_full_name() or self.email
