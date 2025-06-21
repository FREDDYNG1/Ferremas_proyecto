from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.urls import reverse
from .models import CustomerUser
from .serializers import UsuarioSerializer
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class CustomerUserModelTest(TestCase):
    """Pruebas para el modelo CustomerUser"""
    
    def setUp(self):
        self.user_data = {
            'email': 'test@example.com',
            'password': 'testpass123',
            'first_name': 'Test',
            'last_name': 'User',
            'role': 'cliente'
        }
        self.user = CustomerUser.objects.create_user(**self.user_data)
    
    def test_crear_usuario(self):
        """Prueba que se puede crear un usuario correctamente"""
        self.assertEqual(self.user.email, 'test@example.com')
        self.assertEqual(self.user.first_name, 'Test')
        self.assertEqual(self.user.last_name, 'User')
        self.assertEqual(self.user.role, 'cliente')
        self.assertTrue(self.user.is_active)
    
    def test_str_representation(self):
        """Prueba la representación en string del usuario"""
        expected = f"{self.user.first_name} {self.user.last_name} ({self.user.email})"
        self.assertEqual(str(self.user), expected)
    
    def test_crear_superusuario(self):
        """Prueba que se puede crear un superusuario"""
        admin_user = CustomerUser.objects.create_superuser(
            email='admin@example.com',
            password='adminpass123',
            first_name='Admin',
            last_name='User'
        )
        self.assertTrue(admin_user.is_staff)
        self.assertTrue(admin_user.is_superuser)
    
    def test_verificar_password(self):
        """Prueba que la verificación de contraseña funciona"""
        self.assertTrue(self.user.check_password('testpass123'))
        self.assertFalse(self.user.check_password('wrongpass'))

class UsuarioSerializerTest(TestCase):
    """Pruebas para el serializer de Usuario"""
    
    def setUp(self):
        self.user_data = {
            'email': 'test@example.com',
            'password': 'testpass123',
            'first_name': 'Test',
            'last_name': 'User',
            'role': 'cliente'
        }
        self.user = CustomerUser.objects.create_user(**self.user_data)
        self.serializer = UsuarioSerializer(instance=self.user)
    
    def test_serializer_fields(self):
        """Prueba que el serializer contiene los campos correctos"""
        data = self.serializer.data
        self.assertIn('id', data)
        self.assertIn('email', data)
        self.assertIn('first_name', data)
        self.assertIn('last_name', data)
        self.assertIn('role', data)
        self.assertNotIn('password', data)  # Password no debe estar en la respuesta
    
    def test_serializer_validation(self):
        """Prueba la validación del serializer"""
        valid_data = {
            'email': 'new@example.com',
            'password': 'newpass123',
            'first_name': 'New',
            'last_name': 'User',
            'role': 'trabajador'
        }
        serializer = UsuarioSerializer(data=valid_data)
        self.assertTrue(serializer.is_valid())
    
    def test_serializer_invalid_email(self):
        """Prueba que el serializer valida emails únicos"""
        invalid_data = {
            'email': 'test@example.com',  # Email ya existe
            'password': 'newpass123',
            'first_name': 'New',
            'last_name': 'User',
            'role': 'cliente'
        }
        serializer = UsuarioSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('email', serializer.errors)

