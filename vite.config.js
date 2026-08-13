import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    watch: {
      // Binary 3D assets don't need HMR, and watching a locked .glb on Windows
      // can throw EBUSY and crash the dev server. Ignore the models folder.
      ignored: ['**/public/models/**', '**/*.glb', '**/*.gltf'],
    },
  },
})
