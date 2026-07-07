from django.db import models
from django.conf import settings


class Download(models.Model):
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='downloads'
    )
    projeto = models.ForeignKey(
        'catalogo.Projeto', on_delete=models.CASCADE,
        related_name='downloads'
    )
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Download'
        verbose_name_plural = 'Downloads'
        ordering = ('-timestamp',)

    def __str__(self):
        return f'{self.usuario.email} - {self.projeto.titulo}'
