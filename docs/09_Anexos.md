# 9. Anexos

## Colección de Postman

### Importar Colección

Para importar la colección de Postman, descarga el archivo `Ferremas_API.postman_collection.json` y súbelo a Postman.

### Variables de Entorno

Configura las siguientes variables en Postman:

```json
{
  "base_url": "http://localhost:8000",
  "api_base_url": "http://localhost:8000/api",
  "admin_token": "",
  "cliente_token": "",
  "admin_username": "admin",
  "admin_password": "admin123",
  "cliente_username": "cliente",
  "cliente_password": "cliente123"
}
```

### Estructura de la Colección

#### 1. Autenticación

**Login Admin**
- **Método**: POST
- **URL**: `{{api_base_url}}/usuarios/login/`
- **Body**:
```json
{
  "username": "{{admin_username}}",
  "password": "{{admin_password}}"
}
```

**Login Cliente**
- **Método**: POST
- **URL**: `{{api_base_url}}/usuarios/login/`
- **Body**:
```json
{
  "username": "{{cliente_username}}",
  "password": "{{cliente_password}}"
}
```

**Registro Usuario**
- **Método**: POST
- **URL**: `{{api_base_url}}/usuarios/registro/`
- **Body**:
```json
{
  "username": "nuevo_usuario",
  "email": "nuevo@test.com",
  "password": "nuevo123",
  "password2": "nuevo123",
  "first_name": "Nuevo",
  "last_name": "Usuario",
  "telefono": "+56912345678"
}
```

#### 2. Usuarios

**Listar Usuarios (Admin)**
- **Método**: GET
- **URL**: `{{api_base_url}}/usuarios/`
- **Headers**: `Authorization: Bearer {{admin_token}}`

**Perfil de Usuario**
- **Método**: GET
- **URL**: `{{api_base_url}}/usuarios/perfil/`
- **Headers**: `Authorization: Bearer {{cliente_token}}`

**Cambiar Contraseña**
- **Método**: POST
- **URL**: `{{api_base_url}}/usuarios/cambiar-password/`
- **Headers**: `Authorization: Bearer {{cliente_token}}`
- **Body**:
```json
{
  "old_password": "cliente123",
  "new_password": "nueva123",
  "new_password2": "nueva123"
}
```

#### 3. Productos

**Listar Productos**
- **Método**: GET
- **URL**: `{{api_base_url}}/productos/`

**Crear Producto (Admin)**
- **Método**: POST
- **URL**: `{{api_base_url}}/productos/`
- **Headers**: `Authorization: Bearer {{admin_token}}`
- **Body** (form-data):
```
sku: MART001
nombre: Martillo Profesional
descripcion: Martillo de acero inoxidable
precio: 25.99
categoria: Herramientas
imagen: [archivo]
```

**Actualizar Producto (Admin)**
- **Método**: PUT
- **URL**: `{{api_base_url}}/productos/{{producto_id}}/`
- **Headers**: `Authorization: Bearer {{admin_token}}`

**Eliminar Producto (Admin)**
- **Método**: DELETE
- **URL**: `{{api_base_url}}/productos/{{producto_id}}/`
- **Headers**: `Authorization: Bearer {{admin_token}}`

#### 4. Carrito

**Crear Carrito**
- **Método**: POST
- **URL**: `{{api_base_url}}/carritos/`
- **Headers**: `Authorization: Bearer {{cliente_token}}`
- **Body**:
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

**Listar Carritos del Usuario**
- **Método**: GET
- **URL**: `{{api_base_url}}/carritos/`
- **Headers**: `Authorization: Bearer {{cliente_token}}`

**Órdenes del Usuario**
- **Método**: GET
- **URL**: `{{api_base_url}}/carritos/user_orders/`
- **Headers**: `Authorization: Bearer {{cliente_token}}`

#### 5. Conversión de Monedas

**Convertir Moneda**
- **Método**: GET
- **URL**: `{{api_base_url}}/convertir-moneda/?cantidad=100&moneda_origen=USD&moneda_destino=EUR`

#### 6. Contacto

**Enviar Mensaje**
- **Método**: POST
- **URL**: `{{api_base_url}}/contacto/`
- **Body**:
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@test.com",
  "asunto": "Consulta sobre productos",
  "mensaje": "Hola, necesito información sobre martillos."
}
```

**Listar Mensajes (Admin)**
- **Método**: GET
- **URL**: `{{api_base_url}}/contacto/mensajes/`
- **Headers**: `Authorization: Bearer {{admin_token}}`

### Scripts de Postman

#### Pre-request Script para Login

```javascript
// Script para login automático
if (pm.environment.get("admin_token") === "") {
    pm.sendRequest({
        url: pm.environment.get("api_base_url") + "/usuarios/login/",
        method: 'POST',
        header: {
            'Content-Type': 'application/json'
        },
        body: {
            mode: 'raw',
            raw: JSON.stringify({
                username: pm.environment.get("admin_username"),
                password: pm.environment.get("admin_password")
            })
        }
    }, function (err, response) {
        if (response.code === 200) {
            const responseJson = response.json();
            pm.environment.set("admin_token", responseJson.access);
        }
    });
}
```

#### Test Script para Validaciones

```javascript
// Validaciones comunes
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response time is less than 500ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(500);
});

