// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	ssr: false,
	compatibilityDate: '2025-07-15',
	devtools: { enabled: true },
	css: [
		'@mdi/font/css/materialdesignicons.min.css',
	],
})
