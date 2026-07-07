from django.contrib import admin
from .models import Categoria, Projeto


@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('nome',)}
    list_display = ('nome', 'slug')


@admin.register(Projeto)
class ProjetoAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('titulo',)}
    list_display = ('titulo', 'categoria', 'eh_gratuito', 'eh_premium', 'publicado', 'downloads_count')
    list_filter = ('publicado', 'eh_gratuito', 'eh_premium', 'categoria')
    search_fields = ('titulo', 'descricao')
