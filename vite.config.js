import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/System.jsx',
            ],
            refresh: true,
        }),
        react(),
    ],
    build: {
        // Actualizar a ES2018 para mejor compatibilidad con características modernas
        target: 'es2018',
        // Optimizar la división de código
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    // Separar polyfills en su propio chunk
                    polyfills: ['core-js'],
                }
            }
        },
        // Minimizar mejor el código
        minify: 'terser',
        terserOptions: {
            compress: {
                // Eliminar código muerto
                dead_code: true,
                // Eliminar código no utilizado
                unused: true,
                // Eliminar depuraciones
                drop_debugger: true,
                // Eliminar console.logs en producción
                drop_console: process.env.NODE_ENV === 'production'
            }
        }
    },
    // Optimizar la carga de módulos
    optimizeDeps: {
        include: ['react', 'react-dom']
    }
});
