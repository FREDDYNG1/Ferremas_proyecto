# 4. APIs Externas

## Información General

El sistema Ferremas integra dos APIs externas principales para proporcionar funcionalidades avanzadas de pagos y conversión de monedas.

## 1. MercadoPago API

### Descripción
MercadoPago es la plataforma de pagos digitales integrada para procesar transacciones de manera segura y confiable. Permite a los clientes realizar pagos con múltiples métodos de pago.

### Configuración
- **SDK**: `mercadopago==2.3.0`
- **Ambiente**: Sandbox (desarrollo) / Production (producción)
- **Autenticación**: Access Token

### Variables de Entorno
```env
MP_ACCESS_TOKEN=TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

### Endpoints Utilizados

#### 1.1 Crear Preferencia de Pago

**Método**: `POST`  
**URL**: `https://api.mercadopago.com/checkout/preferences`  
**Descripción**: Crea una preferencia de pago para iniciar el proceso de checkout

**Parámetros**:
```json
{
  "items": [
    {
      "title": "Martillo Profesional",
      "quantity": 2,
      "unit_price": 25.99,
      "currency_id": "USD"
    }
  ],
  "back_urls": {
    "success": "https://ferremas.com/checkout/success",
    "failure": "https://ferremas.com/checkout/failure",
    "pending": "https://ferremas.com/checkout/pending"
  },
  "auto_return": "approved",
  "external_reference": "ORDER_123",
  "payer": {
    "email": "cliente@example.com"
  }
}
```

**Respuesta Exitosa** (201):
```json
{
  "id": "1234567890",
  "init_point": "https://www.mercadopago.com/checkout/v1/redirect?pref_id=1234567890",
  "sandbox_init_point": "https://sandbox.mercadopago.com/checkout/v1/redirect?pref_id=1234567890"
}
```

#### 1.2 Obtener Información de Pago

**Método**: `GET`  
**URL**: `https://api.mercadopago.com/v1/payments/{payment_id}`  
**Descripción**: Obtiene información detallada de un pago específico

**Respuesta Exitosa** (200):
```json
{
  "id": 1234567890,
  "status": "approved",
  "status_detail": "accredited",
  "external_reference": "ORDER_123",
  "transaction_amount": 51.98,
  "currency_id": "USD",
  "payment_method_id": "visa",
  "payer": {
    "email": "cliente@example.com"
  },
  "date_created": "2024-01-15T10:30:00.000-04:00"
}
```

### Implementación en el Backend

#### Clase MercadoPagoService

```python
class MercadoPagoService:
    def __init__(self):
        self.access_token = getattr(settings, 'MP_ACCESS_TOKEN', os.getenv('MP_ACCESS_TOKEN'))
        self.sdk = mercadopago.SDK(self.access_token)
    
    def create_preference(self, items, metadata=None, external_reference=None, payer_email=None):
        """Crea una preferencia de pago en MercadoPago"""
        preference_data = {
            "items": items,
            "back_urls": {
                "success": f"{frontend_url}/checkout/success",
                "failure": f"{frontend_url}/checkout/failure",
                "pending": f"{frontend_url}/checkout/pending",
            },
            "auto_return": "approved",
            "external_reference": external_reference,
            "metadata": metadata,
        }
        
        if payer_email:
            preference_data["payer"] = {"email": payer_email}
        
        preference_response = self.sdk.preference().create(preference_data)
        return preference_response
    
    def get_payment_info(self, payment_id):
        """Obtiene información de un pago por su ID"""
        payment_info = self.sdk.payment().get(payment_id)
        return payment_info.get("response")
```

### Estados de Pago

| Estado | Descripción | Acción |
|--------|-------------|--------|
| `pending` | Pago pendiente | Esperar confirmación |
| `approved` | Pago aprobado | Completar orden |
| `rejected` | Pago rechazado | Cancelar orden |
| `cancelled` | Pago cancelado | Cancelar orden |
| `in_process` | Pago en revisión | Esperar resolución |

