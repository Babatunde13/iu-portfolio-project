import { defineStore } from "pinia";

export const useStore = defineStore("store", () => {
	const { $axios } = useNuxtApp();

	const userToken = ref<string>("");
	const user = ref<User | null>(null);
	const categories = ref<Category[]>([]);
	const passwords = ref<Password[]>([]);
    const search = ref("");

    const filteredPasswords = computed(() => {
        if (!search.value) return passwords.value;
        return passwords.value.filter((password) => {
            return password.account_name.toLowerCase().includes(search.value.toLowerCase());
        });
    });

	const categoryCount = (id: string) => {
		if (passwords.value.length > 0) {
			return passwords.value.filter(password => password.category === id).length;
		}

		return 0;
	};

	const fetchPasswordsAndCategories = async () => {
		await getAllPasswords();
		await getAllCategories();
	};

	const logIn = async (data: LoginData) => {
		const response = await $axios.post("login", data);
		if (!response.data.success) {
			return response.data.message;
		}
		
		const { user: userObj, tokens } = response.data.data;
		const { access, refresh } = tokens;
		const { token, expires } = access;
		const { token: refreshToken, expires: refreshExpires } = refresh;

		useCookie("token_exp").value = expires;
		useCookie("refresh_token_exp").value = refreshExpires;

		useCookie("token").value = token;
		userToken.value = token;
		useCookie("refresh_token").value = refreshToken;

		user.value = userObj;

		return response.data.success;
	};

	const logOut = async () => {
		const refreshToken = useCookie("refresh_token");
		await $axios.post("logout", {
			refreshToken: refreshToken.value,
		});
		useCookie("token_exp").value = "";
		useCookie("refresh_token_exp").value = "";

		useCookie("token").value = "";
		useCookie("refresh_token").value = "";

		user.value = null;

		navigateTo("/");
	};

	const addPassword = async (data: any) => {
		const response = await $axios.post("passwords", data);
		if (!response.data.success) return response.data.success;
		await fetchPasswordsAndCategories();
		return response.data.success;
	};

	const createCategory = async (name: string) => {
		const response = await $axios.post("categories", {
			name,
		});
		if (!response.data.success) return response.data.success;
		await fetchPasswordsAndCategories();
		return response.data.success;
	};

	const getAllCategories = async () => {
		const response = await $axios.get("categories");
		if (!response.data.success) return;
		categories.value = response.data.data.data;
	};

	const getAllPasswords = async () => {
		const response = await $axios.get("passwords");
		if (!response.data.success) return;
		passwords.value = response.data.data.data;
	};

	const deletePassword = async (id: string) => {
		const response = await $axios.delete("passwords", {
			data: {
				_ids: [id],
			},
		});
		if (!response.data.success) return response.data.success;
		await fetchPasswordsAndCategories();
		return response.data.success;
	};

	const updatePassword = async (_id: string, website: string) => {
		const response = await $axios.put("passwords", {
			_id,
			website,
		});
		if (!response.data.success) return response.data.success;
		await fetchPasswordsAndCategories();
		return response.data.success;
	};

	return {
        search,
		user,
		userToken,
		categories,
        filteredPasswords,
		passwords,
		logIn,
		logOut,
		categoryCount,
		fetchPasswordsAndCategories,
		addPassword,
		createCategory,
		getAllPasswords,
		getAllCategories,
		deletePassword,
		updatePassword,
	};
}, {
    persist: true
});
