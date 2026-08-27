import { defineConfig } from 'vite'

export default defineConfig({
    base: "/pediaMap/",
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