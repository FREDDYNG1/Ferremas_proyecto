# 5. Configuración del Entorno

## Variables de Entorno

### Backend (Django)

Crea un archivo `.env` en la carpeta `ferremas_backend/` con las siguientes variables:

```env
# Django Settings
SECRET_KEY='django-insecure-your-secret-key-here'
DEBUG=True

# Database Configuration (Supabase PostgreSQL)
DB_ENGINE='django.db.backends.postgresql'
DB_NAME='your_database_name'
DB_USER='your_database_user'
DB_PASSWORD='your_database_password'
DB_HOST='your_supabase_host'
DB_PORT='5432'

# External APIs
MP_ACCESS_TOKEN='TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
CURRENCY_API_KEY='your_exchangerate_api_key'
EXCHANGE_RATE_KEY='your_exchangerate_api_key'

# Email Configuration (Optional)
EMAIL_BACKEND='django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST='smtp.gmail.com'
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_USE_SSL=False
EMAIL_HOST_USER='your_email@gmail.com'
EMAIL_HOST_PASSWORD='your_app_password'
```

### Frontend (React)

Crea un archivo `.env` en la carpeta `ferremas_frontend/` con las siguientes variables:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api
VITE_BACKEND_URL=http://localhost:8000

# MercadoPago Configuration (Frontend)
VITE_MERCADOPAGO_PUBLIC_KEY=TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# Environment
VITE_NODE_ENV=development
```

## Requisitos del Sistema

### Requisitos Mínimos

#### Backend
- **Python**: 3.8 o superior
- **RAM**: 2GB mínimo
- **Disco**: 1GB de espacio libre
- **Sistema Operativo**: Windows 10+, macOS 10.14+, Ubuntu 18.04+

#### Frontend
- **Node.js**: 16.0 o superior
- **npm**: 8.0 o superior
- **RAM**: 2GB mínimo
- **Disco**: 500MB de espacio libre

### Requisitos Recomendados

#### Backend
- **Python**: 3.11 o superior
- **RAM**: 4GB o más
- **Disco**: 2GB de espacio libre
- **CPU**: 2 cores o más

#### Frontend
- **Node.js**: 18.0 o superior
- **npm**: 9.0 o superior
- **RAM**: 4GB o más
- **Disco**: 1GB de espacio libre

## Instalación de Dependencias

### Backend (Python/Django)

#### 1. Crear Entorno Virtual

```bash
# Navegar al directorio del backend
cd ferremas_backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
```

#### 2. Instalar Dependencias

```bash
# Actualizar pip
pip install --upgrade pip

# Instalar dependencias
pip install -r requirements.txt
```

#### 3. Verificar Instalación

```bash
# Verificar versión de Python
python --version

# Verificar instalación de Django
python -c "import django; print(django.get_version())"

# Verificar otras dependencias críticas
python -c "import rest_framework; print('DRF installed')"
python -c "import mercadopago; print('MercadoPago SDK installed')"
```

### Frontend (React/Node.js)

#### 1. Verificar Node.js

```bash
# Verificar versión de Node.js
node --version

# Verificar versión de npm
npm --version
```

#### 2. Instalar Dependencias

```bash
# Navegar al directorio del frontend
cd ferremas_frontend

# Instalar dependencias
npm install
```

#### 3. Verificar Instalación

```bash
# Verificar que React está instalado
npm list react

# Verificar otras dependencias críticas
npm list @mui/material
npm list axios
npm list react-router-dom
```

## Configuración de Base de Datos

### Supabase Setup

#### 1. Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea una nueva cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Anota las credenciales de conexión

#### 2. Configurar Variables de Entorno

```env
# Ejemplo de configuración Supabase
DB_ENGINE='django.db.backends.postgresql'
DB_NAME='postgres'
DB_USER='postgres'
DB_PASSWORD='your_supabase_password'
DB_HOST='db.xxxxxxxxxxxxx.supabase.co'
DB_PORT='5432'
```

#### 3. Aplicar Migraciones

```bash
# Navegar al directorio del backend
cd ferremas_backend

# Activar entorno virtual
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux

# Aplicar migraciones
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser
```

## Configuración de APIs Externas

### MercadoPago

#### 1. Crear Cuenta MercadoPago

1. Ve a [mercadopago.com](https://mercadopago.com)
2. Crea una cuenta de desarrollador
3. Accede al panel de desarrolladores

#### 2. Obtener Credenciales

1. Ve a "Credenciales" en el panel
2. Copia el "Access Token" de prueba
3. Configura en variables de entorno:

```env
MP_ACCESS_TOKEN=TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

#### 3. Configurar Webhooks (Opcional)

1. En el panel de MercadoPago, ve a "Webhooks"
2. Agrega la URL: `https://tu-dominio.com/api/carritos/webhook/`
3. Selecciona eventos: `payment.created`, `payment.updated`

### ExchangeRate API

#### 1. Obtener API Key

