import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite proxy config for FastAPI
export default defineConfig({
  plugins: [react()],
})
