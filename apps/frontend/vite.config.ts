import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import path from 'path';

export default defineConfig({
  plugins: [solidPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@auth": path.resolve(__dirname, "./src/auth"),
      "@network": path.resolve(__dirname, "./src/network"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@ui": path.resolve(__dirname, "./src/ui"),
      "@state": path.resolve(__dirname, "./src/state"),
    }
  }
});
