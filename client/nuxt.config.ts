// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	app: {
		head: {
			htmlAttrs: {
				lang: "en",
			},
			title: "SmartPass",
			meta: [
				{
					name: "viewport",
					content: "width=device-width, initial-scale=1",
				},
				{
					charset: "utf-8",
				},
				{
					name: "description",
					content:
						"SmartPass is a password manager that helps you to manage your passwords and keep them safe.",
				},
			],
		},
	},
	css: ["~/assets/scss/main.scss"],
	vite: {
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: `@import "@/assets/scss/core/_variables.scss"; @import "@/assets/scss/utils/_mixins.scss";`,
				},
			},
		},
	},
	runtimeConfig: {
		public: {
			baseUrl: process.env.BASE_URL,
		},
	},
	modules: ["@pinia/nuxt", "@pinia-plugin-persistedstate/nuxt"],
	imports: {
		dirs: ["store"],
	},
	pinia: {
		autoImports: ["defineStore", "storeToRefs"],
	},
	devServer: {
		port: 4000,
	},
	devtools: { enabled: true },
	plugins: ["~/plugins/axios.ts"],
});
