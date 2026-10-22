import { defineConfig } from 'vite';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = dirname(fileURLToPath(import.meta.url));
const frontendRoot = resolve(projectRoot, 'src/frontend');

export default defineConfig({
  base: './',
  root: frontendRoot,
  publicDir: resolve(projectRoot, 'assets'),
  build: {
    rollupOptions: {
      input: {
        index: resolve(frontendRoot, 'index.html'),
        hide_face: resolve(frontendRoot, 'hide_face.html'),
        TOS: resolve(frontendRoot, 'TOS.html'),
        privacy_policy: resolve(frontendRoot, 'privacy_policy.html'),
      },
    },
  },
});
