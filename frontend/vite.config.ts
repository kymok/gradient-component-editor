import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/gradient-component-editor/',
  plugins: [
    tailwindcss(),
    react({
      babel: {
        plugins: [
          "babel-plugin-react-compiler",
        ]
      }
    }),
  ],
  optimizeDeps: { exclude: ['@texel/color'] }
})
