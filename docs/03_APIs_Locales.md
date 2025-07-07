# 3. APIs Locales

## Información General

**Base URL**: `http://localhost:8000/api/` (desarrollo)  
**Formato**: JSON  
**Autenticación**: JWT Bearer Token  
**Documentación Interactiva**: `http://localhost:8000/api/schema/swagger-ui/`

## Autenticación

### 1. Obtener Token de Acceso

**Endpoint**: `POST /api/token/`  
**Descripción**: Obtiene tokens de acceso y refresh para autenticación  
**Autenticación**: No requerida  

**Parámetros**:
```json
{
  "username": "string",
  "password": "string"
}
```

**Respuesta Exitosa** (200):
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Respuesta de Error** (401):
```json
{
  "detail": "No active account found with the given credentials"
}
```

### 2. Renovar Token

**Endpoint**: `POST /api/token/refresh/`  
**Descripción**: Renueva el token de acceso usando el refresh token  
**Autenticación**: No requerida  

**Parámetros**:
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Respuesta Exitosa** (200):
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

## Gestión de Usuarios

### 3. Registro de Usuario

**Endpoint**: `POST /api/usuarios/registro/`  
**Descripción**: Registra un nuevo usuario cliente  
**Autenticación**: No requerida  

**Parámetros**:
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "password2": "string",
  "first_name": "string",
  "last_name": "string",
  "telefono": "string"
}
```

**Respuesta Exitosa** (201):
```json
{
  "id": 1,
  "username": "usuario123",
  "email": "usuario@example.com",
  "first_name": "Juan",
  "last_name": "Pérez",
  "telefono": "+56912345678",
  "rol": "cliente",
  "is_active": true
}
```

### 4. Login Personalizado

**Endpoint**: `POST /api/usuarios/login/`  
**Descripción**: Login con información adicional del usuario  
**Autenticación**: No requerida  

**Parámetros**:
```json
{
  "username": "string",
  "password": "string"
}
```

**Respuesta Exitosa** (200):
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "username": "usuario123",
    "email": "usuario@example.com",
    "first_name": "Juan",
    "last_name": "Pérez",
    "rol": "cliente"
  }
}
```

### 5. Crear Usuario por Admin

**Endpoint**: `POST /api/usuarios/crear-usuario/`  
**Descripción**: Permite a un admin crear usuarios (admin/trabajador)  
**Autenticación**: Requerida (Admin)  

