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
- Desarrollado con Django (Python)
- Arquitectura RESTful
- Sistema de autenticación y autorización
- Gestión de base de datos

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
- Python
- SQLite/PostgreSQL (configurable)

## Requisitos Previos
- Node.js (v16 o superior)
- Python 3.8 o superior
- pip (gestor de paquetes de Python)
- npm o yarn (gestor de paquetes de Node.js)

## Instalación

### Frontend
1. Navegar al directorio del frontend:
   ```bash
   cd ferremas_frontend
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

### Backend
1. Navegar al directorio del backend:
   ```bash
   cd ferremas_backend
   ```
2. Crear y activar entorno virtual:
   ```bash
   python -m venv venv
   source venv/bin/activate  # En Windows: venv\Scripts\activate
   ```
3. Instalar dependencias:
   ```bash
   pip install -r requirements.txt
   ```
4. Aplicar migraciones:
   ```bash
   python manage.py migrate
   ```
5. Iniciar el servidor:
   ```bash
   python manage.py runserver
   ```

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
├── src/              # Código fuente
├── public/           # Archivos estáticos
├── node_modules/     # Dependencias
└── ...
```

### Backend
```
ferremas_backend/
├── config/           # Configuración de Django
├── usuarios/         # Aplicación de usuarios
├── venv/            # Entorno virtual
└── ...
```

## Contribución
1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia
Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Contacto
Para soporte o consultas, por favor contactar al equipo de desarrollo.


