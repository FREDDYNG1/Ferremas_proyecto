# 7. Guía de Despliegue

## Despliegue Local

### Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Python 3.8+**
- **Node.js 16+**
- **npm 8+**
- **Git**
- **PostgreSQL** (opcional, se puede usar Supabase)

### Paso 1: Clonar el Repositorio

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/ferremas.git
cd ferremas

# Verificar la estructura
ls -la
```

### Paso 2: Configurar Backend

```bash
# Navegar al directorio del backend
cd ferremas_backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Crear archivo .env
cp env.example .env
```

#### Configurar Variables de Entorno

Edita el archivo `.env` con tus credenciales:

```env
# Django Settings
SECRET_KEY='django-insecure-tu-secret-key-aqui'
DEBUG=True

# Database (Supabase)
DB_ENGINE='django.db.backends.postgresql'
DB_NAME='postgres'
DB_USER='postgres'
DB_PASSWORD='tu-password-supabase'
DB_HOST='db.xxxxxxxxxxxxx.supabase.co'
DB_PORT='5432'

# APIs Externas
MP_ACCESS_TOKEN='TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
CURRENCY_API_KEY='tu-api-key-exchangerate'
EXCHANGE_RATE_KEY='tu-api-key-exchangerate'
```

#### Configurar Base de Datos

```bash
# Aplicar migraciones
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Verificar configuración
python verify_setup.py
```

#### Ejecutar Backend

```bash
# Ejecutar servidor de desarrollo
python manage.py runserver

# El backend estará disponible en: http://localhost:8000
# Admin panel: http://localhost:8000/admin
# API docs: http://localhost:8000/api/schema/swagger-ui/
```

### Paso 3: Configurar Frontend

```bash
# Abrir nueva terminal y navegar al frontend
cd ferremas_frontend

# Instalar dependencias
npm install

# Crear archivo .env
echo "VITE_API_BASE_URL=http://localhost:8000/api" > .env
echo "VITE_BACKEND_URL=http://localhost:8000" >> .env
echo "VITE_MERCADOPAGO_PUBLIC_KEY=TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" >> .env
```

#### Ejecutar Frontend

```bash
# Ejecutar servidor de desarrollo
npm run dev

# El frontend estará disponible en: http://localhost:5173
```

### Paso 4: Verificar Instalación

1. **Backend**: Visita http://localhost:8000/admin
2. **API Docs**: Visita http://localhost:8000/api/schema/swagger-ui/
3. **Frontend**: Visita http://localhost:5173
4. **Login**: Usa las credenciales del superusuario creado

## Despliegue en Producción

### Opción 1: Railway

#### Configuración en Railway

1. **Crear cuenta en Railway**
   - Ve a [railway.app](https://railway.app)
   - Conecta tu cuenta de GitHub

2. **Desplegar Backend**
   ```bash
   # En Railway Dashboard
   # 1. New Project -> Deploy from GitHub repo
   # 2. Seleccionar tu repositorio
   # 3. Configurar variables de entorno
   ```

#### Variables de Entorno en Railway

```env
# Django Settings
SECRET_KEY=tu-secret-key-super-seguro
DEBUG=False
ALLOWED_HOSTS=tu-app.railway.app

# Database (Railway PostgreSQL)
DB_ENGINE=django.db.backends.postgresql
DB_NAME=railway
DB_USER=postgres
DB_PASSWORD=tu-password-railway
DB_HOST=containers-us-west-xxx.railway.app
DB_PORT=5432

# APIs Externas
MP_ACCESS_TOKEN=APP-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
CURRENCY_API_KEY=tu-api-key-produccion
EXCHANGE_RATE_KEY=tu-api-key-produccion

# Email (Opcional)
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=tu-email@gmail.com
EMAIL_HOST_PASSWORD=tu-app-password
```

#### Desplegar Frontend

```bash
# En Railway Dashboard
# 1. New Service -> Static Site
# 2. Conectar repositorio
# 3. Build Command: npm run build
# 4. Output Directory: dist
```

### Opción 2: Vercel

#### Configuración en Vercel

1. **Crear cuenta en Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - Conecta tu cuenta de GitHub

2. **Desplegar Frontend**
   ```bash
   # En Vercel Dashboard
   # 1. New Project -> Import Git Repository
   # 2. Seleccionar tu repositorio
   # 3. Framework Preset: Vite
   # 4. Root Directory: ferremas_frontend
   ```

#### Variables de Entorno en Vercel

```env
VITE_API_BASE_URL=https://tu-backend.railway.app/api
VITE_BACKEND_URL=https://tu-backend.railway.app
VITE_MERCADOPAGO_PUBLIC_KEY=APP-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

#### Desplegar Backend

```bash
# Crear archivo vercel.json en la raíz del backend
{
  "builds": [
    {
      "src": "config/wsgi.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "config/wsgi.py"
    }
  ]
}
```

### Opción 3: AWS

#### Configuración en AWS

