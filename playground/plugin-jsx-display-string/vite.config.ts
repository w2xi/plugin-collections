import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import babelPluginJsxDisplayString from '../../packages/plugin-jsx-display-string/src'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [babelPluginJsxDisplayString()],
      },
    }),
  ],
})
