/**
 * Middleware for guest routes
 * If the user is authenticated, redirect to the dashboard
 */
export default defineNuxtRouteMiddleware(() => {
	const cookieExp = useCookie("token_exp");
	if (cookieExp.value && new Date() < new Date(cookieExp.value)) {
		return navigateTo("/dashboard");
	}
});
