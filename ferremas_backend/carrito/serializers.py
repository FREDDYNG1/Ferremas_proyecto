from rest_framework import serializers
from .models import Carrito, ItemCarrito, Orden, ItemOrden # Importar modelos locales
from productos.models import Producto # Importar Producto desde la app productos

class ItemCarritoSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)
    producto_precio = serializers.FloatField(source='producto.precio', read_only=True)
    producto_imagen_url = serializers.URLField(source='producto.imagen_url', read_only=True)
    subtotal = serializers.ReadOnlyField()

    class Meta:
        model = ItemCarrito
        fields = ['id', 'producto', 'producto_nombre', 'producto_precio', 'producto_imagen_url', 'cantidad', 'subtotal']
        read_only_fields = ['fecha_añadido']

class CarritoSerializer(serializers.ModelSerializer):
    items = ItemCarritoSerializer(many=True, read_only=True)
    total = serializers.ReadOnlyField()

    class Meta:
        model = Carrito
        fields = ['id', 'usuario', 'items', 'total', 'fecha_creacion', 'fecha_actualizacion']
        read_only_fields = ['fecha_creacion', 'fecha_actualizacion']

class ItemOrdenSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)
    subtotal = serializers.ReadOnlyField()

    class Meta:
        model = ItemOrden
        fields = ['id', 'producto', 'producto_nombre', 'cantidad', 'precio_unitario', 'subtotal']

class OrdenSerializer(serializers.ModelSerializer):
    items = ItemOrdenSerializer(many=True, read_only=True)

    class Meta:
        model = Orden
        fields = [
            'id', 'usuario', 'fecha_creacion', 'fecha_actualizacion',
            'estado', 'total', 'nombre', 'email', 'telefono',
            'direccion', 'ciudad', 'codigo_postal', 'metodo_pago',
            'payment_id', 'items'
        ]
        read_only_fields = ['id', 'fecha_creacion', 'fecha_actualizacion', 'estado', 'payment_id']