1. **EC2 Instance**
   ```bash
   # Crear instancia EC2 (Ubuntu 20.04)
   # Tipo: t2.micro (gratuito) o t3.small
   # Security Group: HTTP(80), HTTPS(443), SSH(22)
   ```

2. **Configurar Servidor**
   ```bash
   # Conectar via SSH
   ssh -i tu-key.pem ubuntu@tu-ip-ec2

   # Actualizar sistema
   sudo apt update && sudo apt upgrade -y

   # Instalar dependencias
   sudo apt install python3 python3-pip python3-venv nginx postgresql postgresql-contrib -y
   ```

3. **Configurar Base de Datos**
   ```bash
   # Crear base de datos PostgreSQL
   sudo -u postgres psql
   CREATE DATABASE ferremas;
   CREATE USER ferremas_user WITH PASSWORD 'tu-password';
   GRANT ALL PRIVILEGES ON DATABASE ferremas TO ferremas_user;
   \q
   ```

4. **Desplegar Aplicación**
   ```bash
   # Clonar repositorio
   git clone https://github.com/tu-usuario/ferremas.git
   cd ferremas/ferremas_backend

   # Crear entorno virtual
   python3 -m venv venv
   source venv/bin/activate

   # Instalar dependencias
   pip install -r requirements.txt

   # Configurar variables de entorno
   nano .env
   ```

#### Configuración de Nginx

```nginx
# /etc/nginx/sites-available/ferremas
server {
    listen 80;
    server_name tu-dominio.com www.tu-dominio.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /static/ {
        alias /home/ubuntu/ferremas/ferremas_backend/static/;
    }

    location /media/ {
        alias /home/ubuntu/ferremas/ferremas_backend/media/;
    }
}
```

```bash
# Habilitar sitio
sudo ln -s /etc/nginx/sites-available/ferremas /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Configurar Gunicorn

```bash
# Instalar Gunicorn
pip install gunicorn

# Crear archivo de configuración
sudo nano /etc/systemd/system/ferremas.service
```

```ini
[Unit]
Description=Ferremas Django Application
After=network.target

[Service]
User=ubuntu
Group=www-data
WorkingDirectory=/home/ubuntu/ferremas/ferremas_backend
Environment="PATH=/home/ubuntu/ferremas/ferremas_backend/venv/bin"
ExecStart=/home/ubuntu/ferremas/ferremas_backend/venv/bin/gunicorn --workers 3 --bind 127.0.0.1:8000 config.wsgi:application
ExecReload=/bin/kill -s HUP $MAINPID
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
# Iniciar servicio
sudo systemctl start ferremas
sudo systemctl enable ferremas
sudo systemctl status ferremas
```

### Opción 4: Docker

#### Dockerfile para Backend

```dockerfile
# ferremas_backend/Dockerfile
FROM python:3.11-slim

# Establecer directorio de trabajo
WORKDIR /app

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements e instalar dependencias Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código de la aplicación
COPY . .

# Crear usuario no-root
RUN useradd -m -u 1000 ferremas && chown -R ferremas:ferremas /app
USER ferremas

# Exponer puerto
EXPOSE 8000

# Comando para ejecutar la aplicación
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "config.wsgi:application"]
```

#### Dockerfile para Frontend

```dockerfile
# ferremas_frontend/Dockerfile
FROM node:18-alpine as build

WORKDIR /app

# Copiar package.json e instalar dependencias
COPY package*.json ./
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Construir aplicación
RUN npm run build

# Servidor de producción
FROM nginx:alpine

# Copiar archivos construidos
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  db:
    image: postgres:13
    environment:
      POSTGRES_DB: ferremas
      POSTGRES_USER: ferremas_user
      POSTGRES_PASSWORD: ferremas_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./ferremas_backend
    environment:
      - DB_ENGINE=django.db.backends.postgresql
      - DB_NAME=ferremas
      - DB_USER=ferremas_user
      - DB_PASSWORD=ferremas_password
      - DB_HOST=db
      - DB_PORT=5432
      - SECRET_KEY=tu-secret-key
      - DEBUG=False
    depends_on:
      - db
    ports:
      - "8000:8000"
    volumes:
      - ./ferremas_backend:/app
      - static_volume:/app/static
      - media_volume:/app/media

  frontend:
    build: ./ferremas_frontend
    environment:
      - VITE_API_BASE_URL=http://localhost:8000/api
    ports:
      - "80:80"
    depends_on:
      - backend

  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - backend
      - frontend

volumes:
  postgres_data:
  static_volume:
  media_volume:
```

#### Ejecutar con Docker

```bash
# Construir y ejecutar
docker-compose up --build

# Ejecutar en background
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

## Configuración de SSL/HTTPS

### Let's Encrypt (Gratuito)

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obtener certificado
sudo certbot --nginx -d tu-dominio.com -d www.tu-dominio.com

# Renovar automáticamente
sudo crontab -e
# Agregar línea: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Configuración Nginx con SSL

