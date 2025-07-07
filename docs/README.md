# Documentación Técnica - Ferremas

## Descripción

Esta documentación técnica completa describe el sistema Ferremas, una aplicación web full-stack para la gestión de ferreterías. El sistema incluye gestión de productos, usuarios, carrito de compras, pagos y conversión de monedas.

## Estructura de la Documentación

### 📋 [01_Introduccion.md](01_Introduccion.md)
- Nombre del proyecto y objetivos
- Público objetivo
- Tecnologías utilizadas
- Características principales
- Estado del proyecto

### 🏗️ [02_Arquitectura.md](02_Arquitectura.md)
- Diagramas de arquitectura (Mermaid)
- Flujo de datos entre componentes
- Estructura de directorios
- Patrones de diseño implementados
- Consideraciones de escalabilidad

### 🔌 [03_APIs_Locales.md](03_APIs_Locales.md)
- Lista completa de endpoints del backend
- Parámetros, respuestas y códigos de estado
- Ejemplos de requests y responses
- Autenticación y permisos
- Manejo de errores

### 🌐 [04_APIs_Externas.md](04_APIs_Externas.md)
- Integración con MercadoPago
- Integración con ExchangeRate API
- Configuración y autenticación
- Ejemplos de uso
- Manejo de errores y monitoreo

### ⚙️ [05_Configuracion_Entorno.md](05_Configuracion_Entorno.md)
- Variables de entorno necesarias
- Requisitos del sistema
- Instalación de dependencias
- Configuración de base de datos
- Verificación de configuración

### 🔒 [06_Seguridad.md](06_Seguridad.md)
- Sistema de autenticación JWT
- Roles y permisos
- Validaciones y sanitización
- Protección de datos sensibles
- Monitoreo de seguridad

### 🚀 [07_Guia_Despliegue.md](07_Guia_Despliegue.md)
- Instrucciones para desarrollo local
- Despliegue en Railway, Vercel, AWS
- Configuración de SSL/HTTPS
- Monitoreo y mantenimiento
- Troubleshooting

### 🧪 [08_Pruebas.md](08_Pruebas.md)
- Pruebas unitarias por componente
- Pruebas de integración
- Pruebas de rendimiento
- Pruebas de seguridad
- Integración continua (CI/CD)

### 📎 [09_Anexos.md](09_Anexos.md)
- Colección de Postman
- Enlaces útiles y recursos
- Capturas de pantalla
- Comandos útiles
- Troubleshooting

## Tecnologías Principales

### Frontend
- **React.js 18.2.0** - Framework principal
- **Vite 6.3.5** - Herramienta de construcción
- **Material-UI 7.1.0** - Biblioteca de componentes
- **Axios 1.6.7** - Cliente HTTP
- **React Router DOM 6.22.3** - Enrutamiento

### Backend
- **Django 5.1** - Framework web
- **Django REST Framework 3.16.0** - Framework para APIs
- **Django REST Framework Simple JWT 5.3.1** - Autenticación
- **PostgreSQL** - Base de datos (Supabase)

### APIs Externas
- **MercadoPago 2.3.0** - Procesamiento de pagos
- **ExchangeRate API** - Conversión de monedas

## Inicio Rápido

### Prerrequisitos
- Python 3.8+
- Node.js 16+
- PostgreSQL (o Supabase)

### Instalación

1. **Clonar repositorio**
   ```bash
   git clone https://github.com/tu-usuario/ferremas.git
   cd ferremas
   ```

2. **Configurar Backend**
   ```bash
   cd ferremas_backend
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   cp env.example .env
   # Editar .env con tus credenciales
   python manage.py migrate
   python manage.py createsuperuser
   python manage.py runserver
   ```

3. **Configurar Frontend**
   ```bash
   cd ferremas_frontend
   npm install
   echo "VITE_API_BASE_URL=http://localhost:8000/api" > .env
   npm run dev
   ```

