# README - Testing con Vitest

Este proyecto utiliza **Vitest** para realizar pruebas unitarias y de integración en el código frontend React.

---

## Instalación

Si aún no tienes instaladas las dependencias, ejecuta:

```bash
npm install

Ejecutar todos los tests
Para ejecutar todas las pruebas del proyecto:

bash
Copiar
Editar
npm run test
Este comando ejecuta Vitest en modo corrida única y muestra el reporte en consola.

Ejecutar tests en modo observador (watch mode)
Para que los tests se ejecuten automáticamente al modificar archivos:

bash
Copiar
Editar
npm run test:watch
Si no tienes este script, agrégalo a tu package.json:

json
Copiar
Editar
"scripts": {
  "test": "vitest",
  "test:watch": "vitest --watch"
}
Ejecutar tests específicos
Para correr un archivo o conjunto de tests específicos, usa:

bash
Copiar
Editar
npx vitest run <ruta-al-archivo-de-test>
Ejemplo:

bash
Copiar
Editar
npx vitest run src/__tests__/pages/chatbot/ActionProvider.test.js
También puedes filtrar por nombre de test con:

bash
Copiar
Editar
npx vitest run -t "<nombre del test o parte del nombre>"
Ejemplo:

bash
Copiar
Editar
npx vitest run -t "debería responder con productos"
Dependencias comunes para testing
vitest — runner de tests

@testing-library/react — utilidades para testing de componentes React

@testing-library/jest-dom — matchers personalizados para Jest/Vitest

@testing-library/user-event — simulación de eventos del usuario

Asegúrate que estén instaladas:

bash
Copiar
Editar
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event
Consideraciones
Los tests están configurados para funcionar con mocks, evitando llamadas reales a APIs externas.

Los resultados de las pruebas se muestran en la consola.

Usa Vitest para integración sencilla con Vite y React.