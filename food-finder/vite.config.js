import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // '/api'로 시작하는 요청을 백엔드 서버로 전달합니다.
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true, // CORS 에러를 방지하기 위해 필요합니다.
      },
    },
  },
})
