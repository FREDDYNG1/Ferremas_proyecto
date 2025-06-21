# Ferremas - Frontend

Este es el frontend para el proyecto Ferremas, una plataforma de e-commerce para una ferretería. La aplicación está construida con React y Vite, utilizando Material-UI para los componentes de la interfaz.

---

## ✨ Características Principales

-   **Catálogo de Productos:** Visualización de productos con búsqueda y filtros.
-   **Carrito de Compras:** Funcionalidad completa de añadir, actualizar y eliminar productos.
-   **Checkout con MercadoPago:** Integración de pagos para procesar las compras.
-   **Panel de Administración:** Vistas dedicadas para que administradores y trabajadores gestionen productos, usuarios y mensajes de contacto.
-   **Autenticación por Roles:** Sistema de usuarios con roles (cliente, trabajador, admin).
-   **Formulario de Contacto:** Permite a los usuarios enviar consultas.
-   **Diseño Responsivo:** Interfaz adaptable a dispositivos móviles y de escritorio.

---

## 🛠️ Tecnologías Utilizadas

-   **Framework:** [React](https://react.dev/)
-   **Bundler:** [Vite](https://vitejs.dev/)
-   **UI Kit:** [Material-UI (MUI)](https://mui.com/)
-   **Routing:** [React Router DOM](https://reactrouter.com/)
-   **HTTP Client:** [Axios](https://axios-http.com/)
-   **Gestión de Estado:** React Context API

---

## 🚀 Cómo Empezar

Sigue estos pasos para levantar el entorno de desarrollo local.

### Prerrequisitos

-   [Node.js](https://nodejs.org/) (versión 18 o superior)
-   [npm](https://www.npmjs.com/) (generalmente viene con Node.js)
-   El [servidor del backend de Ferremas](https://github.com/FREDDYNG1/Ferremas_proyecto/tree/main/ferremas_backend) debe estar ejecutándose.

### Instalación

1.  **Clona el repositorio** (si aún no lo has hecho):
    ```sh
    git clone https://github.com/FREDDYNG1/Ferremas_proyecto.git
    cd Ferremas_proyecto/ferremas_frontend
    ```

2.  **Instala las dependencias** del proyecto:
    ```sh
    npm install
    ```

### Ejecución

1.  Una vez instaladas las dependencias, inicia el servidor de desarrollo de Vite:
    ```sh
    npm run dev
    ```

2.  Abre tu navegador y visita [http://localhost:5173/](http://localhost:5173/) para ver la aplicación en funcionamiento.

---

## 📚 Documentación Adicional

-   **[Guía de Endpoints de la API](./ENDPOINTS_API.md):** Documentación completa de la API para pruebas con Postman.
-   **[Guía del Sistema de Contacto](./GUIA_CONTACTO.md):** Detalles sobre cómo usar el formulario de contacto y el panel de gestión de mensajes.

--- 