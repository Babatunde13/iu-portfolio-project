import axios from "axios";

export default defineNuxtPlugin(() => {
	const envKeys = useRuntimeConfig();
	const token = useCookie("token");
	const useAxios = axios.create({
		baseURL: envKeys.public.baseUrl as string,
		headers: {
			"Content-Type": "application/json",
			Authorization: "Bearer " + token.value,
		},
	});

	if (token.value) {
		useAxios.interceptors.response.use(async (config) => {
			// TODO: Unauthorized code is subject to change
			if (config.status === 401) {
				const tokenExp = useCookie("token_exp");
				const refreshToken = useCookie("refresh_token");
				const refreshTokenExp = useCookie("refresh_token_exp");
				const { data } = await useAxios.post("refresh_token", {
					refreshToken: refreshToken.value,
				});
				token.value = data.access.token;
				tokenExp.value = data.access.expires;
				refreshToken.value = data.refresh.token;
				refreshTokenExp.value = data.refresh.expires;
				config.headers["Authorization"] = `Bearer ${token.value}`;
				return useAxios(config);
			}
			return config;
		});
	}

	return {
		provide: {
			axios: useAxios,
		},
	};
});
