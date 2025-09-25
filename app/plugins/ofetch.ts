import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
	const config = useRuntimeConfig();

	const apiFetch = $fetch.create({
		baseURL: config.public.apiURL,
		onRequest({ options }) {
			const token = useCookie('token').value
			if (token) {
				options.headers = {
					...options.headers,
					Authorization: `Bearer ${token}`
				}
			}
		},
		onResponse({ response }) {
			// централизованная обработка
		},
		onResponseError({ response }) {
			// логика на 401/403/500 и т.п.
		},
	});

	// Делаем доступным как $api
	return { provide: { api: apiFetch } };
})