class UsuarioAPITest(APITestCase):
    """Pruebas para las APIs de Usuario"""
    
    def setUp(self):
        # Crear usuario administrador
        self.admin_user = CustomerUser.objects.create_user(
            email='admin@test.com',
            password='adminpass123',
            first_name='Admin',
            last_name='Test',
            role='admin'
        )
        
        # Crear usuario trabajador
        self.trabajador_user = CustomerUser.objects.create_user(
            email='trabajador@test.com',
            password='trabajadorpass123',
            first_name='Trabajador',
            last_name='Test',
            role='trabajador'
        )
        
        # Crear usuario cliente
        self.cliente_user = CustomerUser.objects.create_user(
            email='cliente@test.com',
            password='clientepass123',
            first_name='Cliente',
            last_name='Test',
            role='cliente'
        )
        
        self.client = APIClient()
    
    def test_registro_usuario(self):
        """Prueba el registro de un nuevo usuario"""
        url = reverse('registro')
        data = {
            'email': 'nuevo@test.com',
            'password': 'nuevopass123',
            'first_name': 'Nuevo',
            'last_name': 'Usuario',
            'role': 'cliente'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(CustomerUser.objects.count(), 4)
        
        # Verificar que el usuario se creó correctamente
        nuevo_usuario = CustomerUser.objects.get(email='nuevo@test.com')
        self.assertEqual(nuevo_usuario.first_name, 'Nuevo')
        self.assertEqual(nuevo_usuario.role, 'cliente')
    
    def test_login_exitoso(self):
        """Prueba el login exitoso de un usuario"""
        url = reverse('login')
        data = {
            'email': 'cliente@test.com',
            'password': 'clientepass123'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verificar que se devuelven los tokens
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertIn('role', response.data)
        self.assertIn('user_id', response.data)
    
    def test_login_credenciales_invalidas(self):
        """Prueba el login con credenciales inválidas"""
        url = reverse('login')
        data = {
            'email': 'cliente@test.com',
            'password': 'passwordincorrecto'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_login_usuario_inexistente(self):
        """Prueba el login con un usuario que no existe"""
        url = reverse('login')
        data = {
            'email': 'noexiste@test.com',
            'password': 'cualquierpass'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_vista_protegida_con_autenticacion(self):
        """Prueba acceso a vista protegida con autenticación"""
        self.client.force_authenticate(user=self.cliente_user)
        url = reverse('protegido')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('mensaje', response.data)
    
    def test_vista_protegida_sin_autenticacion(self):
        """Prueba acceso a vista protegida sin autenticación"""
        url = reverse('protegido')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_crear_usuario_por_admin(self):
        """Prueba que un admin puede crear usuarios"""
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('crear_usuario')
        data = {
            'email': 'nuevo@test.com',
            'password': 'nuevopass123',
            'first_name': 'Nuevo',
            'last_name': 'Usuario',
            'role': 'trabajador'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(CustomerUser.objects.count(), 4)
    
    def test_crear_usuario_sin_permisos(self):
        """Prueba que un cliente no puede crear usuarios"""
        self.client.force_authenticate(user=self.cliente_user)
        url = reverse('crear_usuario')
        data = {
            'email': 'nuevo@test.com',
            'password': 'nuevopass123',
            'first_name': 'Nuevo',
            'last_name': 'Usuario',
            'role': 'trabajador'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_listar_usuarios_admin(self):
        """Prueba que un admin puede listar usuarios"""
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('lista_usuarios')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3)  # admin, trabajador, cliente
    
    def test_listar_usuarios_sin_permisos(self):
        """Prueba que un cliente no puede listar usuarios"""
        self.client.force_authenticate(user=self.cliente_user)
        url = reverse('lista_usuarios')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_cambiar_password(self):
        """Prueba cambiar la contraseña de un usuario"""
        self.client.force_authenticate(user=self.cliente_user)
        url = reverse('cambiar_password')
        data = {
            'nueva_password': 'nuevapassword123'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verificar que la contraseña se cambió
        self.cliente_user.refresh_from_db()
        self.assertTrue(self.cliente_user.check_password('nuevapassword123'))
        self.assertFalse(self.cliente_user.requiere_cambio_password)
    
    def test_perfil_usuario(self):
        """Prueba obtener el perfil del usuario autenticado"""
        self.client.force_authenticate(user=self.cliente_user)
        url = reverse('perfil_usuario')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], 'cliente@test.com')
        self.assertEqual(response.data['first_name'], 'Cliente')

class JWTTokenTest(APITestCase):
    """Pruebas específicas para JWT tokens"""
    
    def setUp(self):
        self.user = CustomerUser.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User',
            role='cliente'
        )
        self.client = APIClient()
    
    def test_token_refresh(self):
        """Prueba el refresh de tokens JWT"""
        # Primero hacer login para obtener tokens
        login_url = reverse('login')
        login_data = {
            'email': 'test@example.com',
            'password': 'testpass123'
        }
        login_response = self.client.post(login_url, login_data)
        refresh_token = login_response.data['refresh']
        
        # Usar el refresh token para obtener un nuevo access token
        refresh_url = reverse('token_refresh')
        refresh_data = {
            'refresh': refresh_token
        }
        refresh_response = self.client.post(refresh_url, refresh_data)
        self.assertEqual(refresh_response.status_code, status.HTTP_200_OK)
        self.assertIn('access', refresh_response.data)
    
    def test_token_validation(self):
        """Prueba la validación de tokens"""
        # Obtener token
        login_url = reverse('login')
        login_data = {
            'email': 'test@example.com',
            'password': 'testpass123'
        }
        login_response = self.client.post(login_url, login_data)
        access_token = login_response.data['access']
        
        # Usar token para acceder a vista protegida
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        url = reverse('protegido')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_invalid_token(self):
        """Prueba acceso con token inválido"""
        self.client.credentials(HTTP_AUTHORIZATION='Bearer invalid_token')
        url = reverse('protegido')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
