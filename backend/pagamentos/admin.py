from django.contrib import admin
from .models import CompraAvulsa


@admin.register(CompraAvulsa)
class CompraAvulsaAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'projeto', 'valor_pago', 'status', 'criada_em')
    list_filter = ('status',)
