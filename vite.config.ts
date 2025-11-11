import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/modelado-y-simulacion-2p/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
})
