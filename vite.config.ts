import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const GITHUB_PAGES_BASE = '/japan-oct-2026-trip/'

export default defineConfig({
  // Project Pages: https://zhi-you.github.io/japan-oct-2026-trip/
  // GITHUB_ACTIONS is set in CI so local npm run dev / build stay at /.
  base: process.env.GITHUB_ACTIONS ? GITHUB_PAGES_BASE : '/',
  plugins: [react(), tailwindcss()],
})
