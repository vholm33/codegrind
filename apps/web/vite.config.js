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
                addProblem: resolve(__dirname, 'src/addProblem.html'),
                addRating: resolve(__dirname, 'src/addRating.html'),
                quizSession: resolve(__dirname, 'src/quizSession.html'),
                ratings: resolve(__dirname, 'src/pages/ratings/ratings.html'),
                // assets: resolve(__dirname, 'assets'), // utilities och css
            },
        },
    },
});