4. **Acceder a la aplicación**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:8000
   - Admin: http://localhost:8000/admin
   - API Docs: http://localhost:8000/api/schema/swagger-ui/

## Características Principales

### 🔐 Autenticación y Autorización
- Sistema JWT con refresh tokens
- Roles diferenciados (Admin, Trabajador, Cliente)
- Protección de rutas por permisos

### 🛍️ Gestión de Productos
- CRUD completo de productos
- Control de stock por tienda
- Carga y gestión de imágenes
- Categorización y búsqueda

### 🛒 Sistema de Carrito
- Carrito de compras persistente
- Integración con MercadoPago
- Gestión de órdenes y estados

### 💱 Conversión de Monedas
- Soporte multi-moneda en tiempo real
- Integración con ExchangeRate API
- Conversiones automáticas

### 📞 Sistema de Contacto
- Formulario de contacto
- Gestión de mensajes
- Notificaciones automáticas

### 📊 Panel de Administración
- Dashboard con estadísticas
- Gestión de usuarios y productos
- Reportes y análisis

## Arquitectura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Base de       │
│   (React)       │◄──►│   (Django)      │◄──►│   Datos         │
│                 │    │                 │    │   (Supabase)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   MercadoPago   │    │  ExchangeRate   │    │   Storage       │
│   (Pagos)       │    │   API (Monedas) │    │   (Imágenes)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## APIs Disponibles

### Autenticación
- `POST /api/token/` - Obtener tokens JWT
- `POST /api/token/refresh/` - Renovar token
- `POST /api/usuarios/login/` - Login personalizado
- `POST /api/usuarios/registro/` - Registro de usuarios

### Usuarios
- `GET /api/usuarios/` - Listar usuarios (Admin)
- `GET /api/usuarios/perfil/` - Perfil del usuario
- `POST /api/usuarios/cambiar-password/` - Cambiar contraseña

### Productos
- `GET /api/productos/` - Listar productos
- `POST /api/productos/` - Crear producto (Admin)
- `PUT /api/productos/{id}/` - Actualizar producto (Admin)
- `DELETE /api/productos/{id}/` - Eliminar producto (Admin)

### Carrito
- `GET /api/carritos/` - Listar carritos del usuario
- `POST /api/carritos/` - Crear/actualizar carrito
- `GET /api/carritos/user_orders/` - Órdenes del usuario

### Conversión de Monedas
- `GET /api/convertir-moneda/` - Convertir moneda

### Contacto
- `POST /api/contacto/` - Enviar mensaje
- `GET /api/contacto/mensajes/` - Listar mensajes (Admin)

## Estado del Proyecto

### ✅ Completado
- Sistema de autenticación JWT
- Gestión de productos y stock
- Integración con MercadoPago
- Conversor de monedas
- Sistema de contacto
- Panel de administración básico
- Tests unitarios básicos

### 🚧 En Desarrollo
- Mejoras en la interfaz de usuario
- Reportes avanzados
- Notificaciones push
- Optimización de performance

### 📋 Pendiente
- Tests de integración completos
- Documentación de API completa
- Despliegue en producción
- Monitoreo y logging avanzado

## Contribución

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Realiza tus cambios
4. Ejecuta las pruebas (`python manage.py test`)
5. Haz commit de tus cambios (`git commit -m 'feat: Add some AmazingFeature'`)
6. Empuja la rama (`git push origin feature/AmazingFeature`)
7. Abre un Pull Request

## Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Contacto

- **Desarrollador**: [Tu Nombre]
- **Email**: [tu-email@dominio.com]
- **GitHub**: [tu-usuario-github]

## Enlaces Útiles

- [Documentación de Django](https://docs.djangoproject.com/)
- [Documentación de React](https://react.dev/)
- [Documentación de MercadoPago](https://www.mercadopago.com.ar/developers/es/docs)
- [Documentación de Supabase](https://supabase.com/docs)

---

**Nota**: Esta documentación está en constante actualización. Para la versión más reciente, consulta el repositorio de GitHub. 