**Parámetros**:
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "first_name": "string",
  "last_name": "string",
  "rol": "admin|trabajador"
}
```

**Respuesta Exitosa** (201):
```json
{
  "id": 2,
  "username": "trabajador1",
  "email": "trabajador@example.com",
  "first_name": "María",
  "last_name": "González",
  "rol": "trabajador",
  "is_active": true
}
```

### 6. Cambiar Contraseña

**Endpoint**: `POST /api/usuarios/cambiar-password/`  
**Descripción**: Permite al usuario cambiar su contraseña  
**Autenticación**: Requerida  

**Parámetros**:
```json
{
  "old_password": "string",
  "new_password": "string",
  "new_password2": "string"
}
```

**Respuesta Exitosa** (200):
```json
{
  "message": "Contraseña cambiada exitosamente"
}
```

### 7. Perfil de Usuario

**Endpoint**: `GET /api/usuarios/perfil/`  
**Descripción**: Obtiene información del perfil del usuario autenticado  
**Autenticación**: Requerida  

**Respuesta Exitosa** (200):
```json
{
  "id": 1,
  "username": "usuario123",
  "email": "usuario@example.com",
  "first_name": "Juan",
  "last_name": "Pérez",
  "telefono": "+56912345678",
  "rol": "cliente",
  "is_active": true,
  "date_joined": "2024-01-15T10:30:00Z"
}
```

### 8. Lista de Usuarios

**Endpoint**: `GET /api/usuarios/`  
**Descripción**: Lista todos los usuarios (solo admin)  
**Autenticación**: Requerida (Admin)  

**Parámetros de Query**:
- `rol`: Filtrar por rol (admin, trabajador, cliente)
- `search`: Búsqueda por nombre o email

**Respuesta Exitosa** (200):
```json
{
  "count": 10,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "username": "admin",
      "email": "admin@example.com",
      "first_name": "Admin",
      "last_name": "Sistema",
      "rol": "admin",
      "is_active": true
    }
  ]
}
```

### 9. Detalle de Trabajador

**Endpoint**: `GET /api/usuarios/trabajador/{id}/`  
**Descripción**: Obtiene detalles de un trabajador específico  
**Autenticación**: Requerida (Admin)  

**Respuesta Exitosa** (200):
```json
{
  "id": 2,
  "username": "trabajador1",
  "email": "trabajador@example.com",
  "first_name": "María",
  "last_name": "González",
  "rol": "trabajador",
  "is_active": true,
  "date_joined": "2024-01-15T10:30:00Z"
}
```

### 10. Editar Trabajador

**Endpoint**: `PUT /api/usuarios/trabajador/{id}/editar/`  
**Descripción**: Edita información de un trabajador  
**Autenticación**: Requerida (Admin)  

**Parámetros**:
```json
{
  "username": "string",
  "email": "string",
  "first_name": "string",
  "last_name": "string",
  "is_active": true
}
```

**Respuesta Exitosa** (200):
```json
{
  "id": 2,
  "username": "trabajador1",
  "email": "trabajador@example.com",
  "first_name": "María",
  "last_name": "González",
  "rol": "trabajador",
  "is_active": true
}
```

### 11. Eliminar Trabajador

**Endpoint**: `DELETE /api/usuarios/trabajador/{id}/eliminar/`  
**Descripción**: Elimina un trabajador (desactiva)  
**Autenticación**: Requerida (Admin)  

**Respuesta Exitosa** (204): Sin contenido

## Gestión de Productos

### 12. Lista de Productos

**Endpoint**: `GET /api/productos/`  
**Descripción**: Lista todos los productos  
**Autenticación**: No requerida  

**Parámetros de Query**:
- `search`: Búsqueda por nombre o descripción
- `categoria`: Filtrar por categoría
- `precio_min`: Precio mínimo
- `precio_max`: Precio máximo
- `ordering`: Ordenar por (nombre, precio, fecha_creacion)

**Respuesta Exitosa** (200):
```json
{
  "count": 50,
  "next": "http://localhost:8000/api/productos/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "sku": "MART001",
      "nombre": "Martillo Profesional",
      "descripcion": "Martillo de acero inoxidable",
      "precio": 25.99,
      "categoria": "Herramientas",
      "imagen": "http://localhost:8000/media/productos/martillo.jpg",
      "fecha_creacion": "2024-01-15T10:30:00Z",
      "fecha_actualizacion": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### 13. Detalle de Producto

**Endpoint**: `GET /api/productos/{id}/`  
**Descripción**: Obtiene detalles de un producto específico  
**Autenticación**: No requerida  

**Respuesta Exitosa** (200):
```json
{
  "id": 1,
  "sku": "MART001",
  "nombre": "Martillo Profesional",
  "descripcion": "Martillo de acero inoxidable",
  "precio": 25.99,
  "categoria": "Herramientas",
  "imagen": "http://localhost:8000/media/productos/martillo.jpg",
  "fecha_creacion": "2024-01-15T10:30:00Z",
  "fecha_actualizacion": "2024-01-15T10:30:00Z",
  "stock_tiendas": [
    {
      "tienda": {
        "id": 1,
        "nombre": "Ferretería Central",
        "direccion": "Av. Principal 123"
      },
      "cantidad": 15
    }
  ]
}
```

### 14. Crear Producto

**Endpoint**: `POST /api/productos/`  
**Descripción**: Crea un nuevo producto  
**Autenticación**: Requerida (Admin)  

**Parámetros** (multipart/form-data):
```json
{
  "sku": "string",
  "nombre": "string",
  "descripcion": "string",
  "precio": "decimal",
  "categoria": "string",
  "imagen": "file"
}
```

**Respuesta Exitosa** (201):
```json
{
  "id": 2,
  "sku": "DEST001",
  "nombre": "Destornillador Phillips",
  "descripcion": "Destornillador profesional",
  "precio": 12.50,
  "categoria": "Herramientas",
  "imagen": "http://localhost:8000/media/productos/destornillador.jpg",
  "fecha_creacion": "2024-01-15T11:00:00Z",
  "fecha_actualizacion": "2024-01-15T11:00:00Z"
}
```

### 15. Actualizar Producto

**Endpoint**: `PUT /api/productos/{id}/`  
**Descripción**: Actualiza un producto existente  
**Autenticación**: Requerida (Admin)  

**Parámetros** (multipart/form-data):
```json
{
  "sku": "string",
  "nombre": "string",
  "descripcion": "string",
  "precio": "decimal",
  "categoria": "string",
  "imagen": "file"
}
```

**Respuesta Exitosa** (200):
```json
{
  "id": 1,
  "sku": "MART001",
  "nombre": "Martillo Profesional Mejorado",
  "descripcion": "Martillo de acero inoxidable con mango ergonómico",
  "precio": 29.99,
  "categoria": "Herramientas",
  "imagen": "http://localhost:8000/media/productos/martillo_mejorado.jpg",
  "fecha_creacion": "2024-01-15T10:30:00Z",
  "fecha_actualizacion": "2024-01-15T12:00:00Z"
}
```

### 16. Eliminar Producto

**Endpoint**: `DELETE /api/productos/{id}/`  
**Descripción**: Elimina un producto  
**Autenticación**: Requerida (Admin)  

**Respuesta Exitosa** (204): Sin contenido

## Gestión de Tiendas

### 17. Lista de Tiendas

**Endpoint**: `GET /api/tiendas/`  
**Descripción**: Lista todas las tiendas  
**Autenticación**: No requerida  

**Respuesta Exitosa** (200):
```json
{
  "count": 3,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "nombre": "Ferretería Central",
      "direccion": "Av. Principal 123",
      "telefono": "+56912345678",
      "email": "central@ferremas.com",
      "activa": true
    }
  ]
}
```

### 18. Crear Tienda

**Endpoint**: `POST /api/tiendas/`  
**Descripción**: Crea una nueva tienda  
**Autenticación**: Requerida (Admin)  

**Parámetros**:
```json
{
  "nombre": "string",
  "direccion": "string",
  "telefono": "string",
  "email": "string"
}
```

**Respuesta Exitosa** (201):
```json
{
  "id": 2,
  "nombre": "Ferretería Norte",
  "direccion": "Calle Norte 456",
  "telefono": "+56987654321",
  "email": "norte@ferremas.com",
  "activa": true
}
```

## Gestión de Stock

### 19. Lista de Stock por Tienda

**Endpoint**: `GET /api/stock-tienda/`  
**Descripción**: Lista el stock de productos por tienda  
**Autenticación**: Requerida (Admin/Trabajador)  

**Parámetros de Query**:
- `tienda`: ID de la tienda
- `producto`: ID del producto
- `cantidad_min`: Cantidad mínima en stock

**Respuesta Exitosa** (200):
```json
{
  "count": 25,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "producto": {
        "id": 1,
        "sku": "MART001",
        "nombre": "Martillo Profesional"
      },
      "tienda": {
        "id": 1,
        "nombre": "Ferretería Central"
      },
      "cantidad": 15,
      "fecha_actualizacion": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### 20. Actualizar Stock

**Endpoint**: `PUT /api/stock-tienda/{id}/`  
**Descripción**: Actualiza la cantidad de stock de un producto en una tienda  
**Autenticación**: Requerida (Admin/Trabajador)  

**Parámetros**:
```json
{
  "cantidad": 20
}
```

**Respuesta Exitosa** (200):
```json
{
  "id": 1,
  "producto": {
    "id": 1,
    "sku": "MART001",
    "nombre": "Martillo Profesional"
  },
  "tienda": {
    "id": 1,
    "nombre": "Ferretería Central"
  },
  "cantidad": 20,
  "fecha_actualizacion": "2024-01-15T12:00:00Z"
}
```

## Gestión de Carrito y Órdenes

### 21. Lista de Carritos

**Endpoint**: `GET /api/carritos/`  
**Descripción**: Lista los carritos del usuario autenticado  
**Autenticación**: Requerida  

**Respuesta Exitosa** (200):
```json
{
  "count": 2,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "usuario": 1,
      "productos": [
        {
          "producto": {
            "id": 1,
            "nombre": "Martillo Profesional",
            "precio": 25.99
          },
          "cantidad": 2,
          "subtotal": 51.98
        }
      ],
      "total": 51.98,
      "fecha_creacion": "2024-01-15T10:30:00Z",
      "estado": "pendiente"
    }
  ]
}
```

### 22. Crear Carrito

**Endpoint**: `POST /api/carritos/`  
**Descripción**: Crea un nuevo carrito o agrega productos al existente  
**Autenticación**: Requerida  

**Parámetros**:
```json
{
  "productos": [
    {
      "producto": 1,
      "cantidad": 2
    }
  ]
}
```

**Respuesta Exitosa** (201):
```json
{
  "id": 1,
  "usuario": 1,
  "productos": [
    {
      "producto": {
        "id": 1,
        "nombre": "Martillo Profesional",
        "precio": 25.99
      },
      "cantidad": 2,
      "subtotal": 51.98
    }
  ],
  "total": 51.98,
  "fecha_creacion": "2024-01-15T10:30:00Z",
  "estado": "pendiente"
}
```

### 23. Actualizar Carrito

**Endpoint**: `PUT /api/carritos/{id}/`  
**Descripción**: Actualiza productos en el carrito  
**Autenticación**: Requerida  

**Parámetros**:
```json
{
  "productos": [
    {
      "producto": 1,
      "cantidad": 3
    }
  ]
}
```

**Respuesta Exitosa** (200):
```json
{
  "id": 1,
  "usuario": 1,
  "productos": [
    {
      "producto": {
        "id": 1,
        "nombre": "Martillo Profesional",
        "precio": 25.99
      },
      "cantidad": 3,
      "subtotal": 77.97
    }
  ],
  "total": 77.97,
  "fecha_creacion": "2024-01-15T10:30:00Z",
  "estado": "pendiente"
}
```

### 24. Eliminar Carrito

**Endpoint**: `DELETE /api/carritos/{id}/`  
**Descripción**: Elimina un carrito  
**Autenticación**: Requerida  

**Respuesta Exitosa** (204): Sin contenido

### 25. Órdenes del Usuario

**Endpoint**: `GET /api/carritos/user_orders/`  
**Descripción**: Lista las órdenes del usuario autenticado  
**Autenticación**: Requerida  

**Respuesta Exitosa** (200):
```json
{
  "count": 5,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "usuario": 1,
      "productos": [
        {
          "producto": {
            "id": 1,
            "nombre": "Martillo Profesional",
            "precio": 25.99
          },
          "cantidad": 2,
          "subtotal": 51.98
        }
      ],
      "total": 51.98,
      "fecha_creacion": "2024-01-15T10:30:00Z",
      "estado": "completada",
      "mercadopago_id": "123456789"
    }
  ]
}
```

## Conversión de Monedas

### 26. Convertir Moneda

**Endpoint**: `GET /api/convertir-moneda/`  
**Descripción**: Convierte una cantidad de una moneda a otra  
**Autenticación**: No requerida  

**Parámetros de Query**:
- `cantidad`: Cantidad a convertir (decimal)
- `moneda_origen`: Moneda de origen (ej: USD, EUR, CLP)
- `moneda_destino`: Moneda de destino (ej: USD, EUR, CLP)

**Respuesta Exitosa** (200):
```json
{
  "cantidad_origen": 100.00,
  "moneda_origen": "USD",
  "cantidad_convertida": 90.50,
  "moneda_destino": "EUR",
  "tasa_cambio": 0.905,
  "fecha_conversion": "2024-01-15T10:30:00Z"
}
```

**Respuesta de Error** (400):
```json
{
  "error": "La moneda de destino 'XXX' no está disponible"
}
```

## Sistema de Contacto

### 27. Enviar Mensaje de Contacto

**Endpoint**: `POST /api/contacto/`  
**Descripción**: Envía un mensaje de contacto  
**Autenticación**: No requerida  

**Parámetros**:
```json
{
  "nombre": "string",
  "email": "string",
  "asunto": "string",
  "mensaje": "string"
}
```

**Respuesta Exitosa** (201):
```json
{
  "id": 1,
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "asunto": "Consulta sobre productos",
  "mensaje": "Hola, necesito información sobre...",
  "fecha_envio": "2024-01-15T10:30:00Z",
  "leido": false
}
```

### 28. Lista de Mensajes

**Endpoint**: `GET /api/contacto/mensajes/`  
**Descripción**: Lista todos los mensajes de contacto  
**Autenticación**: Requerida (Admin)  

**Parámetros de Query**:
- `leido`: Filtrar por estado (true/false)
- `search`: Búsqueda por nombre, email o asunto
- `fecha_desde`: Fecha desde (YYYY-MM-DD)
- `fecha_hasta`: Fecha hasta (YYYY-MM-DD)

**Respuesta Exitosa** (200):
```json
{
  "count": 15,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "nombre": "Juan Pérez",
      "email": "juan@example.com",
      "asunto": "Consulta sobre productos",
      "mensaje": "Hola, necesito información sobre...",
      "fecha_envio": "2024-01-15T10:30:00Z",
      "leido": false
    }
  ]
}
```

### 29. Detalle de Mensaje

**Endpoint**: `GET /api/contacto/mensajes/{mensaje_id}/`  
**Descripción**: Obtiene detalles de un mensaje específico  
**Autenticación**: Requerida (Admin)  

**Respuesta Exitosa** (200):
```json
{
  "id": 1,
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "asunto": "Consulta sobre productos",
  "mensaje": "Hola, necesito información sobre...",
  "fecha_envio": "2024-01-15T10:30:00Z",
  "leido": false
}
```

### 30. Estadísticas de Contacto

**Endpoint**: `GET /api/contacto/estadisticas/`  
**Descripción**: Obtiene estadísticas de mensajes de contacto  
**Autenticación**: Requerida (Admin)  

**Respuesta Exitosa** (200):
```json
{
  "total_mensajes": 150,
  "mensajes_leidos": 120,
  "mensajes_no_leidos": 30,
  "mensajes_hoy": 5,
  "mensajes_semana": 25,
  "mensajes_mes": 100,
  "promedio_respuesta_horas": 2.5
}
```

## Códigos de Estado HTTP

| Código | Descripción | Uso |
|--------|-------------|-----|
| 200 | OK | Operación exitosa |
| 201 | Created | Recurso creado exitosamente |
| 204 | No Content | Operación exitosa sin contenido |
| 400 | Bad Request | Datos de entrada inválidos |
| 401 | Unauthorized | Autenticación requerida |
| 403 | Forbidden | Permisos insuficientes |
| 404 | Not Found | Recurso no encontrado |
| 500 | Internal Server Error | Error interno del servidor |

## Manejo de Errores

### Formato de Error Estándar

```json
{
  "error": "Descripción del error",
  "detail": "Detalles adicionales",
  "code": "ERROR_CODE"
}
```

### Errores Comunes

**Validación de Datos** (400):
```json
{
  "error": "Datos de entrada inválidos",
  "detail": {
    "username": ["Este campo es requerido"],
    "email": ["Ingrese un email válido"]
  }
}
```

**Autenticación** (401):
```json
{
  "detail": "Las credenciales proporcionadas no son válidas"
}
```

**Permisos** (403):
```json
{
  "detail": "No tiene permisos para realizar esta acción"
}
```

**Recurso No Encontrado** (404):
```json
{
  "detail": "No se encontró el recurso solicitado"
}
```

## Rate Limiting

- **Endpoints públicos**: 100 requests por minuto
- **Endpoints autenticados**: 1000 requests por minuto
- **Endpoints de autenticación**: 5 requests por minuto

## Paginación

Los endpoints que devuelven listas utilizan paginación estándar:

```json
{
  "count": 100,
  "next": "http://localhost:8000/api/productos/?page=2",
  "previous": null,
  "results": [...]
}
```

**Parámetros de paginación**:
- `page`: Número de página (por defecto: 1)
- `page_size`: Elementos por página (por defecto: 20, máximo: 100) 