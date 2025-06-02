from rest_framework import serializers
from productos.models import Producto, Tienda, StockTienda
from config.supabase_config import upload_file, delete_file
import time

class TiendaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tienda
        fields = ['id', 'nombre', 'direccion', 'telefono', 'email', 'activa', 'fecha_creacion', 'fecha_actualizacion']

class StockTiendaSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)
    tienda_nombre = serializers.CharField(source='tienda.nombre', read_only=True)

    class Meta:
        model = StockTienda
        fields = ['id', 'producto', 'tienda', 'producto_nombre', 'tienda_nombre', 'cantidad', 'stock_minimo', 'fecha_actualizacion']
        read_only_fields = ['fecha_actualizacion']

class ProductoSerializer(serializers.ModelSerializer):
    precio = serializers.FloatField()
    imagen = serializers.ImageField(write_only=True, required=False)
    imagen_url = serializers.SerializerMethodField()
    stock_por_tienda = StockTiendaSerializer(source='stocktienda_set', many=True, read_only=True)
    stock_total = serializers.SerializerMethodField()

    class Meta:
        model = Producto
        fields = ['id', 'sku', 'nombre', 'descripcion', 'precio', 'categoria', 'marca', 'imagen', 'imagen_url', 'stock_por_tienda', 'stock_total', 'fecha_creacion', 'fecha_actualizacion']

    def get_stock_total(self, obj):
        return sum(stock.cantidad for stock in obj.stocktienda_set.all())

    def get_imagen_url(self, obj):
        if obj.imagen_url:
            # Añadir timestamp para evitar caché
            timestamp = int(time.time())
            return f"{obj.imagen_url}?v={timestamp}"
        return None

    def create(self, validated_data):
        imagen = validated_data.pop('imagen', None)
        producto = Producto.objects.create(**validated_data)
        
        if imagen:
            try:
                # Subir imagen a Supabase
                imagen_url = upload_file(imagen)
                if imagen_url:
                    producto.imagen_url = imagen_url
                    producto.save()
            except Exception as e:
                print(f"Error al subir imagen: {str(e)}")
        
        return producto

    def update(self, instance, validated_data):
        imagen = validated_data.pop('imagen', None)
        
        # Si hay una nueva imagen, eliminar la anterior y subir la nueva
        if imagen:
            try:
                # Eliminar imagen anterior si existe
                if instance.imagen_url:
                    delete_file(instance.imagen_url)
                
                # Subir nueva imagen
                imagen_url = upload_file(imagen)
                if imagen_url:
                    instance.imagen_url = imagen_url
            except Exception as e:
                print(f"Error al actualizar imagen: {str(e)}")
        
        # Actualizar el resto de los campos
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance
stock_por_tienda = StockTiendaSerializer(source='stocktienda_set', many=True, read_only=True)
stock_total = serializers.SerializerMethodField()

def get_stock_total(self, obj):
    return sum(stock.cantidad for stock in obj.stocktienda_set.all())