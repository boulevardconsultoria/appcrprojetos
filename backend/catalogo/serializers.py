from rest_framework import serializers
from .models import Categoria, Projeto


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'


class ProjetoListSerializer(serializers.ModelSerializer):
    categoria_nome = serializers.CharField(
        source='categoria.nome', read_only=True
    )

    class Meta:
        model = Projeto
        fields = (
            'id', 'titulo', 'slug', 'descricao', 'categoria',
            'categoria_nome', 'tags', 'eh_gratuito', 'eh_premium',
            'thumbnail', 'peso_mb', 'downloads_count', 'criado_em',
        )


class ProjetoDetailSerializer(serializers.ModelSerializer):
    categoria_nome = serializers.CharField(
        source='categoria.nome', read_only=True
    )

    class Meta:
        model = Projeto
        fields = (
            'id', 'titulo', 'slug', 'descricao', 'categoria',
            'categoria_nome', 'tags', 'preco_avulso', 'eh_gratuito',
            'eh_premium', 'thumbnail', 'peso_mb', 'downloads_count',
            'criado_em', 'atualizado_em',
        )
        read_only_fields = ('downloads_count',)


class ProjetoAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Projeto
        fields = '__all__'
