import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    base: '/', // or ./ for relative paths
    build: {
        emptyOutDir: true,
        outDir: 'dist',
        assetsDir: 'assets',
        manifest: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                login: resolve(__dirname, 'src/login.html'),
                register: resolve(__dirname, 'src/register.html'),
                // assets: resolve(__dirname, 'assets'), // utilities och css
            },
        },
    },
});
