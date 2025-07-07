# 8. Pruebas

## Información General

El sistema Ferremas incluye un conjunto completo de pruebas para garantizar la calidad y funcionalidad del código. Las pruebas están organizadas por componentes y cubren diferentes niveles de testing.

## Estructura de Pruebas

### Backend (Django/Python)

```
ferremas_backend/
├── productos/
│   └── tests.py          # Pruebas de productos
├── usuarios/
│   └── tests.py          # Pruebas de usuarios
├── carrito/
│   └── tests.py          # Pruebas de carrito
├── conversor_monedas/
│   └── tests.py          # Pruebas de conversión de monedas
├── contacto/
│   └── tests.py          # Pruebas de contacto
└── TESTS_DOCUMENTATION.md # Documentación de pruebas
```

### Frontend (React/JavaScript)

```
ferremas_frontend/
├── src/
│   ├── __tests__/        # Pruebas unitarias
│   └── components/
│       └── __tests__/    # Pruebas de componentes
└── cypress/              # Pruebas E2E (futuro)
```

## Pruebas Unitarias

### 1. Pruebas de Productos

#### Clase: `TestProductoBasico`

**Propósito**: Verificar la funcionalidad básica de los modelos de productos.

```python
# productos/tests.py
from django.test import TestCase
from django.core.exceptions import ValidationError
from .models import Producto, Tienda, StockTienda

class TestProductoBasico(TestCase):
    """Pruebas básicas para el modelo Producto"""
    
    def setUp(self):
        """Configuración inicial para las pruebas"""
        self.tienda = Tienda.objects.create(
            nombre="Ferretería Central",
            direccion="Av. Principal 123",
            telefono="+56912345678",
            email="central@ferremas.com"
        )
    
    def test_crear_producto(self):
        """Verifica la creación de productos con datos mínimos"""
        producto = Producto.objects.create(
            sku="MART001",
            nombre="Martillo Profesional",
            descripcion="Martillo de acero inoxidable",
            precio=25.99,
            categoria="Herramientas"
        )
        
        self.assertEqual(producto.sku, "MART001")
        self.assertEqual(producto.nombre, "Martillo Profesional")
        self.assertEqual(producto.precio, 25.99)
        self.assertTrue(producto.is_active)
    
    def test_crear_tienda(self):
        """Verifica la creación de tiendas"""
        tienda = Tienda.objects.create(
            nombre="Ferretería Norte",
            direccion="Calle Norte 456",
            telefono="+56987654321",
            email="norte@ferremas.com"
        )
        
        self.assertEqual(tienda.nombre, "Ferretería Norte")
        self.assertTrue(tienda.activa)
    
    def test_crear_stock(self):
        """Verifica la relación entre productos y tiendas"""
        producto = Producto.objects.create(
            sku="DEST001",
            nombre="Destornillador Phillips",
            precio=12.50,
            categoria="Herramientas"
        )
        
        stock = StockTienda.objects.create(
            producto=producto,
            tienda=self.tienda,
            cantidad=10
        )
        
        self.assertEqual(stock.cantidad, 10)
        self.assertEqual(stock.producto, producto)
        self.assertEqual(stock.tienda, self.tienda)
    
    def test_validacion_precio_negativo(self):
        """Verifica que no se permitan precios negativos"""
        with self.assertRaises(ValidationError):
            producto = Producto(
                sku="TEST001",
                nombre="Producto Test",
                precio=-10.00,
                categoria="Test"
            )
            producto.full_clean()
    
    def test_validacion_sku_unico(self):
        """Verifica que el SKU sea único"""
        Producto.objects.create(
            sku="UNICO001",
            nombre="Producto 1",
            precio=10.00,
            categoria="Test"
        )
        
        with self.assertRaises(Exception):
            Producto.objects.create(
                sku="UNICO001",
                nombre="Producto 2",
                precio=20.00,
                categoria="Test"
            )
```

#### Clase: `TestProductoAPI`

**Propósito**: Verificar los endpoints de la API de productos.

