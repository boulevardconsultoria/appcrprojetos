from django.db import models


class Categoria(models.Model):
    nome = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    icone = models.CharField(max_length=50, blank=True, default='')

    class Meta:
        verbose_name = 'Categoria'
        verbose_name_plural = 'Categorias'

    def __str__(self):
        return self.nome


class Projeto(models.Model):
    titulo = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    descricao = models.TextField(blank=True, default='')
    categoria = models.ForeignKey(
        Categoria, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='projetos'
    )
    tags = models.JSONField(default=list, blank=True)
    preco_avulso = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )
    eh_gratuito = models.BooleanField(default=False)
    eh_premium = models.BooleanField(default=False)
    arquivo_principal_key = models.CharField(
        max_length=500, blank=True, default='',
        help_text='Chave do objeto no R2 (ex: projetos/abc123/modelo.skp)'
    )
    preview_glb_key = models.CharField(
        max_length=500, blank=True, default='',
        help_text='Chave do preview 3D .glb no R2'
    )
    thumbnail = models.URLField(blank=True, default='')
    peso_mb = models.FloatField(default=0)
    downloads_count = models.PositiveIntegerField(default=0)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)
    publicado = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'Projeto'
        verbose_name_plural = 'Projetos'
        ordering = ('-criado_em',)

    def __str__(self):
        return self.titulo
