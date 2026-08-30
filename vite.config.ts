import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const GITHUB_PAGES_BASE = '/japan-oct-2026-trip/'

export default defineConfig(({ command }) => ({
  // Project Pages URL: https://zhi-you.github.io/japan-oct-2026-trip/
  // Dev stays at / so localhost:5173 keeps working.
  base: command === 'build' ? GITHUB_PAGES_BASE : '/',
  plugins: [react(), tailwindcss()],
}))
