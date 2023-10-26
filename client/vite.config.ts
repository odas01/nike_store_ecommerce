import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import pluginRewriteAll from 'vite-plugin-rewrite-all';

// https://vitejs.dev/config/
export default defineConfig({
   plugins: [react(), pluginRewriteAll()],
   server: {
      port: 3001,
   },
   resolve: {
      alias: {
         '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
   },
});
