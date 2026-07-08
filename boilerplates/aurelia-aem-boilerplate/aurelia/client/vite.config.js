import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Proxy to the API so in dev you call /api/* without CORS.
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
});
