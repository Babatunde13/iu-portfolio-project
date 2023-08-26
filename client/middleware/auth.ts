/**
 * Middleware to check if the user is authenticated
 * If not, redirect to the login page
 */
export default defineNuxtRouteMiddleware(() => {
	const cookieExp = useCookie("token_exp");
	if (!cookieExp.value || new Date() > new Date(cookieExp.value)) {
		return navigateTo("/");
	}
});