### Webhooks

**URL**: `https://ferremas.com/api/carritos/webhook/`  
**Eventos**: `payment.created`, `payment.updated`

```json
{
  "type": "payment",
  "data": {
    "id": "1234567890"
  }
}
```

### Manejo de Errores

```python
try:
    preference_response = self.sdk.preference().create(preference_data)
    if preference_response.get("status") in [200, 201]:
        return preference_response.get("response")
    else:
        logger.error(f"Error en MercadoPago: {preference_response}")
        return None
except Exception as e:
    logger.error(f"Excepción en MercadoPago: {e}")
    return None
```

## 2. ExchangeRate API (Fixer.io)

### Descripción
ExchangeRate API proporciona tasas de cambio en tiempo real para más de 170 monedas, permitiendo conversiones automáticas en el sistema.

### Configuración
- **Proveedor**: Fixer.io (ExchangeRate API)
- **Versión**: v6
- **Autenticación**: API Key
- **Límites**: 1000 requests/mes (gratuito)

### Variables de Entorno
```env
CURRENCY_API_KEY=your_api_key_here
EXCHANGE_RATE_KEY=your_api_key_here
```

### Endpoints Utilizados

#### 2.1 Obtener Tasas de Cambio

**Método**: `GET`  
**URL**: `https://v6.exchangerate-api.com/v6/{api_key}/latest/{base_currency}`  
**Descripción**: Obtiene las tasas de cambio más recientes para una moneda base

**Parámetros**:
- `api_key`: Clave de API de ExchangeRate
- `base_currency`: Moneda base (ej: USD, EUR, CLP)

**Respuesta Exitosa** (200):
```json
{
  "result": "success",
  "base_code": "USD",
  "target_code": "EUR",
  "conversion_rate": 0.905,
  "conversion_result": 90.50,
  "time_last_update_utc": "2024-01-15T10:30:00Z",
  "time_next_update_utc": "2024-01-15T11:30:00Z",
  "conversion_rates": {
    "USD": 1.0,
    "EUR": 0.905,
    "CLP": 900.50,
    "GBP": 0.785,
    "JPY": 148.25
  }
}
```

**Respuesta de Error** (400):
```json
{
  "result": "error",
  "error-type": "invalid-key"
}
```

### Implementación en el Backend

#### Funciones de Conversión

```python
def obtener_tasas_cambio(moneda_base='USD'):
    """Obtiene las tasas de cambio más recientes"""
    api_key = getattr(settings, 'CURRENCY_API_KEY', None)
    url = f"https://v6.exchangerate-api.com/v6/{api_key}/latest/{moneda_base}"
    
    try:
        respuesta = requests.get(url)
        respuesta.raise_for_status()
        datos = respuesta.json()
        
        if datos.get('result') == 'success':
            return datos
        else:
            logger.error(f"Error de API: {datos.get('error-type')}")
            return None
    except Exception as e:
        logger.error(f"Error de conexión: {e}")
        return None

def convertir_moneda(cantidad, moneda_origen, moneda_destino):
    """Convierte una cantidad de una moneda a otra"""
    datos_tasas = obtener_tasas_cambio(moneda_base=moneda_origen)
    
    if not datos_tasas or 'conversion_rates' not in datos_tasas:
        return None
    
    tasas_disponibles = datos_tasas['conversion_rates']
    
    if moneda_destino not in tasas_disponibles:
        logger.error(f"Moneda {moneda_destino} no disponible")
        return None
    
    tasa_conversion = tasas_disponibles[moneda_destino]
    cantidad_convertida = cantidad * tasa_conversion
    return cantidad_convertida
```

### Monedas Soportadas

#### Principales
- **USD**: Dólar Estadounidense
- **EUR**: Euro
- **CLP**: Peso Chileno
- **GBP**: Libra Esterlina
- **JPY**: Yen Japonés

