import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables for the current mode
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    // Make Vite pass all environment variables prefixed with VITE_
    define: {
      'process.env': env
    }
  }
})
