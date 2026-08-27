import { defineConfig } from 'vite'

export default defineConfig({
    base: "/mod-4-project/",
    server: {
        proxy: {
            '/npi-api': {
                target: 'https://npiregistry.cms.hhs.gov',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/npi-api/, '/api'),
            },
        },
    },
})