import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()], // Use the React plugin
  esbuild: {
    jsx: 'automatic',  // JSX syntax (React 17+ syntax)
  },
  logLevel: 'info', // Set to 'info' for more detailed logging ('info' | 'warn' | 'error' | 'silent')
  clearScreen: false, // Prevents Vite from clearing the terminal
  server: {
    cors: true,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
    },
    watch: {
      usePolling: true, // Enable polling for better file watching
    },
    middlewareMode: false,
    fs: {
      strict: false, // Allow serving files from outside of the root directory
    },
  },
  build: {
    sourcemap: true, // Generate source maps for better debugging
    rollupOptions: {
      output: {
        manualChunks: undefined, // Disable manual chunk splitting for better debugging
      },
    },
  },
});
