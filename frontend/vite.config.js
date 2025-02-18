import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    cors: true,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
    },
    host: '0.0.0.0', // Allows external access
    allowedHosts: [
      '.ngrok-free.app', // Allows any ngrok subdomain
      'localhost',
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    commonjsOptions: {
      include: [],
    },
  },
})
