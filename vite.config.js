import { defineConfig } from 'vite';
import resolve from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about-me.html'),
        projects: resolve(__dirname, 'projects.html'),
        resume: resolve(__dirname, 'resume.html'),
      }
    }
  }
});