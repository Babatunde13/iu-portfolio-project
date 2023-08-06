<script lang="ts" setup>
interface Props {
    mode: string;
    passwordToEdit: any;
}

const { categories } = storeToRefs(useStore());
const { addPassword, updatePassword } = useStore();
const props = defineProps<Props>();
const emits = defineEmits(["close"]);

const accountName = ref("");
const email = ref("");
const password = ref("");
const website = ref("");
const category = ref("");

const checkAllFields = () => {
    if (
        website.value === "" ||
        email.value === "" ||
        password.value === "" ||
        accountName.value === "" ||
        category.value === ""
    ) {
        useEvent("showError", "Please fill in all fields!");
        return false;
    }
    return true;
};

const saveChanges = async () => {
    try {
        if (!checkAllFields()) return;

        const passwordObj = {
            ...(props.mode === "edit" && { _id: props.passwordToEdit.id }),
            website: website.value,
            account_name: accountName.value,
            category: category.value,
            username: email.value,
            password: password.value,
        };

        if (props.mode === "edit") {
            const status = await updatePassword(props.passwordToEdit._id, passwordObj.website);
            if (!status) throw new Error();
        } else {
            const status = await addPassword(passwordObj);
            if (!status) throw new Error();
        }
        useEvent("showToast", `Password successfully ${props.mode === "edit" ? "edited" : "added"}!`);
        emits("close");
    } catch {
        useEvent("showError", "Something went wrong!");
    }
};

if (props.mode === "edit") {
    website.value = props.passwordToEdit.website;
    accountName.value = props.passwordToEdit.account_name;
    category.value = categories.value.find((cat: any) => cat._id === props.passwordToEdit.category)?.name || "";
    email.value = props.passwordToEdit.username;
    password.value = props.passwordToEdit.password;
}
</script>

<template>
    <div class="add__password d-flex flex-column">
        <h1 class="add__password-header weight-600 text-center">
            {{ mode === "edit" ? "Edit Password" : "Add a New Password" }}
        </h1>

        <form class="add__password-form w-100 d-flex flex-column" @submit.prevent="saveChanges">
            <BaseText v-model="accountName" for="name" label="Account Name" type="text" placeholder="Netflix" />
            <BaseText v-model="website" for="website" label="Website" type="text" placeholder="https://example.com" />
            <BaseText v-model="email" for="email" label="Username" type="text" placeholder="johndoe" />
            <BaseText v-model="password" for="password" label="Password" type="password"
                placeholder="********************" />
            <BaseSelect v-model="category" for="category" label="Category" :values="categories" />

            <button class="add__password-form-btn">
                {{ mode === "edit" ? "Edit Password" : "Add Password" }}
                <IconArrow direction="right" />
            </button>
        </form>
    </div>
</template>

<style scoped lang="scss">
.add__password {
    &-header {
        @include font(1.5rem, 1.8rem);
        color: $col-black;
        margin-bottom: 3rem;
    }

    &-form {
        gap: 1.5rem;

        &-btn {
            @include font(1.4rem, 1.6rem);
            color: $col-white;
            background-color: $col-bluePurple;
            border-radius: 0.8rem;
            padding: 1.5rem;
            transition: all 0.2s;

            &:hover {
                background-color: darken($col-bluePurple, 10%);
            }
        }
    }
}
</style>
