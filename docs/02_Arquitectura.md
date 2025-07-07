# 2. Arquitectura

## Diagrama de Arquitectura General

```mermaid
graph TB
    subgraph "Cliente"
        A[Usuario] --> B[Navegador Web]
        B --> C[React App]
    end
    
    subgraph "Frontend (React + Vite)"
        C --> D[Componentes React]
        D --> E[Context API]
        E --> F[Axios Client]
    end
    
    subgraph "Backend (Django REST)"
        G[Django Server]
        H[URLs Router]
        I[Views/ViewSets]
        J[Serializers]
        K[Models]
        L[Permissions]
        M[Authentication]
    end
    
    subgraph "Base de Datos"
        N[Supabase PostgreSQL]
    end
    
    subgraph "APIs Externas"
        O[MercadoPago API]
        P[ExchangeRate API]
    end
    
    subgraph "Servicios"
        Q[Email Service]
        R[File Storage]
    end
    
    F --> G
    G --> H
    H --> I
    I --> J
    J --> K
    I --> L
    I --> M
    K --> N
    
    I --> O
    I --> P
    I --> Q
    I --> R
    
    style A fill:#e1f5fe
    style C fill:#f3e5f5
    style G fill:#e8f5e8
    style N fill:#fff3e0
    style O fill:#ffebee
    style P fill:#f1f8e9
```

## Arquitectura de Capas

```mermaid
graph LR
    subgraph "Capa de Presentación"
        A[React Components]
        B[Pages]
        C[Layouts]
    end
    
    subgraph "Capa de Lógica de Negocio"
        D[Context Providers]
        E[Custom Hooks]
        F[Services]
    end
    
    subgraph "Capa de API"
        G[Axios Config]
        H[API Endpoints]
    end
    
    subgraph "Capa de Autenticación"
        I[JWT Tokens]
        J[Role Management]
    end
    
    A --> D
    B --> D
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> J
```

## Flujo de Datos

### 1. Flujo de Autenticación

```mermaid
sequenceDiagram
    participant U as Usuario
    participant F as Frontend
    participant B as Backend
    participant DB as Base de Datos
    
    U->>F: Ingresa credenciales
    F->>B: POST /api/token/
    B->>DB: Valida credenciales
    DB-->>B: Usuario válido
    B-->>F: JWT Access + Refresh Token
    F->>F: Almacena tokens
    F-->>U: Redirige a dashboard
```

### 2. Flujo de Gestión de Productos

```mermaid
sequenceDiagram
    participant A as Admin
    participant F as Frontend
    participant B as Backend
    participant DB as Base de Datos
    
    A->>F: Crea/Edita producto
    F->>B: POST/PUT /api/productos/
    B->>B: Valida permisos (IsAdminUser)
    B->>DB: Guarda producto
    DB-->>B: Producto guardado
    B-->>F: Respuesta con datos
    F-->>A: Confirma operación
```

### 3. Flujo de Carrito y Pagos

```mermaid
sequenceDiagram
    participant C as Cliente
    participant F as Frontend
    participant B as Backend
    participant MP as MercadoPago
    participant DB as Base de Datos
    
    C->>F: Agrega productos al carrito
    F->>B: POST /api/carritos/
    B->>DB: Guarda carrito
    DB-->>B: Carrito creado
    
    C->>F: Procede al checkout
    F->>B: POST /api/carritos/checkout/
    B->>MP: Crea preferencia de pago
    MP-->>B: Preference ID
    B->>DB: Actualiza orden
    B-->>F: URL de pago
    F-->>C: Redirige a MercadoPago
    
    C->>MP: Completa pago
    MP-->>F: Webhook/Redirect
    F->>B: POST /api/carritos/webhook/
    B->>MP: Verifica pago
    B->>DB: Actualiza estado orden
```

### 4. Flujo de Conversión de Monedas

```mermaid
sequenceDiagram
    participant F as Frontend
    participant B as Backend
    participant EA as ExchangeRate API
    participant DB as Base de Datos
    
    F->>B: GET /api/convertir-moneda/
    B->>EA: GET /v6/{api_key}/latest/{base}
    EA-->>B: Tasas de cambio
    B->>B: Calcula conversión
    B-->>F: Monto convertido
    F->>F: Actualiza UI
```

