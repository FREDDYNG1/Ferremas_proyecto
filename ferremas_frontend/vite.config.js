import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'f473-186-189-101-32.ngrok-free.app'
    ]
  },
  test: {
    environment: 'jsdom',    // necesario para tests con DOM (React)
    globals: true,           // para usar describe, it, expect sin importarlos
    setupFiles: './src/setupTests.js', // configuraciones globales (ej. jest-dom)
    threads: false,          // evita saturar sistema con demasiadas instancias
  },
  optimizeDeps: {
    exclude: ['@mui/icons-material'], // evita analizar todos los íconos de MUI
  },
  deps: {
    inline: [/^@mui\/.*/], // asegura que los módulos MUI se manejen correctamente
  }
});
