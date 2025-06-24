from django.test import TestCase
from .models import Producto, Tienda, StockTienda
from decimal import Decimal

class TestProductoBasico(TestCase):
    """Test básico para productos"""
    
    def test_crear_producto(self):
        """Test simple: crear un producto"""
        producto = Producto.objects.create(
            sku='TEST001',
            nombre='Martillo',
            precio=Decimal('25.00'),
            categoria='Herramientas'
        )
        
        # Verificar que se creó correctamente
        self.assertEqual(producto.nombre, 'Martillo')
        self.assertEqual(producto.precio, Decimal('25.00'))
        self.assertEqual(producto.categoria, 'Herramientas')
    
    def test_crear_tienda(self):
        """Test simple: crear una tienda"""
        tienda = Tienda.objects.create(
            nombre='Ferretería Central',
            direccion='Av. Principal 123',
            telefono='123456789'
        )
        
        # Verificar que se creó correctamente
        self.assertEqual(tienda.nombre, 'Ferretería Central')
        self.assertTrue(tienda.activa)  # Por defecto debe estar activa
    
    def test_crear_stock(self):
        """Test simple: crear stock"""
        # Crear producto y tienda
        producto = Producto.objects.create(
            sku='STOCK001',
            nombre='Destornillador',
            precio=Decimal('15.00'),
            categoria='Herramientas'
        )
        
        tienda = Tienda.objects.create(
            nombre='Tienda Test',
            direccion='Dirección Test',
            telefono='987654321'
        )
        
        # Crear stock
        stock = StockTienda.objects.create(
            producto=producto,
            tienda=tienda,
            cantidad=10
        )
        
        # Verificar que se creó correctamente
        self.assertEqual(stock.cantidad, 10)
        self.assertEqual(stock.producto, producto)
        self.assertEqual(stock.tienda, tienda) 