1. Ve a [exchangerate-api.com](https://exchangerate-api.com)
2. Crea una cuenta gratuita
3. Obtén tu API key

#### 2. Configurar Variables

```env
CURRENCY_API_KEY=your_api_key_here
EXCHANGE_RATE_KEY=your_api_key_here
```

## Configuración de Email (Opcional)

### Gmail SMTP

#### 1. Configurar App Password

1. Ve a tu cuenta de Google
2. Activa la verificación en dos pasos
3. Genera una contraseña de aplicación
4. Usa esa contraseña en la configuración

#### 2. Variables de Entorno

```env
EMAIL_BACKEND='django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST='smtp.gmail.com'
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER='tu_email@gmail.com'
EMAIL_HOST_PASSWORD='tu_app_password'
```

## Verificación de Configuración

### Script de Verificación

Crea un archivo `verify_setup.py` en `ferremas_backend/`:

```python
import os
import sys
import django
from django.conf import settings

def verify_django_setup():
    """Verifica la configuración de Django"""
    try:
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
        django.setup()
        print("✅ Django configurado correctamente")
        return True
    except Exception as e:
        print(f"❌ Error en configuración de Django: {e}")
        return False

def verify_database_connection():
    """Verifica la conexión a la base de datos"""
    try:
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        print("✅ Conexión a base de datos exitosa")
        return True
    except Exception as e:
        print(f"❌ Error de conexión a base de datos: {e}")
        return False

def verify_external_apis():
    """Verifica las APIs externas"""
    try:
        from conversor_monedas.api import obtener_tasas_cambio
        tasas = obtener_tasas_cambio('USD')
        if tasas:
            print("✅ ExchangeRate API funcionando")
        else:
            print("⚠️ ExchangeRate API no disponible")
    except Exception as e:
        print(f"❌ Error en ExchangeRate API: {e}")
    
    try:
        from carrito.mercadopago_service import MercadoPagoService
        service = MercadoPagoService()
        print("✅ MercadoPago SDK configurado")
    except Exception as e:
        print(f"❌ Error en MercadoPago: {e}")

def verify_environment_variables():
    """Verifica variables de entorno críticas"""
    required_vars = [
        'SECRET_KEY',
        'DB_ENGINE',
        'DB_NAME',
        'DB_USER',
        'DB_PASSWORD',
        'DB_HOST',
        'MP_ACCESS_TOKEN',
        'CURRENCY_API_KEY'
    ]
    
    missing_vars = []
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        print(f"❌ Variables de entorno faltantes: {missing_vars}")
        return False
    else:
        print("✅ Todas las variables de entorno configuradas")
        return True

if __name__ == "__main__":
    print("🔍 Verificando configuración del proyecto...")
    print("-" * 50)
    
    env_ok = verify_environment_variables()
    django_ok = verify_django_setup()
    db_ok = verify_database_connection()
    
    if env_ok and django_ok and db_ok:
        verify_external_apis()
        print("-" * 50)
        print("✅ Configuración completada exitosamente")
    else:
        print("-" * 50)
        print("❌ Hay errores en la configuración")
        sys.exit(1)
```

### Ejecutar Verificación

```bash
cd ferremas_backend
python verify_setup.py
```

## Configuración de Desarrollo

### Backend Development Server

```bash
# Navegar al directorio del backend
cd ferremas_backend

# Activar entorno virtual
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux

# Ejecutar servidor de desarrollo
python manage.py runserver

# Servidor disponible en: http://localhost:8000
# Admin panel: http://localhost:8000/admin
# API docs: http://localhost:8000/api/schema/swagger-ui/
```

### Frontend Development Server

```bash
# Navegar al directorio del frontend
cd ferremas_frontend

# Ejecutar servidor de desarrollo
npm run dev

# Servidor disponible en: http://localhost:5173
```

### Configuración de CORS

Para desarrollo local, CORS está configurado para permitir todas las origenes:

```python
# settings.py
CORS_ALLOW_ALL_ORIGINS = True  # Solo para desarrollo
```

Para producción, configurar específicamente:

```python
CORS_ALLOWED_ORIGINS = [
    "https://tu-dominio.com",
    "https://www.tu-dominio.com",
]
```

## Configuración de Producción

### Variables de Entorno de Producción

```env
# Django Settings
SECRET_KEY='tu-secret-key-super-seguro'
DEBUG=False
ALLOWED_HOSTS=tu-dominio.com,www.tu-dominio.com

# Database (Producción)
DB_ENGINE='django.db.backends.postgresql'
DB_NAME='ferremas_prod'
DB_USER='ferremas_user'
DB_PASSWORD='password-super-seguro'
DB_HOST='tu-host-produccion'
DB_PORT='5432'

# APIs Externas (Producción)
MP_ACCESS_TOKEN='APP-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
CURRENCY_API_KEY='tu-api-key-produccion'

# Email (Producción)
EMAIL_BACKEND='django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST='smtp.tu-proveedor.com'
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER='noreply@tu-dominio.com'
EMAIL_HOST_PASSWORD='password-email'
```

### Configuración de Seguridad

```python
# settings.py (Producción)

# HTTPS
SECURE_SSL_REDIRECT = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# Headers de Seguridad
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'

# CORS (Producción)
CORS_ALLOWED_ORIGINS = [
    "https://tu-dominio.com",
    "https://www.tu-dominio.com",
]

# JWT Settings (Producción)
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
}
```

## Troubleshooting

### Problemas Comunes

#### 1. Error de Conexión a Base de Datos

```bash
# Verificar credenciales
python manage.py dbshell

# Verificar migraciones
python manage.py showmigrations

# Aplicar migraciones si es necesario
python manage.py migrate
```

#### 2. Error de Dependencias

```bash
# Actualizar pip
pip install --upgrade pip

# Reinstalar dependencias
pip uninstall -r requirements.txt -y
pip install -r requirements.txt
```

#### 3. Error de CORS

```bash
# Verificar configuración CORS
python manage.py check --deploy

# Verificar headers en navegador
# F12 -> Network -> Headers
```

#### 4. Error de APIs Externas

```bash
# Verificar variables de entorno
python -c "import os; print(os.getenv('MP_ACCESS_TOKEN'))"

# Probar APIs manualmente
python manage.py shell
>>> from carrito.mercadopago_service import MercadoPagoService
>>> service = MercadoPagoService()
```

### Logs y Debugging

#### Habilitar Logs Detallados

```python
# settings.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': 'debug.log',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}
```

#### Verificar Logs

```bash
# Ver logs en tiempo real
tail -f debug.log

# Buscar errores específicos
grep "ERROR" debug.log
``` 