```nginx
# /etc/nginx/sites-available/ferremas
server {
    listen 80;
    server_name tu-dominio.com www.tu-dominio.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name tu-dominio.com www.tu-dominio.com;

    ssl_certificate /etc/letsencrypt/live/tu-dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tu-dominio.com/privkey.pem;

    # Configuración SSL
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Headers de seguridad
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /static/ {
        alias /home/ubuntu/ferremas/ferremas_backend/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location /media/ {
        alias /home/ubuntu/ferremas/ferremas_backend/media/;
        expires 1y;
        add_header Cache-Control "public";
    }
}
```

## Monitoreo y Mantenimiento

### Logs y Monitoreo

```bash
# Ver logs de la aplicación
sudo journalctl -u ferremas -f

# Ver logs de nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Ver logs de Django
tail -f /home/ubuntu/ferremas/ferremas_backend/logs/django.log
```

### Backup de Base de Datos

```bash
# Script de backup automático
#!/bin/bash
# /home/ubuntu/backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/ubuntu/backups"
DB_NAME="ferremas"

# Crear directorio de backup
mkdir -p $BACKUP_DIR

# Backup de base de datos
pg_dump -h localhost -U ferremas_user $DB_NAME > $BACKUP_DIR/backup_$DATE.sql

# Comprimir backup
gzip $BACKUP_DIR/backup_$DATE.sql

# Eliminar backups antiguos (más de 30 días)
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete

echo "Backup completado: backup_$DATE.sql.gz"
```

```bash
# Configurar cron job para backup diario
crontab -e
# Agregar línea: 0 2 * * * /home/ubuntu/backup.sh
```

### Actualizaciones

```bash
# Script de actualización
#!/bin/bash
# /home/ubuntu/update.sh

cd /home/ubuntu/ferremas

# Backup antes de actualizar
/home/ubuntu/backup.sh

# Actualizar código
git pull origin main

# Activar entorno virtual
source ferremas_backend/venv/bin/activate

# Instalar nuevas dependencias
cd ferremas_backend
pip install -r requirements.txt

# Aplicar migraciones
python manage.py migrate

# Recolectar archivos estáticos
python manage.py collectstatic --noinput

# Reiniciar servicios
sudo systemctl restart ferremas
sudo systemctl restart nginx

echo "Actualización completada"
```

## Troubleshooting

### Problemas Comunes

#### 1. Error de Conexión a Base de Datos

```bash
# Verificar estado de PostgreSQL
sudo systemctl status postgresql

# Verificar conexión
psql -h localhost -U ferremas_user -d ferremas

# Verificar logs
sudo tail -f /var/log/postgresql/postgresql-*.log
```

#### 2. Error de Permisos

```bash
# Verificar permisos de archivos
sudo chown -R ubuntu:www-data /home/ubuntu/ferremas
sudo chmod -R 755 /home/ubuntu/ferremas

# Verificar permisos de nginx
sudo chown -R www-data:www-data /var/www/html
```

#### 3. Error de SSL

```bash
# Verificar certificado SSL
sudo certbot certificates

# Renovar certificado manualmente
sudo certbot renew --dry-run

# Verificar configuración nginx
sudo nginx -t
```

#### 4. Error de Memoria

```bash
# Verificar uso de memoria
free -h

# Verificar procesos
ps aux --sort=-%mem | head -10

# Optimizar configuración de Gunicorn
# En /etc/systemd/system/ferremas.service
ExecStart=/home/ubuntu/ferremas/ferremas_backend/venv/bin/gunicorn --workers 2 --max-requests 1000 --max-requests-jitter 100 --bind 127.0.0.1:8000 config.wsgi:application
```

### Comandos Útiles

```bash
# Verificar estado de servicios
sudo systemctl status ferremas nginx postgresql

# Reiniciar servicios
sudo systemctl restart ferremas nginx postgresql

# Ver logs en tiempo real
sudo journalctl -u ferremas -f

# Verificar puertos en uso
sudo netstat -tlnp

# Verificar espacio en disco
df -h

# Verificar uso de CPU y memoria
htop
```

## Checklist de Despliegue

### Antes del Despliegue

- [ ] Configurar variables de entorno de producción
- [ ] Cambiar DEBUG=False
- [ ] Configurar ALLOWED_HOSTS
- [ ] Configurar base de datos de producción
- [ ] Configurar APIs externas de producción
- [ ] Configurar email de producción

### Durante el Despliegue

- [ ] Aplicar migraciones
- [ ] Crear superusuario
- [ ] Recolectar archivos estáticos
- [ ] Configurar SSL/HTTPS
- [ ] Configurar nginx/apache
- [ ] Configurar firewall

### Después del Despliegue

- [ ] Verificar funcionamiento de la aplicación
- [ ] Verificar APIs externas
- [ ] Configurar monitoreo
- [ ] Configurar backups
- [ ] Configurar alertas
- [ ] Documentar configuración 