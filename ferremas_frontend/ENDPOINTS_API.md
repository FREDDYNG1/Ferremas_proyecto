#  Ferremas API Endpoints - Guía para Postman

Esta guía contiene todos los endpoints de la API de Ferremas, con ejemplos de requests y responses para facilitar las pruebas en Postman.

**URL Base:** `http://localhost:8000/api`

---

## 🔑 Autenticación y Usuarios (`/usuarios/`)

### 1. Registro de Usuario (Cliente)
- **Endpoint:** `POST /usuarios/registro/`
- **Descripción:** Crea un nuevo usuario con rol de cliente.
- **Permisos:** Público
- **Request Body:**
  ```json
  {
    "first_name": "Juan",
    "last_name": "Perez",
    "email": "juan.perez@email.com",
    "password": "passwordSegura123",
    "role": "cliente",
    "direccion": "Av. Siempreviva 742",
    "comuna": "Providencia",
    "ciudad": "Santiago",
    "telefono": "+56912345678"
  }
  ```
- **Success Response (201 Created):**
  ```json
  {
    "id": 1,
    "email": "juan.perez@email.com",
    "first_name": "Juan",
    "last_name": "Perez",
    "role": "cliente",
    "direccion": "Av. Siempreviva 742",
    "comuna": "Providencia",
    "ciudad": "Santiago",
    "telefono": "+56912345678"
  }
  ```

