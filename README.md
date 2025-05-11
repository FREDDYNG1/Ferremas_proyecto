# Ferremas - Sistema de Gestión para Ferreterías

## Descripción
Ferremas es un sistema completo de gestión para ferreterías que consta de un frontend moderno en React y un backend robusto en Node.js. El sistema está diseñado para proporcionar una solución integral para la gestión de inventario, ventas, usuarios y operaciones diarias de una ferretería.

## Características del Sistema
### Frontend
- Interfaz de usuario moderna y responsiva
- Autenticación y autorización de usuarios
- Gestión de inventario en tiempo real
- Panel de control para administradores
- Sistema de búsqueda avanzada
- Carrito de compras
- Historial de transacciones
- Gestión de usuarios y roles

### Backend
- API RESTful
- Autenticación JWT
- Base de datos relacional
- Manejo de sesiones
- Validación de datos
- Sistema de logs
- Gestión de errores
- Documentación de API con Swagger

## Tecnologías Utilizadas

### Frontend
- React 18
- Vite
- Material-UI
- Bootstrap
- Axios
- React Router DOM
- JWT Decode
- Redux (para gestión de estado)

### Backend
- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT
- Bcrypt
- Cors
- Dotenv

## Prerrequisitos
- Node.js (v14 o superior)
- npm o yarn
- Git
- PostgreSQL
- Editor de código (VS Code recomendado)

## Instalación

### Backend
1. Clonar el repositorio:
```bash
git clone [url-del-repositorio]
cd ferremas_backend
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
Crear archivo `.env` en la raíz del proyecto backend:
```env
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASS=tu_contraseña
DB_NAME=ferremas_db
JWT_SECRET=tu_secreto_jwt
PORT=3000
```

4. Inicializar la base de datos:
```bash
npm run db:setup
```

5. Iniciar el servidor:
```bash
npm run dev
```

### Frontend
1. Navegar al directorio del frontend:
```bash
cd ferremas_frontend
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
Crear archivo `.env` en la raíz del proyecto frontend:
```env
VITE_API_URL=http://localhost:3000
```

4. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

## Estructura del Proyecto

### Backend
```
ferremas_backend/
├── src/
│   ├── config/         # Configuraciones
│   ├── controllers/    # Controladores
│   ├── models/        # Modelos de base de datos
│   ├── routes/        # Rutas de la API
│   ├── middleware/    # Middleware
│   ├── utils/         # Utilidades
│   └── app.js         # Punto de entrada
├── tests/             # Pruebas
└── ...
```

### Frontend
```
ferremas_frontend/
├── src/
│   ├── components/     # Componentes UI reutilizables
│   ├── context/        # Proveedores de contexto React
│   ├── pages/         # Componentes de página
│   ├── services/      # Servicios de API
│   ├── store/         # Estado global (Redux)
│   └── utils/         # Funciones de utilidad
├── public/            # Activos estáticos
└── ...
```

## Scripts Disponibles

### Backend
- `npm run dev` - Iniciar servidor de desarrollo
- `npm run start` - Iniciar servidor en producción
- `npm run test` - Ejecutar pruebas
- `npm run db:setup` - Configurar base de datos
- `npm run lint` - Ejecutar ESLint

### Frontend
- `npm run dev` - Iniciar servidor de desarrollo
- `npm run build` - Construir para producción
- `npm run preview` - Vista previa de la construcción
- `npm run lint` - Ejecutar ESLint

## Guía de Desarrollo
1. Asegúrate de tener todos los prerrequisitos instalados
2. Clona ambos repositorios (frontend y backend)
3. Configura las bases de datos y variables de entorno
4. Inicia el servidor backend
5. Inicia el servidor frontend
6. Accede a la aplicación en `http://localhost:5173`

## Contribución
Las contribuciones son bienvenidas. Por favor, asegúrate de seguir las mejores prácticas de código y mantener la consistencia con el estilo existente.

### Pasos para Contribuir
1. Haz un Fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Haz commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request
