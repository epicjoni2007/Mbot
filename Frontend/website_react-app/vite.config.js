import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA({
    registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'MBot-Frontend',
        short_name: 'mbot_frontend',
        description: 'Frontend für die Steuerung eines MBots',
        theme_color: '#2c5364',
        background_color: '#2c5364',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/app_icon.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
  })],
})