#### Latinoamericanas
- **ARS**: Peso Argentino
- **BRL**: Real Brasileño
- **MXN**: Peso Mexicano
- **COP**: Peso Colombiano
- **PEN**: Sol Peruano

### Caché de Tasas

Para optimizar el rendimiento, se implementa un sistema de caché:

```python
from django.core.cache import cache

def obtener_tasas_cambio_cached(moneda_base='USD'):
    """Obtiene tasas de cambio con caché"""
    cache_key = f"exchange_rates_{moneda_base}"
    tasas_cached = cache.get(cache_key)
    
    if tasas_cached:
        return tasas_cached
    
    tasas = obtener_tasas_cambio(moneda_base)
    if tasas:
        # Cache por 1 hora
        cache.set(cache_key, tasas, 3600)
    
    return tasas
```

### Manejo de Errores

```python
def convertir_moneda_segura(cantidad, moneda_origen, moneda_destino):
    """Conversión de moneda con manejo robusto de errores"""
    try:
        if cantidad <= 0:
            raise ValueError("La cantidad debe ser mayor a 0")
        
        resultado = convertir_moneda(cantidad, moneda_origen, moneda_destino)
        
        if resultado is None:
            raise Exception("No se pudo obtener la tasa de cambio")
        
        return round(resultado, 2)
        
    except ValueError as e:
        logger.error(f"Error de validación: {e}")
        return None
    except Exception as e:
        logger.error(f"Error de conversión: {e}")
        return None
```

## 3. Configuración de Integración

### Archivo de Configuración

```python
# settings.py

# MercadoPago
MP_ACCESS_TOKEN = os.getenv('MP_ACCESS_TOKEN')

# ExchangeRate API
CURRENCY_API_KEY = os.getenv("CURRENCY_API_KEY")
EXCHANGE_RATE_KEY = os.getenv("EXCHANGE_RATE_KEY")

# Configuración de caché para APIs externas
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'unique-snowflake',
        'TIMEOUT': 3600,  # 1 hora
    }
}
```

### Middleware de Monitoreo

```python
class APIMonitoringMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        start_time = time.time()
        response = self.get_response(request)
        duration = time.time() - start_time
        
        # Log de llamadas a APIs externas
        if 'mercadopago' in request.path or 'convertir-moneda' in request.path:
            logger.info(f"API Externa: {request.path} - {duration:.2f}s")
        
        return response
```

## 4. Testing de APIs Externas

### Tests Unitarios

```python
import pytest
from unittest.mock import patch, Mock

class TestMercadoPagoService:
    @patch('mercadopago.SDK')
    def test_create_preference_success(self, mock_sdk):
        mock_response = {
            "status": 201,
            "response": {
                "id": "1234567890",
                "init_point": "https://www.mercadopago.com/checkout/v1/redirect?pref_id=1234567890"
            }
        }
        mock_sdk.return_value.preference.return_value.create.return_value = mock_response
        
        service = MercadoPagoService()
        result = service.create_preference([{"title": "Test", "quantity": 1, "unit_price": 10}])
        
        assert result is not None
        assert result["id"] == "1234567890"

class TestExchangeRateAPI:
    @patch('requests.get')
    def test_convertir_moneda_success(self, mock_get):
        mock_response = Mock()
        mock_response.json.return_value = {
            "result": "success",
            "conversion_rates": {
                "USD": 1.0,
                "EUR": 0.905
            }
        }
        mock_get.return_value = mock_response
        
        resultado = convertir_moneda(100, "USD", "EUR")
        assert resultado == 90.5
```

### Tests de Integración

```python
class TestAPIIntegration:
    def test_mercadopago_integration(self):
        """Test de integración real con MercadoPago (solo en desarrollo)"""
        if settings.DEBUG:
            service = MercadoPagoService()
            items = [{"title": "Test Product", "quantity": 1, "unit_price": 10}]
            result = service.create_preference(items)
            assert result is not None
    
    def test_exchangerate_integration(self):
        """Test de integración real con ExchangeRate API (solo en desarrollo)"""
        if settings.DEBUG:
            resultado = convertir_moneda(100, "USD", "EUR")
            assert resultado is not None
            assert resultado > 0
```