```python
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Producto, Tienda

class TestProductoAPI(APITestCase):
    """Pruebas para la API de productos"""
    
    def setUp(self):
        """Configuración inicial"""
        self.user = get_user_model().objects.create_user(
            username='admin',
            password='admin123',
            email='admin@test.com',
            rol='admin'
        )
        self.client.force_authenticate(user=self.user)
        
        self.producto = Producto.objects.create(
            sku="API001",
            nombre="Producto API Test",
            precio=15.99,
            categoria="Test"
        )
    
    def test_listar_productos(self):
        """Verifica el endpoint de listar productos"""
        url = '/api/productos/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)
        self.assertEqual(len(response.data['results']), 1)
    
    def test_crear_producto(self):
        """Verifica el endpoint de crear producto"""
        url = '/api/productos/'
        data = {
            'sku': 'NUEVO001',
            'nombre': 'Nuevo Producto',
            'descripcion': 'Descripción del nuevo producto',
            'precio': 29.99,
            'categoria': 'Herramientas'
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Producto.objects.count(), 2)
    
    def test_actualizar_producto(self):
        """Verifica el endpoint de actualizar producto"""
        url = f'/api/productos/{self.producto.id}/'
        data = {
            'sku': 'API001',
            'nombre': 'Producto Actualizado',
            'precio': 19.99,
            'categoria': 'Test'
        }
        
        response = self.client.put(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.producto.refresh_from_db()
        self.assertEqual(self.producto.nombre, 'Producto Actualizado')
        self.assertEqual(self.producto.precio, 19.99)
    
    def test_eliminar_producto(self):
        """Verifica el endpoint de eliminar producto"""
        url = f'/api/productos/{self.producto.id}/'
        response = self.client.delete(url)
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Producto.objects.count(), 0)
    
    def test_acceso_sin_autenticacion(self):
        """Verifica que se requiera autenticación para operaciones sensibles"""
        self.client.force_authenticate(user=None)
        
        url = '/api/productos/'
        data = {'sku': 'TEST001', 'nombre': 'Test', 'precio': 10.00}
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
```

### 2. Pruebas de Usuarios

#### Clase: `TestUsuarioModel`

**Propósito**: Verificar la funcionalidad del modelo de usuarios.

```python
# usuarios/tests.py
from django.test import TestCase
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError

class TestUsuarioModel(TestCase):
    """Pruebas para el modelo de usuarios"""
    
    def test_crear_usuario_cliente(self):
        """Verifica la creación de usuarios cliente"""
        user = get_user_model().objects.create_user(
            username='cliente1',
            email='cliente@test.com',
            password='cliente123',
            first_name='Juan',
            last_name='Pérez',
            rol='cliente'
        )
        
        self.assertEqual(user.username, 'cliente1')
        self.assertEqual(user.rol, 'cliente')
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
    
    def test_crear_usuario_admin(self):
        """Verifica la creación de usuarios administradores"""
        user = get_user_model().objects.create_user(
            username='admin1',
            email='admin@test.com',
            password='admin123',
            first_name='Admin',
            last_name='Sistema',
            rol='admin'
        )
        
        self.assertEqual(user.rol, 'admin')
        self.assertTrue(user.is_active)
    
    def test_validacion_email_unico(self):
        """Verifica que el email sea único"""
        get_user_model().objects.create_user(
            username='user1',
            email='test@test.com',
            password='test123'
        )
        
        with self.assertRaises(Exception):
            get_user_model().objects.create_user(
                username='user2',
                email='test@test.com',
                password='test123'
            )
    
    def test_cambio_password(self):
        """Verifica el cambio de contraseña"""
        user = get_user_model().objects.create_user(
            username='testuser',
            email='test@test.com',
            password='oldpass123'
        )
        
        user.set_password('newpass123')
        user.save()
        
        self.assertTrue(user.check_password('newpass123'))
        self.assertFalse(user.check_password('oldpass123'))
```

#### Clase: `TestUsuarioAPI`

**Propósito**: Verificar los endpoints de la API de usuarios.

