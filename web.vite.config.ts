import path from 'path';
import { defineConfig, normalizePath } from 'vite';
import { ViteEjsPlugin } from 'vite-plugin-ejs';
import { VitePWA } from 'vite-plugin-pwa';

import { kuromojiDictionaryPlugin } from './vite.kuromoji-plugin';
import { createReactPlugin } from './vite.react-plugin';

export default defineConfig({
    base: './',
    build: {
        emptyOutDir: true,
        outDir: path.resolve(__dirname, './out/web'),
        rollupOptions: {
            input: {
                '32x32': normalizePath(path.resolve(__dirname, './assets/icons/32x32.png')),
                '64x64': normalizePath(path.resolve(__dirname, './assets/icons/64x64.png')),
                '128x128': normalizePath(path.resolve(__dirname, './assets/icons/128x128.png')),
                '192x192': normalizePath(path.resolve(__dirname, './assets/icons/192x192.png')),
                '256x256': normalizePath(path.resolve(__dirname, './assets/icons/256x256.png')),
                '512x512': normalizePath(path.resolve(__dirname, './assets/icons/512x512.png')),
                '1024x1024': normalizePath(path.resolve(__dirname, './assets/icons/1024x1024.png')),
                'apple-touch-icon': normalizePath(
                    path.resolve(__dirname, './assets/icons/apple-touch-icon.png'),
                ),
                favicon: normalizePath(path.resolve(__dirname, './assets/icons/favicon.ico')),
                index: normalizePath(path.resolve(__dirname, './src/renderer/index.html')),
                'maskable-512x512': normalizePath(
                    path.resolve(__dirname, './assets/icons/maskable-512x512.png'),
                ),
                preview_full_screen_player: normalizePath(
                    path.resolve(__dirname, './media/preview_full_screen_player.webp'),
                ),
            },
            output: {
                assetFileNames: (assetInfo) => {
                    const stableNames = [
                        '32x32.png',
                        '64x64.png',
                        '128x128.png',
                        '256x256.png',
                        '512x512.png',
                        '1024x1024.png',
                        '192x192.png',
                        'maskable-512x512.png',
                        'apple-touch-icon.png',
                        'favicon.ico',
                        'preview_full_screen_player.webp',
                    ];

                    if (assetInfo.names.length === 1 && stableNames.includes(assetInfo.names[0])) {
                        return 'assets/[name][extname]';
                    }

                    return 'assets/[name]-[hash][extname]';
                },
                sourcemapExcludeSources: false,
            },
        },
        sourcemap: true,
    },
    css: {
        modules: {
            generateScopedName: 'fs-[name]-[local]',
            localsConvention: 'camelCase',
        },
    },
    optimizeDeps: {
        exclude: [
            '@atlaskit/pragmatic-drag-and-drop',
            '@atlaskit/pragmatic-drag-and-drop-auto-scroll',
            '@atlaskit/pragmatic-drag-and-drop-hitbox',
            '@tanstack/react-query-persist-client',
            'idb-keyval',
        ],
    },
    plugins: [
        createReactPlugin(),
        kuromojiDictionaryPlugin(),
        ViteEjsPlugin({
            root: normalizePath(path.resolve(__dirname, './src/renderer')),
            web: true,
        }),
        VitePWA({
            devOptions: {
                // The PWA will not be shown during development
                enabled: false,
            },
            filename: 'sw.js',
            includeAssets: ['apple-touch-icon.png', 'favicon.ico'],
            injectRegister: 'script',
            manifest: {
                background_color: '#121212',
                categories: ['music', 'entertainment'],
                description: "Il tuo server musicale, come un'app.",
                display: 'standalone',
                icons: [
                    {
                        purpose: 'any',
                        sizes: '192x192',
                        src: 'assets/192x192.png',
                        type: 'image/png',
                    },
                    {
                        purpose: 'any',
                        sizes: '512x512',
                        src: 'assets/512x512.png',
                        type: 'image/png',
                    },
                    {
                        purpose: 'maskable',
                        sizes: '512x512',
                        src: 'assets/maskable-512x512.png',
                        type: 'image/png',
                    },
                ],
                id: './',
                lang: 'it',
                name: 'SpotyLight',
                scope: './',
                screenshots: [
                    {
                        form_factor: 'wide',
                        label: 'Lettore a schermo intero con testi',
                        sizes: '720x450',
                        src: 'assets/preview_full_screen_player.webp',
                        type: 'image/webp',
                    },
                ],
                short_name: 'SpotyLight',
                shortcuts: [
                    { name: 'Cerca', short_name: 'Cerca', url: './#/search/songs' },
                    { name: 'La tua libreria', short_name: 'Libreria', url: './#/library/albums' },
                ],
                start_url: './',
                theme_color: '#121212',
            },
            manifestFilename: 'manifest.webmanifest',
            outDir: path.resolve(__dirname, './out/web/'),
            registerType: 'autoUpdate',
            scope: './',
            workbox: {
                cleanupOutdatedCaches: true,
                clientsClaim: true,
                // Only the hashed app shell is precached: audio streams and API responses are never cached
                globIgnores: ['**/kuromoji/**', 'settings.js'],
                maximumFileSizeToCacheInBytes: 1000000 * 10, // 10 MB
                navigateFallback: 'index.html',
                runtimeCaching: [],
                skipWaiting: true,
            },
        }),
    ],
    resolve: {
        alias: {
            '/@/i18n': path.resolve(__dirname, './src/i18n'),
            '/@/lyrics-conversion-api': path.resolve(
                __dirname,
                './src/main/features/core/lyrics/furigana.ts',
            ),
            '/@/remote': path.resolve(__dirname, './src/remote'),
            '/@/renderer': path.resolve(__dirname, './src/renderer'),
            '/@/shared': path.resolve(__dirname, './src/shared'),
            path: path.resolve(__dirname, './src/renderer/shims/path.ts'),
        },
    },
    root: path.resolve(__dirname, './src/renderer'),
});
