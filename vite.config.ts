import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  
  // Configuration des alias pour les imports
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@config': path.resolve(__dirname, './src/config'),
      '@types': path.resolve(__dirname, './src/types'),
    },
  },
  
  // Configuration du serveur de développement
  server: {
    port: 3000,
    host: true,
    open: true,
    cors: true,
  },
  
  // Configuration de la preview
  preview: {
    port: 4173,
    host: true,
    open: true,
  },
  
  // Configuration du build
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          utils: ['clsx', 'tailwind-merge', 'class-variance-authority'],
        },
      },
    },
  },
  
  // Configuration des tests (commentée pour éviter les erreurs de build)
  // test: {
  //   globals: true,
  //   environment: 'jsdom',
  //   setupFiles: ['./src/test/setup.ts'],
  // },
  
  // Optimisation des dépendances
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
