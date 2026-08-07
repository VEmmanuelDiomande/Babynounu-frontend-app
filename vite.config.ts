/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'

// Plugin pour stripper console.log/debug/info en production (garde error/warn)
function stripConsoleLog() {
  return {
    name: 'strip-console-log',
    enforce: 'pre' as const,
    transform(_code: string, id: string) {
      if (!id.includes('node_modules') && process.env.NODE_ENV === 'production') {
        // Remplace console.log/debug/info par une fonction vide
        // (esbuild/rolldown tree-shake le code mort)
        return {
          code: _code
            .replace(/console\.log\s*\(/g, 'void(')
            .replace(/console\.debug\s*\(/g, 'void(')
            .replace(/console\.info\s*\(/g, 'void('),
          map: null,
        }
      }
      return null
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    legacy(),
    stripConsoleLog(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 8084,
  },
  test: {
    globals: true,
    environment: 'jsdom'
  }
})
