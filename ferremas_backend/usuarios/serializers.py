from rest_framework import serializers
from .models import CustomerUser

class CrearUsuarioPorAdminSerializer(serializers.ModelSerializer):
    rol = serializers.CharField(write_only=True)
    rut = serializers.CharField(write_only=True, required=False)

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerUser
        fields = [
            'id', 'first_name', 'last_name', 'email', 'password',
            'direccion', 'comuna', 'ciudad', 'telefono'
        ]
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        email = validated_data['email']
        username = email.split('@')[0]

        user = CustomerUser(
            username=username,
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            email=email,
            direccion=validated_data['direccion'],
            comuna=validated_data['comuna'],
            ciudad=validated_data['ciudad'],
            telefono=validated_data['telefono'],
            role='cliente',
            is_active=True
        )
        user.set_password(validated_data['password'])
        user.save()
        return user
