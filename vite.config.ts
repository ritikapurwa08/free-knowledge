import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from "path"
import tailwindcss from "@tailwindcss/vite"
// https://vite.dev/config/
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Exam Orbit',
        short_name: 'Exam Orbit',
        description: 'Your ultimate exam preparation companion',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'examOrbit192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'examOrbit512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server:{
    port:5173,
    host:true,
  }
})
