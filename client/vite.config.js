import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: '../public/app',
    emptyOutDir: true
  },
  server: {
    proxy: {
      // Static assets (images, favicons, etc.) live in the repo-root public/
      // directory and are served by Express in production. Vite's dev server
      // only knows about client/public/ (which doesn't exist here), so these
      // paths need to be proxied to Express during local development too --
      // otherwise every <img src="/images/..."> 404s in dev mode even though
      // the same path works fine once built and served by Express.
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/images': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/favicon.ico': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/site.webmanifest': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/sitemap.xml': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/.well-known': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
});
