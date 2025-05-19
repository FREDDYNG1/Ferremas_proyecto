from rest_framework import serializers
from .models import Producto

class ProductoSerializer(serializers.ModelSerializer):
    precio = serializers.FloatField()
    imagen_url = serializers.SerializerMethodField()

    class Meta:
        model = Producto
        fields = ['id', 'sku', 'nombre', 'descripcion', 'precio', 'stock', 'categoria', 'marca', 'imagen', 'imagen_url', 'fecha_creacion', 'fecha_actualizacion']

    def get_imagen_url(self, obj):
        if obj.imagen:
            return self.context['request'].build_absolute_uri(obj.imagen.url)
        return None
