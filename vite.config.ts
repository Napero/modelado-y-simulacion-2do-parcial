import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/modelado-y-simulacion-2do-parcial/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
})
