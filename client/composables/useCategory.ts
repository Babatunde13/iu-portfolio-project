/**
 * Composable function to handle category related logic in the api and store
 * @returns 
 */
export const useCategory = () => {
	const { createCategory, getAllCategories } = useStore();
	const name = ref("");
	const showAddCategory = ref(false);
	const showCategoryDropdown = ref(false);

	/**
	 * Function to open the add category modal
	 */
	const openAddCategory = () => {
		showAddCategory.value = true;
		showCategoryDropdown.value = true;
	};

	/**
	 * Function to toggle the category dropdown
	 */
	const toggleCategoryDropdown = () => {
		if (!showCategoryDropdown.value) return (showCategoryDropdown.value = true);
		showAddCategory.value = false;
		showCategoryDropdown.value = false;
	};

	/**
	 * Function to add a new category in the api and store
	 */
	const addNewCategory = async () => {
		try {
			if (name.value.trim() === "") return;
			const status = await createCategory(name.value);
			if (!status) throw new Error();
			name.value = "";
			showAddCategory.value = false;
			await getAllCategories();
			useEvent("showToast", "Category added successfully!");
		} catch (error) {
            useEvent("showError", "Something went wrong!");
        }
	};

	return {
		name,
		showAddCategory,
		showCategoryDropdown,
		addNewCategory,
		openAddCategory,
		toggleCategoryDropdown,
	};
};