### 2. Iniciar Sesión (Obtener Tokens)
- **Endpoint:** `POST /token/`
- **Descripción:** Autentica a un usuario y devuelve los tokens de acceso y refresco.
- **Permisos:** Público
- **Request Body:**
  ```json
  {
    "email": "juan.perez@email.com",
    "password": "passwordSegura123"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Nota:** Guarda el token `access` para autenticar las siguientes peticiones.

### 3. Refrescar Token de Acceso
- **Endpoint:** `POST /token/refresh/`
- **Descripción:** Genera un nuevo token de acceso usando el token de refresco.
- **Permisos:** Público
- **Request Body:**
  ```json
  {
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

### 4. Ver/Actualizar Perfil de Usuario
- **Endpoint:** `GET /usuarios/perfil/` o `PUT /usuarios/perfil/`
- **Descripción:** Obtiene o actualiza los datos del usuario autenticado.
- **Permisos:** Autenticado (Cualquier rol)
- **Authorization Header:** `Bearer <access_token>`
- **Request Body (para `PUT`):**
  ```json
  {
    "first_name": "Juan Alberto",
    "last_name": "Perez Gonzalez",
    "direccion": "Nueva Direccion 123",
    "telefono": "+56987654321"
  }
  ```
- **Success Response (200 OK):** Muestra el perfil del usuario (similar al del registro).

### 5. Crear Trabajador/Administrador
- **Endpoint:** `POST /usuarios/trabajadores/`
- **Descripción:** Un administrador crea un nuevo usuario con rol de trabajador o admin.
- **Permisos:** Solo Administrador
- **Authorization Header:** `Bearer <admin_access_token>`
- **Request Body:**
  ```json
  {
    "first_name": "Ana",
    "last_name": "Gomez",
    "email": "ana.gomez@ferremas.cl",
    "password": "passwordTrabajador456",
    "role": "trabajador"
  }
  ```
- **Success Response (201 Created):** Devuelve los datos del nuevo usuario.

---

## 📦 Productos y Stock (`/productos/`, `/tiendas/`, `/stock-tienda/`)

### 1. Listar Productos
- **Endpoint:** `GET /productos/`
- **Descripción:** Obtiene la lista de todos los productos.
- **Permisos:** Público
- **Success Response (200 OK):**
  ```json
  [
    {
      "id": 1,
      "nombre": "Martillo",
      "descripcion": "Martillo de carpintero con mango de goma.",
      "precio": 9990,
      "categoria": "Herramientas Manuales",
      "marca": "Ubermann",
      "stock_total": 50,
      "imagen_url": "/media/productos/martillo.jpg"
    }
  ]
  ```

### 2. Crear Producto
- **Endpoint:** `POST /productos/`
- **Descripción:** Crea un nuevo producto.
- **Permisos:** Administrador o Trabajador
- **Authorization Header:** `Bearer <admin/worker_access_token>`
- **Request Body (form-data):**
  - `nombre`: "Taladro Inalámbrico"
  - `descripcion`: "Potente taladro con 2 baterías de litio."
  - `precio`: 49990
  - `categoria`: "Herramientas Eléctricas"
  - `marca`: "Bauker"
  - `imagen`: (archivo de imagen)

### 3. Listar Tiendas
- **Endpoint:** `GET /tiendas/`
- **Descripción:** Obtiene la lista de todas las tiendas.
- **Permisos:** Público

### 4. Ajustar Stock
- **Endpoint:** `PUT /stock-tienda/<id>/ajustar_stock/`
- **Descripción:** Ajusta la cantidad de stock para un producto en una tienda específica.
- **Permisos:** Administrador o Trabajador
- **Authorization Header:** `Bearer <admin/worker_access_token>`
- **Request Body:**
  ```json
  {
    "cantidad": 50,
    "tipo_ajuste": "suma" // "suma" o "resta" o "reemplazo"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "id": 1,
    "producto": 1,
    "tienda": 1,
    "cantidad": 50
  }
  ```

---

## 🛒 Carrito de Compras (`/carritos/`)

### 1. Añadir Producto al Carrito
- **Endpoint:** `POST /carritos/add_item/`
- **Descripción:** Agrega un producto al carrito del usuario (o a un carrito de invitado).
- **Permisos:** Autenticado (Cliente) o Público (con `guest_cart_id`)
- **Request Body:**
  ```json
  {
    "producto_id": 1,
    "cantidad": 2
    // Opcional: "guest_cart_id": "uuid-del-carrito-invitado"
  }
  ```

### 2. Ver Carrito
- **Endpoint:** `GET /carritos/get_cart/`
- **Descripción:** Obtiene el contenido del carrito del usuario.
- **Permisos:** Autenticado (Cliente)
- **Authorization Header:** `Bearer <cliente_access_token>`
- **Query Params (para invitados):** `?guest_cart_id=<uuid>`
- **Success Response (200 OK):** Devuelve el objeto completo del carrito.

### 3. Crear Preferencia de Pago (MercadoPago)
- **Endpoint:** `POST /carritos/create_mercadopago_preference/`
- **Descripción:** Crea una preferencia de pago en MercadoPago para el carrito actual.
- **Permisos:** Autenticado (Cliente) o Público (con `guest_cart_id`)
- **Authorization Header:** `Bearer <cliente_access_token>` (opcional)
- **Request Body:**
  ```json
  {
    "guest_cart_id": "uuid-del-carrito-invitado"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "preference_id": "123456789-abc-def-ghi",
    "sandbox_init_point": "https://www.mercadopago.com/checkout/v1/redirect?pref_id=123456789-abc-def-ghi",
    "init_point": "https://www.mercadopago.com/checkout/v1/redirect?pref_id=123456789-abc-def-ghi"
  }
  ```

### 4. Simular Pago (Desarrollo)
- **Endpoint:** `POST /carritos/simulate_payment/`
- **Descripción:** Simula un pago exitoso para desarrollo y testing. Crea la orden, vacía el carrito y actualiza el stock.
- **Permisos:** Autenticado (Cliente) o Público (con `guest_cart_id`)
- **Authorization Header:** `Bearer <cliente_access_token>` (opcional)
- **Request Body:**
  ```json
  {
    "guest_cart_id": "uuid-del-carrito-invitado",
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "telefono": "+56912345678",
    "direccion": "Av. Principal 123",
    "ciudad": "Santiago",
    "codigo_postal": "8320000"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "status": "success",
    "order_id": "uuid-de-la-orden",
    "payment_id": "SIM-uuid-carrito-timestamp",
    "message": "Pago simulado procesado exitosamente"
  }
  ```

### 5. Webhook de MercadoPago
- **Endpoint:** `POST /carritos/webhook/`
- **Descripción:** Recibe notificaciones de MercadoPago sobre cambios en el estado de una orden.
- **Permisos:** Público
- **Request Body:**
  ```json
  {
    "topic": "payment.updated",
    "resource": {
      "id": "123456789-abc-def-ghi",
      "status": "approved",
      "payment_id": "123456789-abc-def-ghi",
      "order_id": "123456789-abc-def-ghi",
      "external_reference": "123456789-abc-def-ghi",
      "date_created": "2023-04-01T12:00:00Z",
      "date_approved": "2023-04-01T12:00:00Z",
      "date_last_modified": "2023-04-01T12:00:00Z",
      "money_release_date": "2023-04-01T12:00:00Z",
      "currency_id": "CLP",
      "transaction_amount": 10000,
      "total_paid_amount": 10000,
      "shipping_cost": 0,
      "net_received_amount": 9500,
      "marketplace_fee_amount": 0,
      "payer": {
        "id": "123456789",
        "email": "juan@example.com",
        "first_name": "Juan",
        "last_name": "Perez",
        "phone": {
          "area_code": "+56",
          "number": "912345678"
        },
        "identification": {
          "type": "DNI",
          "number": "123456789"
        },
        "address": {
          "street_name": "Av. Principal",
          "street_number": "123",
          "zip_code": "8320000"
        }
      },
      "shipping": {
        "id": "123456789-abc-def-ghi",
        "name": "Juan Perez",
        "address": {
          "street_name": "Av. Principal",
          "street_number": "123",
          "zip_code": "8320000"
        }
      },
      "items": [
        {
          "id": "123456789-abc-def-ghi",
          "title": "Taladro Inalámbrico Bauker",
          "quantity": 1,
          "unit_price": 10000,
          "currency_id": "CLP"
        }
      ],
      "additional_info": "Información adicional de la orden"
    }
  }
  ```

---

## 📧 Contacto (`/contacto/`)

### 1. Enviar Mensaje de Contacto
- **Endpoint:** `POST /contacto/`
- **Descripción:** Permite a cualquier usuario enviar un mensaje de contacto.
- **Permisos:** Público
- **Request Body:**
  ```json
  {
    "nombre": "Cliente Interesado",
    "email": "interesado@email.com",
    "asunto": "Consulta sobre disponibilidad",
    "mensaje": "Hola, ¿tienen stock del taladro inalámbrico Bauker?"
  }
  ```

### 2. Listar Mensajes
- **Endpoint:** `GET /contacto/mensajes/`
- **Descripción:** Obtiene la lista de todos los mensajes de contacto.
- **Permisos:** Administrador o Trabajador
- **Authorization Header:** `Bearer <admin/worker_access_token>`
- **Query Params (opcionales para filtrar):**
  - `search`: texto a buscar
  - `asunto`: filtrar por asunto
  - `fecha_desde`: YYYY-MM-DD
  - `fecha_hasta`: YYYY-MM-DD
  - `ordenar_por`: `fecha_envio`, `-fecha_envio` (default), `nombre`, `email`
  - `page`: número de página
  - `page_size`: resultados por página

### 3. Eliminar Mensaje
- **Endpoint:** `DELETE /contacto/mensajes/<id>/`
- **Descripción:** Elimina un mensaje de contacto específico.
- **Permisos:** Administrador o Trabajador
- **Authorization Header:** `Bearer <admin/worker_access_token>`
- **Success Response:** `204 No Content`

### 4. Ver Estadísticas de Mensajes
- **Endpoint:** `GET /contacto/estadisticas/`
- **Descripción:** Devuelve estadísticas sobre los mensajes recibidos.
- **Permisos:** Administrador o Trabajador
- **Authorization Header:** `Bearer <admin/worker_access_token>`
- **Success Response (200 OK):**
  ```json
  {
    "mensajes_hoy": 2,
    "mensajes_semana": 15,
    "mensajes_mes": 60,
    "total_mensajes": 125,
    "mensajes_sin_leer": 4
  }
  ```

---

## 💵 Conversor de Moneda (`/convertir-moneda/`)

### 1. Convertir un Monto
- **Endpoint:** `GET /convertir-moneda/`
- **Descripción:** Convierte una cantidad de una moneda a otra.
- **Permisos:** Público
- **Query Params:**
  - `de`: "USD"
  - `a`: "CLP"
  - `cantidad`: 100
- **URL Completa de Ejemplo:** `http://localhost:8000/api/convertir-moneda/?de=USD&a=CLP&cantidad=100`
- **Success Response (200 OK):**
  ```json
  {
    "cantidad_convertida": 93050.00
  }
  ```

--- 