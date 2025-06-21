# 📧 Gestión de Mensajes de Contacto

## Descripción
Sistema completo para que administradores y trabajadores puedan gestionar los mensajes de contacto enviados por los clientes a través del formulario de contacto.

## 🚀 Características

### Backend
- **Paginación**: 10 mensajes por página (configurable)
- **Filtros avanzados**: 
  - Búsqueda por texto (nombre, email, asunto, mensaje)
  - Filtro por asunto
  - Filtro por rango de fechas
  - Ordenamiento por múltiples campos
- **Estadísticas en tiempo real**:
  - Total de mensajes
  - Mensajes de hoy
  - Mensajes de esta semana
  - Mensajes sin leer (más de 24 horas)
- **Permisos**: Solo accesible para admin y trabajador
- **API RESTful** con respuestas JSON estructuradas

### Frontend
- **Interfaz moderna** con Material-UI
- **Dashboard con estadísticas** visuales
- **Tabla interactiva** con paginación
- **Filtros en tiempo real** sin recargar página
- **Vista detallada** de mensajes en modal
- **Notificaciones** en la barra de navegación
- **Confirmación** para eliminar mensajes
- **Responsive design** para móviles y desktop

## 📋 Endpoints de la API

### 1. Listar Mensajes
```
GET /api/contacto/mensajes/
```
**Parámetros de consulta:**
- `search`: Búsqueda por texto
- `asunto`: Filtro por asunto
- `fecha_desde`: Fecha desde (YYYY-MM-DD)
- `fecha_hasta`: Fecha hasta (YYYY-MM-DD)
- `ordenar_por`: Campo de ordenamiento
- `page`: Número de página
- `page_size`: Elementos por página

### 2. Detalle de Mensaje
```
GET /api/contacto/mensajes/{id}/
```

### 3. Eliminar Mensaje
```
DELETE /api/contacto/mensajes/{id}/
```

### 4. Estadísticas
```
GET /api/contacto/estadisticas/
```

### 5. Enviar Mensaje (Público)
```
POST /api/contacto/contacto/
```

## 🎯 Cómo Usar

### Para Administradores y Trabajadores

1. **Acceder a la sección**:
   - Inicia sesión como admin o trabajador
   - Haz clic en "Mensajes" en la barra de navegación
   - O usa el icono de notificación con el contador

2. **Ver estadísticas**:
   - Dashboard con métricas en tiempo real
   - Contador de mensajes sin leer
   - Tendencias de mensajes por período

3. **Gestionar mensajes**:
   - Usa los filtros para encontrar mensajes específicos
   - Haz clic en el icono de "Ver" para leer el mensaje completo
   - Elimina mensajes antiguos con confirmación

4. **Filtros disponibles**:
   - **Búsqueda**: Busca en nombre, email, asunto y contenido
   - **Asunto**: Filtra por asunto específico
   - **Fechas**: Rango de fechas de envío
   - **Ordenamiento**: Por fecha, nombre o email

### Para Clientes

1. **Enviar mensaje**:
   - Ve a la página de contacto
   - Llena el formulario con tus datos
   - El mensaje se envía automáticamente por email
   - Se almacena en la base de datos

## 🔧 Configuración

### Backend
1. **Instalar dependencias**:
   ```bash
   pip install django-filter
   ```

2. **Configurar email** (opcional):
   ```python
   # settings.py
   EMAIL_HOST_USER = 'tu-email@gmail.com'
   EMAIL_HOST_PASSWORD = 'tu-password'
   EMAIL_HOST = 'smtp.gmail.com'
   EMAIL_PORT = 587
   EMAIL_USE_TLS = True
   ```

3. **Migraciones**:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

### Frontend
1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Configurar rutas**:
   - Las rutas ya están configuradas en `App.jsx`
   - El componente está protegido con `PrivateRoute`

## 📊 Estructura de Datos

### Mensaje de Contacto
```json
{
  "id": 1,
  "nombre": "Juan Pérez",
  "email": "juan@email.com",
  "asunto": "Consulta sobre productos",
  "mensaje": "Hola, me gustaría saber más...",
  "fecha_envio": "2025-06-20T21:30:00Z",
  "fecha_envio_formateada": "20/06/2025 21:30",
  "tiempo_transcurrido": "Hace 2 horas"
}
```

### Estadísticas
```json
{
  "mensajes_hoy": 5,
  "mensajes_semana": 25,
  "mensajes_mes": 120,
  "total_mensajes": 450,
  "mensajes_sin_leer": 8
}
```

## 🎨 Personalización

### Colores y Temas
- Usa el sistema de temas de Material-UI
- Personaliza colores en `theme.js`
- Iconos de Material-UI disponibles

### Filtros Adicionales
- Agrega nuevos filtros en `views.py`
- Actualiza el frontend en `GestionMensajes.jsx`

### Notificaciones
- Configura el intervalo de actualización en `ContactNotification.jsx`
- Personaliza el estilo del badge

## 🔒 Seguridad

- **Autenticación requerida** para todas las operaciones
- **Verificación de roles** (admin/trabajador)
- **Validación de datos** en frontend y backend
- **Sanitización** de entrada de usuario
- **Rate limiting** recomendado para producción

## 🚀 Próximas Mejoras

- [ ] Marcar mensajes como leídos/no leídos
- [ ] Respuestas automáticas por email
- [ ] Exportar mensajes a CSV/PDF
- [ ] Notificaciones push en tiempo real
- [ ] Categorización automática de mensajes
- [ ] Dashboard con gráficos avanzados

## 📝 Notas Técnicas

- **Paginación**: Implementada con Django REST Framework
- **Filtros**: Usando Q objects de Django
- **Estadísticas**: Consultas optimizadas con agregaciones
- **Frontend**: React hooks para estado y efectos
- **Responsive**: Material-UI Grid system
- **Accesibilidad**: ARIA labels y navegación por teclado

## 🐛 Solución de Problemas

### Error 403 Forbidden
- Verifica que el usuario tenga rol admin o trabajador
- Revisa la configuración de permisos en `views.py`

### Mensajes no se cargan
- Verifica la conexión a la base de datos
- Revisa los logs del servidor Django
- Confirma que las migraciones estén aplicadas

### Notificaciones no aparecen
- Verifica que el usuario esté autenticado
- Revisa la consola del navegador para errores
- Confirma que el endpoint de estadísticas funcione

## 📞 Soporte

Para problemas técnicos o mejoras, contacta al equipo de desarrollo. 