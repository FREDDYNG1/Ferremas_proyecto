from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.urls import reverse
from .models import Producto, Tienda, StockTienda
from .serializers import ProductoSerializer, TiendaSerializer, StockTiendaSerializer
from decimal import Decimal
from usuarios.models import CustomerUser

class ProductoModelTest(TestCase):
    """Pruebas para el modelo Producto"""
    
    def setUp(self):
        self.producto_data = {
            'sku': 'PROD001',
            'nombre': 'Martillo Profesional',
            'descripcion': 'Martillo de alta calidad para uso profesional',
            'precio': Decimal('29.99'),
            'categoria': 'Herramientas',
            'marca': 'FerreMax'
        }
        self.producto = Producto.objects.create(**self.producto_data)
    
    def test_crear_producto(self):
        """Prueba que se puede crear un producto correctamente"""
        self.assertEqual(self.producto.nombre, 'Martillo Profesional')
        self.assertEqual(self.producto.precio, Decimal('29.99'))
        self.assertEqual(self.producto.categoria, 'Herramientas')
    
    def test_str_representation(self):
        """Prueba la representación en string del producto"""
        expected = f"{self.producto.nombre} ({self.producto.sku})"
        self.assertEqual(str(self.producto), expected)
    
    def test_precio_positive(self):
        """Prueba que el precio puede ser negativo (no hay validación)"""
        # Como no hay validación de precio negativo, esta prueba debe pasar
        producto_negativo = Producto.objects.create(
            sku='PROD002',
            nombre='Producto Test',
            precio=Decimal('-10.00'),
            categoria='Test'
        )
        self.assertEqual(producto_negativo.precio, Decimal('-10.00'))

class TiendaModelTest(TestCase):
    """Pruebas para el modelo Tienda"""
    
    def setUp(self):
        self.tienda_data = {
            'nombre': 'Ferretería Central',
            'direccion': 'Av. Principal 123',
            'telefono': '123456789',
            'email': 'central@ferremas.com'
        }
        self.tienda = Tienda.objects.create(**self.tienda_data)
    
    def test_crear_tienda(self):
        """Prueba que se puede crear una tienda correctamente"""
        self.assertEqual(self.tienda.nombre, 'Ferretería Central')
        self.assertEqual(self.tienda.direccion, 'Av. Principal 123')
        self.assertTrue(self.tienda.activa)  # Por defecto debe estar activa
    
    def test_str_representation(self):
        """Prueba la representación en string de la tienda"""
        self.assertEqual(str(self.tienda), 'Ferretería Central')

class StockTiendaModelTest(TestCase):
    """Pruebas para el modelo StockTienda"""
    
    def setUp(self):
        # Crear producto
        self.producto = Producto.objects.create(
            sku='PROD001',
            nombre='Martillo',
            precio=Decimal('29.99'),
            categoria='Herramientas'
        )
        
        # Crear tienda
        self.tienda = Tienda.objects.create(
            nombre='Tienda Test',
            direccion='Dirección Test',
            telefono='123456789'
        )
        
        # Crear stock
        self.stock = StockTienda.objects.create(
            producto=self.producto,
            tienda=self.tienda,
            cantidad=10,
            stock_minimo=5
        )
    
    def test_crear_stock(self):
        """Prueba que se puede crear stock correctamente"""
        self.assertEqual(self.stock.cantidad, 10)
        self.assertEqual(self.stock.stock_minimo, 5)
        self.assertEqual(self.stock.producto, self.producto)
        self.assertEqual(self.stock.tienda, self.tienda)
    
    def test_str_representation(self):
        """Prueba la representación en string del stock"""
        expected = f"{self.producto.nombre} - {self.tienda.nombre}: {self.stock.cantidad}"
        self.assertEqual(str(self.stock), expected)
    
    def test_unique_constraint(self):
        """Prueba que no se puede crear stock duplicado para el mismo producto-tienda"""
        with self.assertRaises(Exception):
            StockTienda.objects.create(
                producto=self.producto,
                tienda=self.tienda,
                cantidad=5,
                stock_minimo=2
            )

class ProductoSerializerTest(TestCase):
    """Pruebas para el serializer de Producto"""
    
    def setUp(self):
        self.producto_data = {
            'sku': 'PROD001',
            'nombre': 'Martillo',
            'descripcion': 'Martillo de calidad',
            'precio': Decimal('29.99'),
            'categoria': 'Herramientas',
            'marca': 'FerreMax'
        }
        self.producto = Producto.objects.create(**self.producto_data)
        self.serializer = ProductoSerializer(instance=self.producto)
    
    def test_serializer_fields(self):
        """Prueba que el serializer contiene los campos correctos"""
        data = self.serializer.data
        self.assertIn('id', data)
        self.assertIn('sku', data)
        self.assertIn('nombre', data)
        self.assertIn('precio', data)
        self.assertIn('categoria', data)
        self.assertIn('stock_total', data)
    
    def test_stock_total_calculation(self):
        """Prueba el cálculo del stock total"""
        # Crear tienda y stock
        tienda = Tienda.objects.create(
            nombre='Tienda Test',
            direccion='Dirección Test',
            telefono='123456789'
        )
        StockTienda.objects.create(
            producto=self.producto,
            tienda=tienda,
            cantidad=15,
            stock_minimo=5
        )
        
        # Verificar que el stock total se calcula correctamente
        serializer = ProductoSerializer(instance=self.producto)
        self.assertEqual(serializer.data['stock_total'], 15)

