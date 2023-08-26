import { defineStore } from "pinia";

/**
 * This is used for state management(store)
 */
export const useStore = defineStore("store", () => {
	const { $axios } = useNuxtApp();

	const userToken = ref<string>("");
	const user = ref<User | null>(null); // Store the logged in user in the store
	const categories = ref<Category[]>([]); // Store all the password categories in the store
	const passwords = ref<Password[]>([]); // Store all the passwords in the store
    const search = ref(""); // Store the search query in the store

	/**
	 * Computed property to filter the passwords based on the search query
	 * This returns the passwords whose account name or website contains the search query
	 * It is case insensitive
	 */
    const filteredPasswords = computed(() => {
        if (!search.value) return passwords.value;
        return passwords.value.filter((password) => {
            return password.account_name.toLowerCase().includes(search.value.toLowerCase()) || password.website.toLowerCase().includes(search.value.toLowerCase());
        });
    });

	/**
	 * Computed property to get the count of passwords in a category
	 * @param id The id of the category
	 * @returns The count of passwords in the category
	 */
	const categoryCount = (id: string) => {
		if (passwords.value.length > 0) {
			return passwords.value.filter(password => password.category === id).length;
		}

		return 0;
	};

	/**
	 * Function to fetch all the passwords and categories from the api
	 * This is used to update the store when a new password or category is added
	 */
	const fetchPasswordsAndCategories = async () => {
		await getAllPasswords();
		await getAllCategories();
	};

	/**
	 * Function to log in the user, store the user and token in the store and cookies
	*/ 
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

	/**
	 * Function to log out the user in the server, remove the user and token from the store and cookies
	 */ 
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

	/**
	 * Function to add a new password in the api and store
	 * It updates the store with data from the api
	 */
	const addPassword = async (data: any) => {
		const response = await $axios.post("passwords", data);
		if (!response.data.success) return response.data.success;
		await fetchPasswordsAndCategories();
		return response.data.success;
	};

	/**
	 * Function to create a new category in the api and store
	 * It updates the store with data from the api
	 */
	const createCategory = async (name: string) => {
		const response = await $axios.post("categories", {
			name,
		});
		if (!response.data.success) return response.data.success;
		await fetchPasswordsAndCategories();
		return response.data.success;
	};

	/**
	 * Function to get all the password categories from the api
	 */
	const getAllCategories = async () => {
		const response = await $axios.get("categories");
		if (!response.data.success) return;
		categories.value = response.data.data.data;
	};

	/**
	 * Function to get all the passwords from the api
	 */
	const getAllPasswords = async () => {
		const response = await $axios.get("passwords");
		if (!response.data.success) return;
		passwords.value = response.data.data.data;
	};

	/**
	 * Function to delete a password from the api and store
	 * It updates the store with data from the api
	 */ 
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

	/**
	 * Function to update a password in the api and store
	 * It updates the store with data from the api
	 */
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