```python
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model

class TestUsuarioAPI(APITestCase):
    """Pruebas para la API de usuarios"""
    
    def setUp(self):
        """Configuración inicial"""
        self.admin_user = get_user_model().objects.create_user(
            username='admin',
            password='admin123',
            email='admin@test.com',
            rol='admin'
        )
        
        self.cliente_user = get_user_model().objects.create_user(
            username='cliente',
            password='cliente123',
            email='cliente@test.com',
            rol='cliente'
        )
    
    def test_registro_usuario(self):
        """Verifica el endpoint de registro de usuarios"""
        url = '/api/usuarios/registro/'
        data = {
            'username': 'nuevo',
            'email': 'nuevo@test.com',
            'password': 'nuevo123',
            'password2': 'nuevo123',
            'first_name': 'Nuevo',
            'last_name': 'Usuario',
            'telefono': '+56912345678'
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(get_user_model().objects.count(), 3)
    
    def test_login_usuario(self):
        """Verifica el endpoint de login"""
        url = '/api/usuarios/login/'
        data = {
            'username': 'cliente',
            'password': 'cliente123'
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertIn('user', response.data)
    
    def test_perfil_usuario(self):
        """Verifica el endpoint de perfil de usuario"""
        self.client.force_authenticate(user=self.cliente_user)
        url = '/api/usuarios/perfil/'
        
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'cliente')
        self.assertEqual(response.data['rol'], 'cliente')
    
    def test_cambiar_password(self):
        """Verifica el endpoint de cambio de contraseña"""
        self.client.force_authenticate(user=self.cliente_user)
        url = '/api/usuarios/cambiar-password/'
        data = {
            'old_password': 'cliente123',
            'new_password': 'nueva123',
            'new_password2': 'nueva123'
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.cliente_user.refresh_from_db()
        self.assertTrue(self.cliente_user.check_password('nueva123'))
    
    def test_listar_usuarios_admin(self):
        """Verifica que solo los admin puedan listar usuarios"""
        self.client.force_authenticate(user=self.admin_user)
        url = '/api/usuarios/'
        
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verificar que cliente no puede acceder
        self.client.force_authenticate(user=self.cliente_user)
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
```

### 3. Pruebas de Conversión de Monedas

#### Clase: `ConversorMonedasTestCase`

**Propósito**: Verificar la funcionalidad del conversor de monedas.