## Estructura de Directorios

### Frontend (`ferremas_frontend/`)
```
src/
├── components/          # Componentes reutilizables
│   ├── Carrito/        # Componentes del carrito
│   ├── Checkout/       # Componentes de checkout
│   └── productos/      # Componentes de productos
├── context/            # Context API providers
├── hooks/              # Custom hooks
├── layouts/            # Layouts de página
├── pages/              # Páginas principales
│   ├── admin/          # Páginas de administración
│   ├── carrito/        # Páginas del carrito
│   ├── checkout/       # Páginas de checkout
│   └── productos/      # Páginas de productos
├── services/           # Servicios de API
├── utils/              # Utilidades
└── Styles/             # Estilos CSS
```

### Backend (`ferremas_backend/`)
```
├── config/             # Configuración de Django
│   ├── settings.py     # Configuración principal
│   ├── urls.py         # URLs principales
│   └── middleware.py   # Middleware personalizado
├── usuarios/           # App de gestión de usuarios
├── productos/          # App de gestión de productos
├── carrito/            # App del carrito y órdenes
├── conversor_monedas/  # App de conversión de monedas
├── contacto/           # App de contacto
└── manage.py           # Script de gestión de Django
```

## Patrones de Diseño Implementados

### 1. Model-View-Controller (MVC)
- **Models**: Django ORM models en cada app
- **Views**: Django REST Framework ViewSets y APIViews
- **Controllers**: Serializers que manejan la lógica de negocio

### 2. Repository Pattern
- Servicios encapsulan la lógica de acceso a datos
- Separación entre lógica de negocio y acceso a datos

### 3. Factory Pattern
- Creación de instancias de servicios externos (MercadoPago, ExchangeRate)

### 4. Observer Pattern
- Context API en React para manejo de estado global
- Webhooks para notificaciones de pagos

### 5. Strategy Pattern
- Diferentes estrategias de autenticación (JWT, Session)
- Múltiples métodos de pago (MercadoPago, otros en futuro)

## Comunicación entre Componentes

### Frontend ↔ Backend
- **Protocolo**: HTTP/HTTPS
- **Formato**: JSON
- **Autenticación**: JWT Bearer Token
- **CORS**: Configurado para desarrollo y producción

### Backend ↔ Base de Datos
- **ORM**: Django ORM
- **Conexión**: PostgreSQL a través de Supabase
- **Pooling**: Configurado automáticamente por Supabase

### Backend ↔ APIs Externas
- **MercadoPago**: SDK oficial de Python
- **ExchangeRate**: Requests HTTP client
- **Retry Logic**: Implementado para APIs externas

## Consideraciones de Escalabilidad

### Horizontal Scaling
- **Frontend**: Stateless, puede escalar horizontalmente
- **Backend**: Django con soporte para múltiples instancias
- **Base de Datos**: Supabase maneja escalabilidad automáticamente

### Vertical Scaling
- **Caching**: Implementar Redis para cache
- **CDN**: Para archivos estáticos e imágenes
- **Load Balancing**: Nginx o similar para distribución de carga

### Microservicios (Futuro)
- Separar servicios por dominio (usuarios, productos, pagos)
- API Gateway para enrutamiento
- Message Queue para comunicación asíncrona

## Seguridad

### Autenticación
- JWT tokens con expiración configurable
- Refresh tokens para renovación automática
- Blacklist de tokens revocados

### Autorización
- Permisos basados en roles (Admin, Trabajador, Cliente)
- Permisos granulares por operación
- Validación en frontend y backend

### Protección de Datos
- HTTPS obligatorio en producción
- Validación de entrada en todos los endpoints
- Sanitización de datos antes de almacenar
- CORS configurado apropiadamente

## Monitoreo y Logging

### Logging
- Django logging configurado
- Logs estructurados para debugging
- Rotación de logs automática

### Métricas
- Endpoints de health check
- Métricas de performance
- Monitoreo de APIs externas

### Alertas
- Notificaciones de errores críticos
- Alertas de disponibilidad de servicios
- Monitoreo de transacciones de pago 