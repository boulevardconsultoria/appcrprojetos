from django.contrib import admin
from .models import Plano, Assinatura


@admin.register(Plano)
class PlanoAdmin(admin.ModelAdmin):
    list_display = ('nome', 'valor', 'periodicidade', 'ativo')


@admin.register(Assinatura)
class AssinaturaAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'plano', 'status', 'data_inicio', 'data_fim')
    list_filter = ('status',)
