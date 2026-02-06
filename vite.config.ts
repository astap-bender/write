// AI ASSISTANT WARNING: react plugin and jsx source are mandatory for the Koder platform preview to work
// @ts-nocheck
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'


const enableJsxSource = process.env.KODER_ENABLE_JSX_SOURCE === '1';

export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  esbuild: {
    // Use only esbuild to inject React dev element metadata when enabled
    jsxDev: enableJsxSource,
  },
  define: enableJsxSource ? { 'process.env.NODE_ENV': '"development"' } : {},
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: true
  },
  build: {
    reportCompressedSize: false
  }
})


