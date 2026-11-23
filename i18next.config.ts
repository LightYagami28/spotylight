import { defineConfig } from 'i18next-cli';

export default defineConfig({
    extract: {
        contextSeparator: '_',
        defaultNS: false,
        defaultValue: (key) => key,
        indentation: 4,
        input: [
            'src/renderer/components/**/*.{js,jsx,ts,tsx}',
            'src/renderer/features/**/*.{js,jsx,ts,tsx}',
            'src/renderer/layouts/**/*.{js,jsx,ts,tsx}',
            '!src/node_modules/**',
            '!src/**/*.prod.js',
        ],
        keySeparator: '.',
        output: 'src/i18n/locales/{{language}}.json',
        pluralSeparator: '_',
        removeUnusedKeys: true,
        sort: true,
    },
    locales: ['en'],
});
