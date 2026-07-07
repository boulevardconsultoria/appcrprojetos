from rest_framework import serializers
from .models import Plano, Assinatura


class PlanoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plano
        fields = '__all__'


class AssinaturaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assinatura
        fields = '__all__'
        read_only_fields = ('usuario', 'gateway_id', 'criada_em')