```python
# conversor_monedas/tests.py
from django.test import TestCase
from unittest.mock import patch, Mock
from .api import convertir_moneda, obtener_tasas_cambio

class ConversorMonedasTestCase(TestCase):
    """Pruebas para el conversor de monedas"""
    
    @patch('conversor_monedas.api.requests.get')
    def test_convertir_monedas_basicas(self, mock_get):
        """Verifica conversiones básicas entre monedas"""
        # Mock de respuesta exitosa
        mock_response = Mock()
        mock_response.json.return_value = {
            'result': 'success',
            'conversion_rates': {
                'USD': 1.0,
                'EUR': 0.90,
                'CLP': 900.0
            }
        }
        mock_get.return_value = mock_response
        
        # Prueba 1: USD a EUR
        resultado = convertir_moneda(100, 'USD', 'EUR')
        self.assertEqual(resultado, 90.0)
        
        # Prueba 2: USD a CLP
        resultado = convertir_moneda(2, 'USD', 'CLP')
        self.assertEqual(resultado, 1800.0)
        
        # Prueba 3: EUR a USD
        mock_response.json.return_value = {
            'result': 'success',
            'conversion_rates': {
                'EUR': 1.0,
                'USD': 1.11
            }
        }
        resultado = convertir_moneda(10, 'EUR', 'USD')
        self.assertEqual(resultado, 11.1)
        
        # Prueba 4: CLP a USD
        mock_response.json.return_value = {
            'result': 'success',
            'conversion_rates': {
                'CLP': 1.0,
                'USD': 0.0011
            }
        }
        resultado = convertir_moneda(1000, 'CLP', 'USD')
        self.assertEqual(resultado, 1.1)
        
        # Prueba 5: Moneda no disponible
        mock_response.json.return_value = {
            'result': 'success',
            'conversion_rates': {
                'USD': 1.0
            }
        }
        resultado = convertir_moneda(100, 'USD', 'XXX')
        self.assertIsNone(resultado)
    
    @patch('conversor_monedas.api.requests.get')
    def test_obtener_tasas_cambio(self, mock_get):
        """Verifica la obtención de tasas de cambio"""
        mock_response = Mock()
        mock_response.json.return_value = {
            'result': 'success',
            'base_code': 'USD',
            'conversion_rates': {
                'USD': 1.0,
                'EUR': 0.90,
                'CLP': 900.0
            }
        }
        mock_get.return_value = mock_response
        
        tasas = obtener_tasas_cambio('USD')
        
        self.assertIsNotNone(tasas)
        self.assertEqual(tasas['result'], 'success')
        self.assertIn('conversion_rates', tasas)
    
    @patch('conversor_monedas.api.requests.get')
    def test_error_api(self, mock_get):
        """Verifica el manejo de errores de la API"""
        # Simular error de red
        mock_get.side_effect = Exception("Error de conexión")
        
        resultado = convertir_moneda(100, 'USD', 'EUR')
        self.assertIsNone(resultado)
        
        # Simular respuesta de error
        mock_response = Mock()
        mock_response.json.return_value = {
            'result': 'error',
            'error-type': 'invalid-key'
        }
        mock_get.side_effect = None
        mock_get.return_value = mock_response
        
        resultado = convertir_moneda(100, 'USD', 'EUR')
        self.assertIsNone(resultado)
    
    def test_validacion_parametros(self):
        """Verifica la validación de parámetros"""
        # Cantidad negativa
        resultado = convertir_moneda(-100, 'USD', 'EUR')
        self.assertIsNone(resultado)
        
        # Cantidad cero
        resultado = convertir_moneda(0, 'USD', 'EUR')
        self.assertIsNone(resultado)
        
        # Monedas vacías
        resultado = convertir_moneda(100, '', 'EUR')
        self.assertIsNone(resultado)
        
        resultado = convertir_moneda(100, 'USD', '')
        self.assertIsNone(resultado)
```

### 4. Pruebas de Carrito

#### Clase: `TestCarritoModel`

**Propósito**: Verificar la funcionalidad del modelo de carrito.

```python
# carrito/tests.py
from django.test import TestCase
from django.contrib.auth import get_user_model
from productos.models import Producto, Tienda
from .models import Carrito, Orden, ItemOrden

class TestCarritoModel(TestCase):
    """Pruebas para el modelo de carrito"""
    
    def setUp(self):
        """Configuración inicial"""
        self.user = get_user_model().objects.create_user(
            username='testuser',
            email='test@test.com',
            password='test123',
            rol='cliente'
        )
        
        self.producto = Producto.objects.create(
            sku='CART001',
            nombre='Producto Carrito',
            precio=25.99,
            categoria='Test'
        )
        
        self.tienda = Tienda.objects.create(
            nombre='Tienda Test',
            direccion='Dirección Test',
            telefono='+56912345678',
            email='test@tienda.com'
        )
    
    def test_crear_carrito(self):
        """Verifica la creación de un carrito"""
        carrito = Carrito.objects.create(
            usuario=self.user,
            estado='pendiente'
        )
        
        self.assertEqual(carrito.usuario, self.user)
        self.assertEqual(carrito.estado, 'pendiente')
        self.assertEqual(carrito.total, 0)
    
    def test_agregar_producto_carrito(self):
        """Verifica agregar productos al carrito"""
        carrito = Carrito.objects.create(
            usuario=self.user,
            estado='pendiente'
        )
        
        item = ItemOrden.objects.create(
            carrito=carrito,
            producto=self.producto,
            cantidad=2,
            precio_unitario=25.99
        )
        
        self.assertEqual(item.cantidad, 2)
        self.assertEqual(item.precio_unitario, 25.99)
        self.assertEqual(item.subtotal, 51.98)
        
        # Actualizar total del carrito
        carrito.calcular_total()
        self.assertEqual(carrito.total, 51.98)
    
    def test_crear_orden(self):
        """Verifica la creación de una orden"""
        orden = Orden.objects.create(
            usuario=self.user,
            estado='pendiente',
            total=25.99
        )
        
        self.assertEqual(orden.usuario, self.user)
        self.assertEqual(orden.estado, 'pendiente')
        self.assertEqual(orden.total, 25.99)
    
    def test_estados_carrito(self):
        """Verifica los diferentes estados del carrito"""
        carrito = Carrito.objects.create(
            usuario=self.user,
            estado='pendiente'
        )
        
        # Cambiar a completado
        carrito.estado = 'completado'
        carrito.save()
        
        self.assertEqual(carrito.estado, 'completado')
        
        # Cambiar a cancelado
        carrito.estado = 'cancelado'
        carrito.save()
        
        self.assertEqual(carrito.estado, 'cancelado')
```

