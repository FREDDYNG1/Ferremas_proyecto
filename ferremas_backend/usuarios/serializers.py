from rest_framework import serializers
from .models import CustomerUser

class CrearUsuarioPorAdminSerializer(serializers.ModelSerializer):
    rol = serializers.CharField(write_only=True)
    rut = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = CustomerUser
        fields = [
            'first_name', 'last_name', 'email', 'password',
            'direccion', 'comuna', 'ciudad', 'telefono',
            'rol', 'rut'
        ]
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        # Extraer campos personalizados
        role = validated_data.pop('rol')
        rut = validated_data.pop('rut', None)
        email = validated_data.pop('email')

        # Generar username basado en el email
        username = email.split('@')[0]

        # Crear usuario
        user = CustomerUser(
            username=username,
            role=role,
            email=email,
            **validated_data
        )
        user.set_password(validated_data['password'])
        user.save()

        # Puedes usar el RUT si tienes lógica adicional o guardarlo en otro modelo
        return user


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerUser
        fields = [
            'id', 'username', 'first_name', 'last_name', 'email', 'password',
            'direccion', 'comuna', 'ciudad', 'telefono', 'role'
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
