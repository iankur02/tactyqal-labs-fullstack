import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
 resolve: { alias: { '@': path.resolve(import.meta.dirname, 'src') } },
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://localhost:5000', changeOrigin: true },
    },
  },
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) return 'vendor-motion';
            if (id.includes('@tanstack')) return 'vendor-query';
            if (id.includes('react-router')) return 'vendor-router';
            if (id.includes('lucide-react')) return 'vendor-icons';
            if (id.includes('react-hook-form') || id.includes('zod') || id.includes('@hookform'))
              return 'vendor-forms';
            if (id.includes('dompurify')) return 'vendor-sanitize';
            if (id.includes('axios')) return 'vendor-http';
            if (id.includes('date-fns')) return 'vendor-date';
            return 'vendor';
          }
          // Admin feature group — one chunk so admin tooling loads together
          if (id.includes('/features/admin/')) return 'feature-admin';
        },
      },
    },
  },
});