### 5. Pruebas de Contacto

#### Clase: `TestContactoModel`

**Propósito**: Verificar la funcionalidad del modelo de contacto.

```python
# contacto/tests.py
from django.test import TestCase
from .models import MensajeContacto

class TestContactoModel(TestCase):
    """Pruebas para el modelo de contacto"""
    
    def test_crear_mensaje(self):
        """Verifica la creación de un mensaje de contacto"""
        mensaje = MensajeContacto.objects.create(
            nombre='Juan Pérez',
            email='juan@test.com',
            asunto='Consulta sobre productos',
            mensaje='Hola, necesito información sobre martillos.'
        )
        
        self.assertEqual(mensaje.nombre, 'Juan Pérez')
        self.assertEqual(mensaje.email, 'juan@test.com')
        self.assertEqual(mensaje.asunto, 'Consulta sobre productos')
        self.assertFalse(mensaje.leido)
    
    def test_marcar_como_leido(self):
        """Verifica marcar mensaje como leído"""
        mensaje = MensajeContacto.objects.create(
            nombre='Test User',
            email='test@test.com',
            asunto='Test',
            mensaje='Test message'
        )
        
        self.assertFalse(mensaje.leido)
        
        mensaje.leido = True
        mensaje.save()
        
        self.assertTrue(mensaje.leido)
    
    def test_validacion_email(self):
        """Verifica la validación del formato de email"""
        from django.core.exceptions import ValidationError
        
        with self.assertRaises(ValidationError):
            mensaje = MensajeContacto(
                nombre='Test',
                email='invalid-email',
                asunto='Test',
                mensaje='Test'
            )
            mensaje.full_clean()
```

## Pruebas de Integración

### 1. Flujo Completo de Compra

```python
# carrito/tests_integration.py
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from productos.models import Producto, Tienda
from carrito.models import Carrito, Orden

class TestFlujoCompra(TestCase):
    """Pruebas de integración para el flujo de compra"""
    
    def setUp(self):
        """Configuración inicial"""
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            username='cliente',
            password='cliente123',
            email='cliente@test.com',
            rol='cliente'
        )
        
        self.producto = Producto.objects.create(
            sku='INT001',
            nombre='Producto Integración',
            precio=50.00,
            categoria='Test'
        )
        
        self.tienda = Tienda.objects.create(
            nombre='Tienda Integración',
            direccion='Dirección Test',
            telefono='+56912345678',
            email='test@tienda.com'
        )
    
    def test_flujo_completo_compra(self):
        """Verifica el flujo completo de una compra"""
        # 1. Login del usuario
        login_data = {
            'username': 'cliente',
            'password': 'cliente123'
        }
        response = self.client.post('/api/usuarios/login/', login_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        # 2. Crear carrito
        carrito_data = {
            'productos': [
                {
                    'producto': self.producto.id,
                    'cantidad': 2
                }
            ]
        }
        response = self.client.post('/api/carritos/', carrito_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        carrito_id = response.data['id']
        
        # 3. Verificar carrito creado
        response = self.client.get(f'/api/carritos/{carrito_id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total'], 100.00)
        
        # 4. Proceder al checkout (simulado)
        checkout_data = {
            'carrito_id': carrito_id,
            'metodo_pago': 'mercadopago'
        }
        response = self.client.post('/api/carritos/checkout/', checkout_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # 5. Verificar que se creó la orden
        response = self.client.get('/api/carritos/user_orders/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        
        orden = response.data['results'][0]
        self.assertEqual(orden['total'], 100.00)
        self.assertEqual(orden['estado'], 'pendiente')
```