pm.test("Response has required fields", function () {
    const responseJson = pm.response.json();
    pm.expect(responseJson).to.have.property('id');
    pm.expect(responseJson).to.have.property('nombre');
});
```

## Enlaces Útiles

### Documentación Oficial

#### Django y Django REST Framework
- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Django REST Framework JWT](https://django-rest-framework-simplejwt.readthedocs.io/)
- [Django CORS Headers](https://github.com/adamchainz/django-cors-headers)

#### React y Vite
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Material-UI Documentation](https://mui.com/)
- [React Router Documentation](https://reactrouter.com/)

#### Base de Datos
- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

#### APIs Externas
- [MercadoPago API Documentation](https://www.mercadopago.com.ar/developers/es/docs)
- [ExchangeRate API Documentation](https://www.exchangerate-api.com/docs)

### Herramientas de Desarrollo

#### IDEs y Editores
- [Visual Studio Code](https://code.visualstudio.com/)
- [PyCharm](https://www.jetbrains.com/pycharm/)
- [WebStorm](https://www.jetbrains.com/webstorm/)

#### Herramientas de Testing
- [Postman](https://www.postman.com/)
- [Insomnia](https://insomnia.rest/)
- [Jest](https://jestjs.io/)
- [Cypress](https://www.cypress.io/)

#### Herramientas de Despliegue
- [Railway](https://railway.app/)
- [Vercel](https://vercel.com/)
- [Heroku](https://heroku.com/)
- [AWS](https://aws.amazon.com/)

### Recursos de Aprendizaje

#### Tutoriales y Cursos
- [Django REST Framework Tutorial](https://www.django-rest-framework.org/tutorial/quickstart/)
- [React Tutorial](https://react.dev/learn)
- [Full Stack Development](https://www.freecodecamp.org/)

#### Comunidades
- [Stack Overflow](https://stackoverflow.com/)
- [Reddit r/django](https://www.reddit.com/r/django/)
- [Reddit r/reactjs](https://www.reddit.com/r/reactjs/)

## Capturas de Pantalla

### Interfaz de Usuario

#### 1. Página de Inicio
![Página de Inicio](screenshots/home.png)
*Página principal del sistema Ferremas*

#### 2. Panel de Administración
![Panel de Administración](screenshots/admin-panel.png)
*Dashboard de administración con estadísticas*

#### 3. Gestión de Productos
![Gestión de Productos](screenshots/productos.png)
*Interfaz para gestionar productos y stock*

#### 4. Carrito de Compras
![Carrito de Compras](screenshots/carrito.png)
*Carrito de compras con productos agregados*

#### 5. Checkout
![Checkout](screenshots/checkout.png)
*Proceso de checkout con MercadoPago*

### API Documentation

#### 1. Swagger UI
![Swagger UI](screenshots/swagger.png)
*Documentación interactiva de la API*

#### 2. ReDoc
![ReDoc](screenshots/redoc.png)
*Documentación alternativa de la API*

## Comandos Útiles

### Backend (Django)

```bash
# Crear superusuario
python manage.py createsuperuser

# Aplicar migraciones
python manage.py migrate

# Crear migraciones
python manage.py makemigrations

# Ejecutar servidor de desarrollo
python manage.py runserver

# Ejecutar tests
python manage.py test

# Ejecutar tests con cobertura
coverage run --source='.' manage.py test
coverage report
coverage html

# Shell de Django
python manage.py shell

# Verificar configuración
python manage.py check --deploy

# Recolectar archivos estáticos
python manage.py collectstatic

# Backup de base de datos
python manage.py dumpdata > backup.json

# Restaurar backup
python manage.py loaddata backup.json
```

### Frontend (React)

```bash
# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Previsualizar build
npm run preview

# Ejecutar linter
npm run lint

# Ejecutar tests (futuro)
npm test

# Actualizar dependencias
npm update

# Limpiar cache
npm cache clean --force
```

### Base de Datos

```bash
# Conectar a PostgreSQL
psql -h localhost -U postgres -d ferremas

# Backup de base de datos
pg_dump -h localhost -U postgres ferremas > backup.sql

# Restaurar backup
psql -h localhost -U postgres ferremas < backup.sql

# Verificar conexión
python manage.py dbshell
```

### Git

```bash
# Verificar estado
git status

# Agregar cambios
git add .

# Commit cambios
git commit -m "feat: agregar nueva funcionalidad"

# Push cambios
git push origin main

# Crear rama
git checkout -b feature/nueva-funcionalidad

# Cambiar rama
git checkout main

# Ver historial
git log --oneline

