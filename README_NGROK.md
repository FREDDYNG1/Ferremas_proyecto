# Uso de ngrok en el Proyecto

ngrok es una herramienta que permite exponer tu servidor local (backend o frontend) a Internet mediante una URL pública temporal. Es ideal para pruebas de integraciones externas como webhooks de MercadoPago.

---

## 1. Instalación de ngrok

### A. Descarga
1. Ve a [https://ngrok.com/download](https://ngrok.com/download)
2. Descarga el archivo ZIP para tu sistema operativo (Windows, Mac, Linux).

### B. Instalación
1. Extrae el archivo `ngrok.exe` (Windows) o el binario correspondiente en una carpeta de tu preferencia.
2. (Opcional) Agrega la carpeta al PATH de tu sistema para poder ejecutar `ngrok` desde cualquier terminal.

---

## 2. Autenticación (opcional pero recomendado)

1. Regístrate gratis en [ngrok.com](https://ngrok.com/).
2. Obtén tu "Authtoken" desde el dashboard de ngrok.
3. En la terminal, ejecuta:
   ```bash
   ngrok config add-authtoken TU_AUTHTOKEN
   ```

---

## 3. Cómo exponer tu servidor local

### A. Exponer el backend (por ejemplo, Django en el puerto 8000)
```bash
ngrok http 8000
```

### B. Exponer el frontend (por ejemplo, Vite/React en el puerto 5173)
```bash
ngrok http 5173
```

- ngrok te mostrará una URL pública como:
  ```
  https://xxxx-xxx-xxx-xxx.ngrok-free.app
  ```
- Esa URL redirige a tu servidor local.

---

## 4. Usar la URL de ngrok

- Usa la URL pública de ngrok para:
  - Configurar webhooks (por ejemplo, en MercadoPago).
  - Probar tu frontend desde cualquier lugar.
  - Compartir tu app local con otros.

---

## 5. Consejos y problemas comunes

- **Solo una URL por vez:** Cada vez que reinicias ngrok, la URL puede cambiar (en la versión gratuita).
- **Actualiza las URLs en tu backend/frontend** si la URL de ngrok cambia.
- **Permite el host de ngrok** en tu backend (Django: `ALLOWED_HOSTS`) y en tu frontend (Vite: `server.allowedHosts`).
- **No cierres la terminal de ngrok** mientras lo estés usando.

---

## 6. Ejemplo de flujo para MercadoPago

1. Corre tu frontend:
   ```bash
   npm run dev
   ```
2. Expón el frontend con ngrok:
   ```bash
   ngrok http 5173
   ```
3. Copia la URL pública de ngrok y configúrala en tu backend para las redirecciones de MercadoPago.
4. Realiza pruebas de pago y verifica que la redirección funcione correctamente.

---

## 7. Recursos útiles

- [Documentación oficial de ngrok](https://ngrok.com/docs)
- [Solución de problemas comunes](https://ngrok.com/docs/errors/) 