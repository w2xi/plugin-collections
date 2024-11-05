import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgv from 'vite-plugin-svgv'

export default defineConfig({
  plugins: [vue(), svgv()],
})