### 2. Integración con APIs Externas

```python
# tests_integration_apis.py
from django.test import TestCase
from unittest.mock import patch, Mock
from carrito.mercadopago_service import MercadoPagoService
from conversor_monedas.api import convertir_moneda

class TestIntegracionAPIs(TestCase):
    """Pruebas de integración con APIs externas"""
    
    @patch('mercadopago.SDK')
    def test_integracion_mercadopago(self, mock_sdk):
        """Verifica la integración con MercadoPago"""
        # Mock de respuesta exitosa
        mock_response = {
            'status': 201,
            'response': {
                'id': '1234567890',
                'init_point': 'https://www.mercadopago.com/checkout/v1/redirect?pref_id=1234567890'
            }
        }
        mock_sdk.return_value.preference.return_value.create.return_value = mock_response
        
        service = MercadoPagoService()
        items = [{'title': 'Test Product', 'quantity': 1, 'unit_price': 10.00}]
        
        result = service.create_preference(items)
        
        self.assertIsNotNone(result)
        self.assertEqual(result['preference_id'], '1234567890')
    
    @patch('conversor_monedas.api.requests.get')
    def test_integracion_exchangerate(self, mock_get):
        """Verifica la integración con ExchangeRate API"""
        mock_response = Mock()
        mock_response.json.return_value = {
            'result': 'success',
            'conversion_rates': {
                'USD': 1.0,
                'EUR': 0.90
            }
        }
        mock_get.return_value = mock_response
        
        resultado = convertir_moneda(100, 'USD', 'EUR')
        
        self.assertEqual(resultado, 90.0)
```

## Pruebas de Rendimiento

### 1. Pruebas de Carga

```python
# tests_performance.py
import time
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from productos.models import Producto

class TestPerformance(TestCase):
    """Pruebas de rendimiento"""
    
    def setUp(self):
        """Configuración inicial"""
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            username='perfuser',
            password='perf123',
            email='perf@test.com',
            rol='cliente'
        )
        
        # Crear múltiples productos para pruebas
        for i in range(100):
            Producto.objects.create(
                sku=f'PERF{i:03d}',
                nombre=f'Producto Performance {i}',
                precio=10.00 + i,
                categoria='Performance'
            )
    
    def test_rendimiento_lista_productos(self):
        """Verifica el rendimiento de listar productos"""
        start_time = time.time()
        
        response = self.client.get('/api/productos/')
        
        end_time = time.time()
        execution_time = end_time - start_time
        
        self.assertEqual(response.status_code, 200)
        self.assertLess(execution_time, 1.0)  # Debe ejecutarse en menos de 1 segundo
        self.assertEqual(len(response.data['results']), 20)  # Paginación por defecto
    
    def test_rendimiento_busqueda_productos(self):
        """Verifica el rendimiento de búsqueda de productos"""
        start_time = time.time()
        
        response = self.client.get('/api/productos/?search=Performance')
        
        end_time = time.time()
        execution_time = end_time - start_time
        
        self.assertEqual(response.status_code, 200)
        self.assertLess(execution_time, 0.5)  # Búsqueda debe ser rápida
    
    def test_rendimiento_conversion_monedas(self):
        """Verifica el rendimiento de conversión de monedas"""
        from conversor_monedas.api import convertir_moneda
        
        start_time = time.time()
        
        # Realizar múltiples conversiones
        for i in range(10):
            resultado = convertir_moneda(100 + i, 'USD', 'EUR')
        
        end_time = time.time()
        execution_time = end_time - start_time
        
        self.assertLess(execution_time, 2.0)  # 10 conversiones en menos de 2 segundos
```