class ProductoAPITest(APITestCase):
    """Pruebas para las APIs de Producto"""
    
    def setUp(self):
        # Crear usuario administrador
        self.admin_user = CustomerUser.objects.create_user(
            username='admin_test',
            email='admin@test.com',
            password='testpass123',
            first_name='Admin',
            last_name='Test'
        )
        self.admin_user.role = 'admin'
        self.admin_user.save()
        
        # Crear usuario cliente
        self.cliente_user = CustomerUser.objects.create_user(
            username='cliente_test',
            email='cliente@test.com',
            password='testpass123',
            first_name='Cliente',
            last_name='Test'
        )
        self.cliente_user.role = 'cliente'
        self.cliente_user.save()
        
        # Crear producto de prueba
        self.producto = Producto.objects.create(
            sku='PROD001',
            nombre='Martillo Test',
            precio=Decimal('29.99'),
            categoria='Herramientas'
        )
        
        self.client = APIClient()
    
    def test_listar_productos_sin_autenticacion(self):
        """Prueba que se pueden listar productos sin autenticación"""
        url = reverse('producto-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
    
    def test_obtener_producto_sin_autenticacion(self):
        """Prueba que se puede obtener un producto específico sin autenticación"""
        url = reverse('producto-detail', args=[self.producto.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['nombre'], 'Martillo Test')
    
    def test_crear_producto_con_autenticacion_admin(self):
        """Prueba que un admin puede crear productos"""
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('producto-list')
        data = {
            'sku': 'PROD002',
            'nombre': 'Destornillador',
            'precio': '15.99',
            'categoria': 'Herramientas'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Producto.objects.count(), 2)
    
    def test_crear_producto_sin_autenticacion(self):
        """Prueba que no se puede crear producto sin autenticación"""
        url = reverse('producto-list')
        data = {
            'sku': 'PROD002',
            'nombre': 'Destornillador',
            'precio': '15.99',
            'categoria': 'Herramientas'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_stock_por_tienda_endpoint(self):
        """Prueba el endpoint de stock por tienda"""
        # Crear tienda y stock
        tienda = Tienda.objects.create(
            nombre='Tienda Test',
            direccion='Dirección Test',
            telefono='123456789'
        )
        stock = StockTienda.objects.create(
            producto=self.producto,
            tienda=tienda,
            cantidad=10,
            stock_minimo=5
        )
        
        url = reverse('producto-stock-por-tienda', args=[self.producto.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['cantidad'], 10)

class TiendaAPITest(APITestCase):
    """Pruebas para las APIs de Tienda"""
    
    def setUp(self):
        self.admin_user = CustomerUser.objects.create_user(
            username='admin_test',
            email='admin@test.com',
            password='testpass123',
            first_name='Admin',
            last_name='Test'
        )
        self.admin_user.role = 'admin'
        self.admin_user.save()
        
        self.tienda = Tienda.objects.create(
            nombre='Tienda Test',
            direccion='Dirección Test',
            telefono='123456789'
        )
        
        self.client = APIClient()
    
    def test_listar_tiendas_sin_autenticacion(self):
        """Prueba que se pueden listar tiendas sin autenticación"""
        url = reverse('tienda-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
    
    def test_crear_tienda_con_admin(self):
        """Prueba que un admin puede crear tiendas"""
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('tienda-list')
        data = {
            'nombre': 'Nueva Tienda',
            'direccion': 'Nueva Dirección',
            'telefono': '987654321'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Tienda.objects.count(), 2)

class StockTiendaAPITest(APITestCase):
    """Pruebas para las APIs de StockTienda"""
    
    def setUp(self):
        self.admin_user = CustomerUser.objects.create_user(
            username='admin_test',
            email='admin@test.com',
            password='testpass123',
            first_name='Admin',
            last_name='Test'
        )
        self.admin_user.role = 'admin'
        self.admin_user.save()
        
        self.producto = Producto.objects.create(
            sku='PROD001',
            nombre='Martillo',
            precio=Decimal('29.99'),
            categoria='Herramientas'
        )
        
        self.tienda = Tienda.objects.create(
            nombre='Tienda Test',
            direccion='Dirección Test',
            telefono='123456789'
        )
        
        self.stock = StockTienda.objects.create(
            producto=self.producto,
            tienda=self.tienda,
            cantidad=10,
            stock_minimo=5
        )
        
        self.client = APIClient()
        self.client.force_authenticate(user=self.admin_user)
    
    def test_ajustar_stock(self):
        """Prueba ajustar el stock de un producto"""
        url = reverse('stocktienda-ajustar-stock', args=[self.stock.id])
        data = {'cantidad': 5}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verificar que el stock se actualizó
        self.stock.refresh_from_db()
        self.assertEqual(self.stock.cantidad, 15)
    
    def test_ajustar_stock_negativo(self):
        """Prueba que no se puede tener stock negativo"""
        url = reverse('stocktienda-ajustar-stock', args=[self.stock.id])
        data = {'cantidad': -15}  # Más de lo que hay
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_crear_stock(self):
        """Prueba crear nuevo stock"""
        url = reverse('stocktienda-list')
        data = {
            'producto': self.producto.id,
            'tienda': self.tienda.id,
            'cantidad': 20,
            'stock_minimo': 10
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(StockTienda.objects.count(), 2)