# Ver diferencias
git diff
```

## Configuraciones de Entorno

### Variables de Entorno de Desarrollo

```env
# Backend (.env)
SECRET_KEY='django-insecure-dev-secret-key'
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DB_ENGINE='django.db.backends.postgresql'
DB_NAME='ferremas_dev'
DB_USER='postgres'
DB_PASSWORD='dev_password'
DB_HOST='localhost'
DB_PORT='5432'

# APIs Externas
MP_ACCESS_TOKEN='TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
CURRENCY_API_KEY='dev_api_key'
EXCHANGE_RATE_KEY='dev_api_key'

# Email
EMAIL_BACKEND='django.core.mail.backends.console.EmailBackend'
```

### Variables de Entorno de Producción

```env
# Backend (.env)
SECRET_KEY='production-secret-key-super-seguro'
DEBUG=False
ALLOWED_HOSTS=tu-dominio.com,www.tu-dominio.com

# Database
DB_ENGINE='django.db.backends.postgresql'
DB_NAME='ferremas_prod'
DB_USER='ferremas_user'
DB_PASSWORD='production-password-seguro'
DB_HOST='tu-host-produccion'
DB_PORT='5432'

# APIs Externas
MP_ACCESS_TOKEN='APP-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
CURRENCY_API_KEY='production_api_key'
EXCHANGE_RATE_KEY='production_api_key'

# Email
EMAIL_BACKEND='django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST='smtp.tu-proveedor.com'
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER='noreply@tu-dominio.com'
EMAIL_HOST_PASSWORD='email-password-seguro'
```

## Troubleshooting

### Problemas Comunes

#### 1. Error de Conexión a Base de Datos

```bash
# Verificar que PostgreSQL esté corriendo
sudo systemctl status postgresql

# Verificar credenciales
psql -h localhost -U postgres -d ferremas

# Verificar migraciones
python manage.py showmigrations

# Aplicar migraciones si es necesario
python manage.py migrate
```

#### 2. Error de CORS

```bash
# Verificar configuración CORS
python manage.py check --deploy

# Verificar headers en navegador
# F12 -> Network -> Headers
```

#### 3. Error de APIs Externas

```bash
# Verificar variables de entorno
python -c "import os; print(os.getenv('MP_ACCESS_TOKEN'))"

# Probar APIs manualmente
python manage.py shell
>>> from carrito.mercadopago_service import MercadoPagoService
>>> service = MercadoPagoService()
```

#### 4. Error de Dependencias

```bash
# Actualizar pip
pip install --upgrade pip

# Reinstalar dependencias
pip uninstall -r requirements.txt -y
pip install -r requirements.txt

# Verificar versiones
pip list
```

### Logs y Debugging

#### Habilitar Logs Detallados

```python
# settings.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': 'debug.log',
        },
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file', 'console'],
            'level': 'DEBUG',
            'propagate': True,
        },
        'carrito': {
            'handlers': ['file'],
            'level': 'DEBUG',
            'propagate': True,
        },
        'conversor_monedas': {
            'handlers': ['file'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}
```

#### Verificar Logs

```bash
# Ver logs en tiempo real
tail -f debug.log

# Buscar errores específicos
grep "ERROR" debug.log

# Buscar errores de MercadoPago
grep "MercadoPago" debug.log

# Buscar errores de conversión de monedas
grep "ExchangeRate" debug.log
```

## Recursos Adicionales

### Libros Recomendados

1. **Django for Beginners** - William S. Vincent
2. **Django REST Framework** - Tom Christie
3. **React: Up & Running** - Stoyan Stefanov
4. **Full Stack Development** - Chris Northwood

### Videos y Tutoriales

1. **Django REST Framework Tutorial** - Corey Schafer
2. **React Tutorial** - Traversy Media
3. **Full Stack Development** - freeCodeCamp

### Podcasts

1. **Talk Python to Me** - Michael Kennedy
2. **Syntax** - Wes Bos & Scott Tolinski
3. **React Podcast** - React Team

### Blogs y Artículos

1. [Real Python](https://realpython.com/)
2. [Django Girls](https://tutorial.djangogirls.org/)
3. [React Blog](https://react.dev/blog)

### Herramientas de Productividad

1. **GitHub** - Control de versiones
2. **Docker** - Contenedores
3. **Postman** - Testing de APIs
4. **VS Code** - Editor de código
5. **Figma** - Diseño de interfaces

### Comunidades y Foros

1. **Stack Overflow** - Preguntas y respuestas
2. **Reddit** - Comunidades específicas
3. **Discord** - Servidores de desarrollo
4. **Slack** - Comunidades de tecnología

## Contacto y Soporte

### Equipo de Desarrollo

- **Desarrollador Principal**: [Tu Nombre]
- **Email**: [tu-email@dominio.com]
- **GitHub**: [tu-usuario-github]

### Canales de Soporte

1. **Issues de GitHub** - Reportar bugs y solicitar features
2. **Email** - Soporte técnico directo
3. **Documentación** - Guías y tutoriales
4. **Comunidad** - Foros y grupos de usuarios

### Contribuciones

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature
3. Realiza tus cambios
4. Ejecuta las pruebas
5. Envía un Pull Request

### Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles. 