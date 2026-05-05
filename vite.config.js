import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            injectRegister: false,
            includeAssets: ['favicon.svg', 'logo-mark.svg', 'pwa-192x192.png', 'pwa-512x512.png'],
            manifest: {
                name: 'SmartQueue',
                short_name: 'SmartQueue',
                description: 'University queue management — join lines and track your ticket.',
                theme_color: '#080f1b',
                background_color: '#080f1b',
                display: 'standalone',
                orientation: 'portrait-primary',
                scope: '/',
                start_url: '/',
                icons: [
                    {
                        src: 'pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                        purpose: 'any',
                    },
                    {
                        src: 'pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any',
                    },
                    {
                        src: 'pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'maskable',
                    },
                ],
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,woff}'],
                navigateFallback: 'index.html',
            },
            devOptions: {
                enabled: true,
            },
        }),
    ],
    server: {
        host: '127.0.0.1',
        port: 3000,
        strictPort: false,
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src/'),
        },
    },
});
