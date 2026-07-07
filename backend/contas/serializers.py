from rest_framework import serializers
from .models import Usuario


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ('id', 'username', 'email', 'first_name', 'last_name',
                  'telefone', 'cpf_cnpj', 'endereco', 'cep', 'eh_assinante_ativo')
        read_only_fields = ('eh_assinante_ativo',)


class CadastroSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = Usuario
        fields = ('username', 'email', 'password', 'first_name', 'last_name',
                  'telefone', 'cpf_cnpj', 'endereco', 'cep')

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = Usuario(**validated_data)
        user.set_password(password)
        user.save()
        return user
