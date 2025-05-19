# Ferremas - Sistema de Gestión para Ferretería

## Descripción
Ferremas es una aplicación web full-stack diseñada para la gestión de una ferretería. El sistema permite administrar inventario, ventas, usuarios y otros aspectos esenciales del negocio.

## Estructura del Proyecto
El proyecto está dividido en dos partes principales:

### Frontend (`ferremas_frontend/`)
- Desarrollado con React.js y Vite
- Utiliza Material-UI (MUI) para la interfaz de usuario
- Implementa Bootstrap para estilos adicionales
- Manejo de rutas con React Router DOM
- Comunicación con el backend mediante Axios

### Backend (`ferremas_backend/`)
- Desarrollado con Django (Python) y Django REST Framework
- Utiliza Supabase como base de datos y para almacenamiento (futuro)
- Arquitectura RESTful
- Sistema de autenticación y autorización basado en JWT
- Gestión de base de datos con migraciones de Django

## Tecnologías Principales

### Frontend
- React.js 18.2.0
- Vite 6.3.5
- Material-UI 7.1.0
- Bootstrap 5.3.6
- React Router DOM 6.22.3
- Axios 1.6.7
- JWT Decode 4.0.0

### Backend
- Django
- Django REST Framework
- Python
- Supabase (Base de Datos y Storage)
- JWT (JSON Web Tokens)
- Pillow (para manejo de imágenes)

## Requisitos Previos
- Node.js (v16 o superior)
- Python 3.8 o superior
- pip (gestor de paquetes de Python)
- npm o yarn (gestor de paquetes de Node.js)
- Una instancia de Supabase (configurar credenciales en `ferremas_backend/config/settings.py`)

## Instalación y Configuración

### Backend
1. Configurar la conexión a tu base de datos Supabase en `ferremas_backend/config/settings.py`. Puedes usar variables de entorno o configurar directamente (¡recomendado usar variables de entorno para producción!).
2. Navegar al directorio del backend:
   ```bash
   cd ferremas_backend
   ```
3. Crear y activar entorno virtual:
   ```bash
   python -m venv venv
   source venv/bin/activate  # En Windows: venv\Scripts\activate
   ```
4. Instalar dependencias:
   ```bash
   pip install -r requirements.txt
   ```
5. Aplicar migraciones para configurar la base de datos Supabase:
   ```bash
   python manage.py migrate
   ```
6. **Crear un Superusuario (Administrador) de Django:** Necesario para acceder al panel de administración y crear otros usuarios.
   ```bash
   python manage.py createsuperuser
   ```
   Sigue las indicaciones para crear el usuario. Asegúrate de asignarle el rol 'admin' directamente en la tabla `usuarios_customeruser` en Supabase si no se asigna automáticamente durante la creación del superusuario.
7. Iniciar el servidor de desarrollo del backend:
   ```bash
   python manage.py runserver
   ```

### Frontend
1. Navegar al directorio del frontend en una nueva terminal:
   ```bash
   cd ferremas_frontend
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Iniciar el servidor de desarrollo del frontend:
   ```bash
   npm run dev
   ```

## Funcionalidades Implementadas (Parcial)
- **Autenticación:** Registro de clientes, inicio de sesión con JWT para diferentes roles (admin, trabajador, cliente).
- **Panel de Administración (`/admin`):** Dashboard con enlaces a la gestión de productos y usuarios.
- **Gestión de Productos (`/admin/productos`):** Listado, creación y edición de productos (incluyendo carga de imágenes en desarrollo).
- **Gestión de Usuarios (`/admin/usuarios`):** Creación de usuarios (admin/trabajador) y listado de trabajadores.
- **Páginas de Rol:** Páginas de inicio básicas para Cliente (`/cliente`) y Trabajador (`/trabajador`).
- **Cambio de Contraseña:** Funcionalidad para cambiar la contraseña.

## Scripts Disponibles

### Frontend
- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm run lint`: Ejecuta el linter
- `npm run preview`: Previsualiza la versión de producción

## Estructura de Carpetas

### Frontend
```
ferremas_frontend/
├── public/           # Archivos estáticos
├── src/              # Código fuente (componentes, páginas, layouts, context, utils)
└── ...
```

### Backend
```
ferremas_backend/
├── config/           # Configuración de Django
├── productos/        # Aplicación de productos
├── usuarios/         # Aplicación de usuarios
├── venv/            # Entorno virtual
└── ...
```

## Contribución
1. Fork el repositorio
2. Clona tu fork: `git clone [URL de tu fork]`
3. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
4. Realiza tus cambios.
5. Haz commit de tus cambios (`git commit -m 'feat: Add some AmazingFeature'`)
6. Empuja la rama (`git push origin feature/AmazingFeature`)
7. Abre un Pull Request.



