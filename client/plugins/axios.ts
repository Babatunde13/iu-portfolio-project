import axios from "axios";

/**
 * Helps configure axios with the runtime config
 * @see https://axios.nuxtjs.org/options
 */
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
			// If the response is 401(unauthorized), refresh the token and retry the request
			// This is done to prevent the user from being logged out when the token expires
			if (config.status === 401) {
				const tokenExp = useCookie("token_exp"); // Get the current token expiry
				const refreshToken = useCookie("refresh_token"); // Get the refresh token
				const refreshTokenExp = useCookie("refresh_token_exp"); // Get the refresh token expiry
				const { data } = await useAxios.post("refresh_token", {
					refreshToken: refreshToken.value,
				});
				token.value = data.access.token; // Update the token in the cookie
				tokenExp.value = data.access.expires; // Update the token expiry in the cookie
				refreshToken.value = data.refresh.token; // Update the refresh token in the cookie
				refreshTokenExp.value = data.refresh.expires; // Update the refresh token expiry in the cookie
				config.headers["Authorization"] = `Bearer ${token.value}`; // Update the Authorization header for the request
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
