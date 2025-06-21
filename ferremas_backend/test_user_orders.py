import requests
import json
import os
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from django.test import Client

User = get_user_model()

# URL base del servidor
BASE_URL = 'http://localhost:8000/api'

def create_test_user():
    """Crear un usuario de prueba"""
    try:
        # Verificar si el usuario ya existe
        user, created = User.objects.get_or_create(
            email='testcliente@ferremas.com',
            defaults={
                'first_name': 'Test',
                'last_name': 'Cliente',
                'role': 'cliente',
                'is_active': True
            }
        )
        
        if created:
            user.set_password('testpass123')
            user.save()
            print(f"✅ Usuario de prueba creado: {user.email}")
        else:
            # Actualizar la contraseña si el usuario ya existe
            user.set_password('testpass123')
            user.save()
            print(f"✅ Usuario de prueba existente: {user.email}")
            
        return user
    except Exception as e:
        print(f"❌ Error creando usuario: {e}")
        return None

def test_user_orders_endpoint():
    """Prueba el endpoint user_orders"""
    
    # Crear usuario de prueba
    test_user = create_test_user()
    if not test_user:
        return
    
    # Datos de login
    login_data = {
        'email': 'testcliente@ferremas.com',
        'password': 'testpass123'
    }
    
    try:
        # Intentar hacer login
        login_response = requests.post(f'{BASE_URL}/usuarios/login/', json=login_data)
        
        if login_response.status_code == 200:
            token_data = login_response.json()
            access_token = token_data.get('access')
            
            if access_token:
                # Probar el endpoint user_orders con el token
                headers = {
                    'Authorization': f'Bearer {access_token}',
                    'Content-Type': 'application/json'
                }
                
                user_orders_response = requests.get(f'{BASE_URL}/carritos/user_orders/', headers=headers)
                
                print(f"Status Code: {user_orders_response.status_code}")
                print(f"Response: {user_orders_response.text}")
                
                if user_orders_response.status_code == 200:
                    print("✅ Endpoint user_orders funciona correctamente")
                    orders = user_orders_response.json()
                    print(f"📦 Número de órdenes encontradas: {len(orders)}")
                else:
                    print("❌ Error en el endpoint user_orders")
                    
            else:
                print("❌ No se pudo obtener el token de acceso")
        else:
            print(f"❌ Error en login: {login_response.status_code}")
            print(f"Response: {login_response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ No se pudo conectar al servidor. Asegúrate de que esté corriendo en http://localhost:8000")
    except Exception as e:
        print(f"❌ Error inesperado: {e}")

if __name__ == "__main__":
    test_user_orders_endpoint() 