from django.test import TestCase
from .models import Producto, Tienda, StockTienda
from decimal import Decimal

class TestProductoBasico(TestCase):
    """
    TestCase básico para el módulo de productos.
    
    Este conjunto de pruebas verifica la funcionalidad básica de los modelos:
    - Producto: Creación y validación de productos
    - Tienda: Creación y validación de tiendas  
    - StockTienda: Gestión de inventario por tienda
    
    Los tests son simples y se enfocan en verificar que los modelos
    funcionan correctamente con datos válidos.
    """
    
    def test_crear_producto(self):
        """
        Prueba la creación básica de un producto.
        
        Verifica que:
        - Se puede crear un producto con datos mínimos requeridos
        - Los campos se guardan correctamente en la base de datos
        - Los valores por defecto se asignan correctamente
        
        Datos de prueba:
        - SKU: TEST001
        - Nombre: Martillo
        - Precio: $25.00
        - Categoría: Herramientas
        """
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
        """
        Prueba la creación básica de una tienda.
        
        Verifica que:
        - Se puede crear una tienda con datos mínimos requeridos
        - Los campos se guardan correctamente en la base de datos
        - El campo 'activa' se establece en True por defecto
        
        Datos de prueba:
        - Nombre: Ferretería Central
        - Dirección: Av. Principal 123
        - Teléfono: 123456789
        """
        tienda = Tienda.objects.create(
            nombre='Ferretería Central',
            direccion='Av. Principal 123',
            telefono='123456789'
        )
        
        # Verificar que se creó correctamente
        self.assertEqual(tienda.nombre, 'Ferretería Central')
        self.assertTrue(tienda.activa)  # Por defecto debe estar activa
    
    def test_crear_stock(self):
        """
        Prueba la creación de stock asociando un producto con una tienda.
        
        Verifica que:
        - Se puede crear una relación de stock entre producto y tienda
        - La cantidad se guarda correctamente
        - Las relaciones entre modelos funcionan correctamente
        
        Datos de prueba:
        - Producto: Destornillador ($15.00)
        - Tienda: Tienda Test
        - Cantidad: 10 unidades
        """
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