## 5. Monitoreo y Alertas

### Métricas de Rendimiento

```python
import time
from django.core.cache import cache

def monitor_api_call(api_name, func, *args, **kwargs):
    """Monitorea llamadas a APIs externas"""
    start_time = time.time()
    
    try:
        result = func(*args, **kwargs)
        duration = time.time() - start_time
        
        # Registrar métricas
        cache_key = f"api_metrics_{api_name}"
        metrics = cache.get(cache_key, {"calls": 0, "total_time": 0, "errors": 0})
        metrics["calls"] += 1
        metrics["total_time"] += duration
        cache.set(cache_key, metrics, 3600)
        
        return result
        
    except Exception as e:
        # Registrar error
        metrics = cache.get(cache_key, {"calls": 0, "total_time": 0, "errors": 0})
        metrics["errors"] += 1
        cache.set(cache_key, metrics, 3600)
        
        logger.error(f"Error en {api_name}: {e}")
        raise
```

### Alertas Automáticas

```python
def check_api_health():
    """Verifica la salud de las APIs externas"""
    apis = {
        "mercadopago": lambda: MercadoPagoService().sdk.preference().create({"items": []}),
        "exchangerate": lambda: obtener_tasas_cambio("USD")
    }
    
    for api_name, test_func in apis.items():
        try:
            test_func()
            logger.info(f"API {api_name} está funcionando correctamente")
        except Exception as e:
            logger.error(f"API {api_name} no está disponible: {e}")
            # Enviar alerta por email o Slack
            send_alert(f"API {api_name} no disponible")
```

## 6. Consideraciones de Seguridad

### Protección de Credenciales

- **Variables de entorno**: Todas las API keys se almacenan en variables de entorno
- **Rotación de tokens**: Implementar rotación periódica de tokens de MercadoPago
- **Validación de entrada**: Validar todos los datos antes de enviar a APIs externas

### Rate Limiting

```python
from django.core.cache import cache
from django.http import HttpResponseTooManyRequests

def rate_limit_api_calls(api_name, max_calls=100, window=3600):
    """Implementa rate limiting para APIs externas"""
    cache_key = f"rate_limit_{api_name}"
    calls = cache.get(cache_key, 0)
    
    if calls >= max_calls:
        return False
    
    cache.set(cache_key, calls + 1, window)
    return True
```

### Validación de Webhooks

```python
import hashlib
import hmac

def verify_mercadopago_webhook(request):
    """Verifica la autenticidad de webhooks de MercadoPago"""
    signature = request.headers.get('X-Signature')
    payload = request.body
    
    expected_signature = hmac.new(
        settings.MP_ACCESS_TOKEN.encode(),
        payload,
        hashlib.sha256
    ).hexdigest()
    
    return hmac.compare_digest(signature, expected_signature)
```

## 7. Documentación de APIs

### Swagger/OpenAPI

Las APIs externas están documentadas en el esquema OpenAPI del proyecto:

- **URL**: `http://localhost:8000/api/schema/swagger-ui/`
- **Esquema**: `http://localhost:8000/api/schema/`

### Postman Collection

Se incluye una colección de Postman con ejemplos de todas las integraciones:

```json
{
  "info": {
    "name": "Ferremas External APIs",
    "description": "Colección de APIs externas de Ferremas"
  },
  "item": [
    {
      "name": "MercadoPago",
      "item": [
        {
          "name": "Create Preference",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/api/carritos/checkout/",
            "body": {
              "mode": "raw",
              "raw": "{\"carrito_id\": 1}"
            }
          }
        }
      ]
    },
    {
      "name": "ExchangeRate",
      "item": [
        {
          "name": "Convert Currency",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/api/convertir-moneda/?cantidad=100&moneda_origen=USD&moneda_destino=EUR"
          }
        }
      ]
    }
  ]
}
``` 