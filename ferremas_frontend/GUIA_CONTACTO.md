# 📧 Guía del Sistema de Contacto - Ferremas

## 🎯 **¿Cómo enviar mensajes como cliente?**

### **Opción 1: Página de Contacto**
1. **Ve a la página de contacto**:
   - Haz clic en "Contacto" en la barra de navegación
   - O ve directamente a: `http://localhost:5173/contacto`

2. **Llena el formulario**:
   - **Nombre completo** (requerido)
   - **Correo electrónico** (requerido)
   - **Asunto** (opcional)
   - **Mensaje** (requerido)

3. **Envía el mensaje**:
   - Haz clic en "Enviar Mensaje"
   - Recibirás confirmación de envío
   - El mensaje se almacena en la base de datos
   - Se envía por email (si está configurado)

### **Opción 2: API Directa**
```bash
POST http://localhost:8000/api/contacto/contacto/
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "email": "juan@email.com",
  "asunto": "Consulta sobre productos",
  "mensaje": "Hola, me gustaría saber más sobre sus herramientas..."
}
```

---

## 👨‍💼 **¿Cómo ver mensajes como administrador/trabajador?**

### **Acceso al Panel de Gestión**
1. **Inicia sesión** como admin o trabajador
2. **Ve a la sección de mensajes**:
   - Haz clic en "Mensajes" en la barra de navegación
   - O ve directamente a: `http://localhost:5173/admin/mensajes`
   - O usa el icono de notificación con el contador

### **Funcionalidades Disponibles**
- ✅ **Ver estadísticas** en tiempo real
- ✅ **Filtrar mensajes** por texto, asunto, fechas
- ✅ **Ordenar** por fecha, nombre, email
- ✅ **Ver detalles** completos de cada mensaje
- ✅ **Eliminar mensajes** antiguos
- ✅ **Paginación** para manejar muchos mensajes

### **Notificaciones**
- 🔔 **Badge en navegación** con contador de mensajes sin leer
- 🔄 **Actualización automática** cada 5 minutos
- 📊 **Estadísticas en tiempo real**

---

## 📊 **Estadísticas Disponibles**

### **Dashboard Principal**
- **Total de mensajes**: Todos los mensajes recibidos
- **Hoy**: Mensajes enviados hoy
- **Esta semana**: Mensajes de los últimos 7 días
- **Sin leer**: Mensajes con más de 24 horas sin respuesta

### **Filtros Avanzados**
- **Búsqueda**: Busca en nombre, email, asunto y contenido
- **Asunto**: Filtra por asunto específico
- **Fechas**: Rango de fechas de envío
- **Ordenamiento**: Por fecha, nombre o email

---

## 🔧 **Configuración Técnica**

### **Backend (Django)**
```bash
# Instalar dependencias
pip install django-filter

# Migraciones (si no están aplicadas)
python manage.py makemigrations
python manage.py migrate

# Configurar email (opcional)
# En settings.py:
EMAIL_HOST_USER = 'tu-email@gmail.com'
EMAIL_HOST_PASSWORD = 'tu-password'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
```

### **Frontend (React)**
```bash
# Las rutas ya están configuradas
# El servicio de contacto ya está implementado
# Solo necesitas iniciar el servidor:
npm run dev
```

---

## 🚀 **Flujo Completo del Sistema**

### **Para Clientes:**
1. **Accede** a `/contacto`
2. **Llena** el formulario
3. **Envía** el mensaje
4. **Recibe** confirmación
5. **Espera** respuesta del equipo

### **Para Administradores/Trabajadores:**
1. **Inicia sesión** con credenciales
2. **Ve a** `/admin/mensajes`
3. **Revisa** estadísticas y mensajes
4. **Filtra** y busca mensajes específicos
5. **Lee** detalles completos
6. **Responde** al cliente (externamente)
7. **Elimina** mensajes procesados

---

## 📱 **Características Responsive**

- ✅ **Móviles**: Interfaz adaptada para pantallas pequeñas
- ✅ **Tablets**: Diseño optimizado para tablets
- ✅ **Desktop**: Vista completa con todas las funcionalidades
- ✅ **Navegación**: Menú hamburguesa en móviles

---

## 🔒 **Seguridad**

- ✅ **Autenticación**: Solo usuarios autorizados pueden ver mensajes
- ✅ **Roles**: Solo admin y trabajador tienen acceso
- ✅ **Validación**: Datos validados en frontend y backend
- ✅ **Sanitización**: Entrada de usuario protegida

---

## 🐛 **Solución de Problemas**

### **Mensaje no se envía**
- Verifica que todos los campos requeridos estén llenos
- Revisa la conexión a internet
- Confirma que el servidor esté funcionando

### **No puedo acceder a mensajes**
- Verifica que estés logueado como admin/trabajador
- Confirma que tengas los permisos correctos
- Revisa la consola del navegador para errores

### **Notificaciones no aparecen**
- Verifica que el usuario esté autenticado
- Revisa la consola para errores de red
- Confirma que el endpoint de estadísticas funcione

---

## 📞 **Soporte**

Si tienes problemas con el sistema de contacto:
1. Revisa esta guía
2. Verifica la documentación completa en `README_MENSAJES.md`
3. Contacta al equipo de desarrollo

---

**¡El sistema está listo para usar! 🎉** 