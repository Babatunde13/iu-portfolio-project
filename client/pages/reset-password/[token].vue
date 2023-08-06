<script lang="ts" setup>
definePageMeta({
    title: "reset-password",
    middleware: ["guest"],
});

const { $axios } = useNuxtApp();
const route = useRoute();

const resetToken = ref("");
const tokenVerified = ref(false);
const password = ref("");
const confirmPassword = ref("");
const isLoading = ref(false);

const handleFormSubmission = async () => {
    try {
        // check if passwords match
        if (password.value !== confirmPassword.value) {
            useEvent("showError", "Passwords do not match!");
            return;
        }
        
        isLoading.value = true;
        const response = await $axios.post("reset-password", {
            token: resetToken.value,
            password: password.value,
        });
        if (!response.data.success) throw new Error();
        useEvent("showToast", "Password reset successful!");
        isLoading.value = false;
        navigateTo("/");
    } catch (error) {
        isLoading.value = false;
        useEvent("showError", "An error occurred while processing your request!");
    }
};

const confirmResetToken = async () => {
    try {
        const response = await $axios.post("verify-reset-password-token", {
            token: route.params.token,
        });
        if (!response.data.success) throw new Error();
        resetToken.value = route.params.token as string;
        tokenVerified.value = true;
    } catch {
       navigateTo("/reset-password");
    }
};

confirmResetToken();
</script>

<template>
    <div v-if="tokenVerified" class="reset w-100 d-flex flex-column align-items-center">
        <IconLogo />

        <form class="d-flex flex-column" @submit.prevent="handleFormSubmission">
            <BaseText v-model="password" label="New Password" for="password" type="password"
                placeholder="Enter new password" />
            <BaseText v-model="confirmPassword" label="Confirm Password" for="confirmPassword" type="password"
                placeholder="Confirm new password" />

            <button v-if="isLoading" type="button" class="btn w-100 text-center" disabled>
                <IconLoading />
            </button>

            <button v-else type="submit" class="btn w-100 text-center" :disabled="!password || !confirmPassword">
                Reset Password
                <IconArrow direction="right" />
            </button>
        </form>
    </div>
</template>

<style lang="scss" scoped>
.reset {
    max-width: 60rem;
    margin: 0 auto;
    padding: 4rem 2rem;

    form {
        gap: 1.2rem;
        margin-top: 4rem;
        width: 100%;

        .btn {
            margin-top: 2rem;
            background-color: $col-bluePurple;
            color: $col-white;
            border-radius: 0.8rem;
            padding: 1.5rem;
            transition: all 0.2s;

            &:hover {
                opacity: 0.8;
            }

            &:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
        }
    }
}
</style>