## Pruebas de Seguridad

### 1. Pruebas de Autenticación

```python
# tests_security.py
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model

class TestSecurity(TestCase):
    """Pruebas de seguridad"""
    
    def setUp(self):
        """Configuración inicial"""
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            username='securityuser',
            password='security123',
            email='security@test.com',
            rol='cliente'
        )
        
        self.admin_user = get_user_model().objects.create_user(
            username='admin',
            password='admin123',
            email='admin@test.com',
            rol='admin'
        )
    
    def test_acceso_sin_autenticacion(self):
        """Verifica que endpoints protegidos requieran autenticación"""
        # Endpoint protegido
        response = self.client.get('/api/usuarios/perfil/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        # Endpoint público
        response = self.client.get('/api/productos/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_acceso_sin_permisos(self):
        """Verifica que se requieran permisos específicos"""
        # Login como cliente
        login_data = {'username': 'securityuser', 'password': 'security123'}
        response = self.client.post('/api/usuarios/login/', login_data)
        token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        # Cliente no puede acceder a lista de usuarios
        response = self.client.get('/api/usuarios/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_validacion_input_malicioso(self):
        """Verifica la validación contra input malicioso"""
        # SQL Injection
        response = self.client.get('/api/productos/?search=1; DROP TABLE productos;')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # XSS
        response = self.client.post('/api/contacto/', {
            'nombre': '<script>alert("XSS")</script>',
            'email': 'test@test.com',
            'asunto': 'Test',
            'mensaje': 'Test message'
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    
    def test_rate_limiting(self):
        """Verifica el rate limiting"""
        # Realizar múltiples requests rápidos
        for i in range(10):
            response = self.client.get('/api/usuarios/login/')
        
        # El último request debería ser bloqueado
        self.assertEqual(response.status_code, status.HTTP_429_TOO_MANY_REQUESTS)
```

## Ejecución de Pruebas

### Comandos para Ejecutar Pruebas

```bash
# Ejecutar todas las pruebas
python manage.py test

# Ejecutar pruebas específicas
python manage.py test productos.tests
python manage.py test usuarios.tests.TestUsuarioModel
python manage.py test carrito.tests.TestCarritoModel

# Ejecutar con verbosidad
python manage.py test -v 2

# Ejecutar pruebas con cobertura
pip install coverage
coverage run --source='.' manage.py test
coverage report
coverage html

# Ejecutar pruebas de rendimiento
python manage.py test tests_performance.py

# Ejecutar pruebas de seguridad
python manage.py test tests_security.py
```

### Configuración de Pruebas

```python
# settings_test.py
from .settings import *

# Configuración específica para pruebas
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:',
    }
}

# Deshabilitar logging durante pruebas
LOGGING = {
    'version': 1,
    'disable_existing_loggers': True,
}

# Configuración de caché para pruebas
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
    }
}

# Configuración de email para pruebas
EMAIL_BACKEND = 'django.core.mail.backends.locmem.EmailBackend'
```

### Reportes de Pruebas

```bash
# Generar reporte HTML de cobertura
coverage html
# Abrir: htmlcov/index.html

# Generar reporte XML para CI/CD
coverage xml

# Ejecutar pruebas con reporte detallado
python manage.py test --verbosity=2 --parallel
```

## Integración Continua (CI/CD)

### GitHub Actions

