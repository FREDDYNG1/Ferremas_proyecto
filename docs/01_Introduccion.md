# 1. Introducción

## Nombre del Proyecto
**Ferremas** - Sistema de Gestión para Ferretería

## Objetivo y Problema que Resuelve

Ferremas es una aplicación web full-stack diseñada para resolver los desafíos de gestión que enfrentan las ferreterías tradicionales. El sistema aborda los siguientes problemas:

### Problemas Identificados:
- **Gestión manual de inventario**: Control ineficiente de stock por tienda
- **Procesos de venta complejos**: Falta de integración entre ventas y pagos
- **Gestión de usuarios fragmentada**: Diferentes roles sin control centralizado
- **Limitaciones de moneda**: Restricciones para ventas internacionales
- **Comunicación con clientes**: Falta de canales de contacto organizados

### Soluciones Implementadas:
- **Sistema de inventario digital**: Control en tiempo real de stock por tienda
- **Integración de pagos**: Conexión directa con MercadoPago para transacciones seguras
- **Gestión de roles**: Sistema de autenticación con roles diferenciados (Admin, Trabajador, Cliente)
- **Conversor de monedas**: Integración con APIs externas para soporte multi-moneda
- **Sistema de contacto**: Gestión centralizada de mensajes y consultas de clientes

## Público Objetivo

### Primario:
- **Propietarios de ferreterías**: Necesitan gestionar múltiples tiendas y controlar inventario
- **Administradores de ferreterías**: Requieren herramientas para gestión de productos y usuarios
- **Trabajadores de tienda**: Necesitan acceso rápido a información de productos y stock

### Secundario:
- **Clientes finales**: Buscan productos específicos y realizan compras online
- **Desarrolladores**: Interesados en integrar el sistema con otras aplicaciones

## Tecnologías Utilizadas

### Frontend
- **React.js 18.2.0**: Framework principal para la interfaz de usuario
- **Vite 6.3.5**: Herramienta de construcción y desarrollo
- **Material-UI 7.1.0**: Biblioteca de componentes UI
- **Bootstrap 5.3.6**: Framework CSS para estilos adicionales
- **React Router DOM 6.22.3**: Enrutamiento de la aplicación
- **Axios 1.6.7**: Cliente HTTP para comunicación con APIs
- **JWT Decode 4.0.0**: Manejo de tokens de autenticación
- **React Chatbot Kit 2.2.2**: Sistema de chatbot integrado

### Backend
- **Django 5.1**: Framework web de Python
- **Django REST Framework 3.16.0**: Framework para APIs REST
- **Django REST Framework Simple JWT 5.3.1**: Autenticación JWT
- **Django CORS Headers 4.7.0**: Manejo de CORS
- **DRF Spectacular 0.28.0**: Documentación automática de APIs
- **Pillow 10.4.0**: Procesamiento de imágenes
- **Python-dotenv 1.1.0**: Manejo de variables de entorno

### Base de Datos
- **Supabase**: Plataforma de base de datos PostgreSQL en la nube
- **PostgreSQL**: Sistema de gestión de base de datos relacional
- **Psycopg2-binary 2.9.10**: Adaptador PostgreSQL para Python

### APIs Externas
- **MercadoPago 2.3.0**: Procesamiento de pagos
- **Fixer.io (ExchangeRate API)**: Conversión de monedas en tiempo real

### Herramientas de Desarrollo
- **ESLint**: Linter para JavaScript/React
- **Pytest 8.4.1**: Framework de testing para Python
- **Coverage**: Análisis de cobertura de código

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

## Arquitectura General

El sistema sigue una arquitectura cliente-servidor con separación clara de responsabilidades:

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