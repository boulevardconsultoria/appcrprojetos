from rest_framework import serializers
from .models import Download
from catalogo.serializers import ProjetoListSerializer


class DownloadSerializer(serializers.ModelSerializer):
    projeto = ProjetoListSerializer(read_only=True)
    projeto_id = serializers.UUIDField(write_only=True)

    class Meta:
        model = Download
        fields = ('id', 'usuario', 'projeto', 'projeto_id', 'timestamp')
        read_only_fields = ('usuario', 'timestamp')

    def create(self, validated_data):
        validated_data['usuario'] = self.context['request'].user
        return super().create(validated_data)
