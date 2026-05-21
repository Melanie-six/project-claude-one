import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/twse-api': {
        target: 'https://openapi.twse.com.tw/v1',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/twse-api/, ''),
      },
      '/tpex-api': {
        target: 'https://www.tpex.org.tw/openapi/v1',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/tpex-api/, ''),
      },
    },
  },
})