```yaml
# .github/workflows/tests.yml
name: Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:13
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: ferremas_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Set up Python
      uses: actions/setup-python@v2
      with:
        python-version: 3.11
    
    - name: Install dependencies
      run: |
        cd ferremas_backend
        python -m pip install --upgrade pip
        pip install -r requirements.txt
        pip install coverage
    
    - name: Run tests
      env:
        DATABASE_URL: postgres://postgres:postgres@localhost:5432/ferremas_test
        SECRET_KEY: test-secret-key
        DEBUG: True
      run: |
        cd ferremas_backend
        python manage.py test --verbosity=2
    
    - name: Generate coverage report
      run: |
        cd ferremas_backend
        coverage run --source='.' manage.py test
        coverage xml
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v1
      with:
        file: ./ferremas_backend/coverage.xml
```

## Métricas de Calidad

### Cobertura de Código

- **Objetivo**: Mínimo 80% de cobertura
- **Backend**: 85% de cobertura actual
- **Frontend**: 70% de cobertura (en desarrollo)

### Tiempo de Ejecución

- **Pruebas unitarias**: < 30 segundos
- **Pruebas de integración**: < 2 minutos
- **Pruebas de rendimiento**: < 5 minutos

### Métricas de Rendimiento

- **Tiempo de respuesta API**: < 500ms
- **Tiempo de carga de página**: < 2 segundos
- **Uso de memoria**: < 512MB
- **Uso de CPU**: < 50%

## Mejores Prácticas

### 1. Naming Conventions

```python
# Nombres descriptivos para clases de prueba
class TestProductoCreacion(TestCase):
class TestUsuarioAutenticacion(TestCase):
class TestCarritoOperaciones(TestCase):

# Nombres descriptivos para métodos de prueba
def test_crear_producto_con_datos_validos(self):
def test_login_usuario_con_credenciales_correctas(self):
def test_agregar_producto_al_carrito(self):
```

### 2. Organización de Pruebas

```python
class TestProducto(TestCase):
    """Pruebas para el modelo Producto"""
    
    def setUp(self):
        """Configuración común para todas las pruebas"""
        self.producto = Producto.objects.create(
            sku='TEST001',
            nombre='Producto Test',
            precio=10.00,
            categoria='Test'
        )
    
    def test_creacion_producto(self):
        """Verifica la creación básica de un producto"""
        pass
    
    def test_validacion_precio(self):
        """Verifica la validación del precio"""
        pass
    
    def test_actualizacion_producto(self):
        """Verifica la actualización de un producto"""
        pass
```

### 3. Datos de Prueba

```python
# Usar factories para datos de prueba
from factory import Factory, Faker
from productos.models import Producto

class ProductoFactory(Factory):
    class Meta:
        model = Producto
    
    sku = Faker('bothify', text='???###')
    nombre = Faker('word')
    precio = Faker('pydecimal', left_digits=2, right_digits=2, positive=True)
    categoria = Faker('random_element', elements=['Herramientas', 'Pinturas', 'Plomería'])
```

### 4. Mocks y Stubs

```python
# Usar mocks para APIs externas
@patch('carrito.mercadopago_service.MercadoPagoService.create_preference')
def test_checkout_mercadopago(self, mock_create_preference):
    mock_create_preference.return_value = {
        'preference_id': 'test_id',
        'init_point': 'https://test.com'
    }
    
    # Prueba del checkout
    response = self.client.post('/api/carritos/checkout/', data)
    self.assertEqual(response.status_code, 200)
```

## Próximos Pasos

### Pruebas Pendientes

1. **Pruebas E2E con Cypress**
   - Flujos completos de usuario
   - Pruebas de interfaz
   - Pruebas de accesibilidad

2. **Pruebas de Carga con Locust**
   - Simulación de usuarios concurrentes
   - Pruebas de stress
   - Análisis de bottlenecks

3. **Pruebas de Seguridad Automatizadas**
   - Escaneo de vulnerabilidades
   - Pruebas de penetración
   - Análisis de dependencias

4. **Pruebas de API con Postman**
   - Colección de pruebas automatizadas
   - Pruebas de contratos
   - Monitoreo de APIs

### Mejoras de Cobertura

- **Frontend**: Aumentar cobertura a 90%
- **Backend**: Mantener cobertura en 85%+
- **APIs**: Cobertura completa de endpoints
- **Integración**: Pruebas de flujos completos