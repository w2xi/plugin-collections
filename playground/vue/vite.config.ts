import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgv from 'vite-plugin-svgv'
import Inspect from 'vite-plugin-inspect'

export default defineConfig({
  plugins: [vue(), svgv(), Inspect()],
})
