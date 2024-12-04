import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ], 
  server: {
    proxy: {
      // Proxy requests starting with '/api' to the target
      '/api': {
        target: 'https://ipgrupa4echipa1-b4acchb9bfcnfzfc.northeurope-01.azurewebsites.net/',
        changeOrigin: true, // Ensures the host header matches the target
        rewrite: (path) => path.replace(/^\/api/, ''), // Removes /api from the URL path
        secure: false, // If the target server uses self-signed certificates, set this to false
      }
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
