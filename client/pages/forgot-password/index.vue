<script lang="ts" setup>
definePageMeta({
    title: "forgot-password",
    middleware: ["guest"],
});

const { $axios } = useNuxtApp();

const isLoading = ref(false);
const email = ref("");

/**
 * Request a password reset link for the user from the server
 */
const forgotPassword = async () => {
    try {
        if (!email.value) return useEvent("showError", "Email is required!");
        const response = await $axios.post("forgot-password", {
            email: email.value,
        });
        if (!response.data.success) throw new Error(response.data.message);
        useEvent("showToast", "A reset password link has been sent to your email!");
    } catch {
        useEvent("showError", "An error occurred while processing your request!");
    }
};
</script>

<template>
    <div class="auth__form w-100 d-flex flex-column align-items-center">
        <IconLogo />

        <form class="d-flex flex-column" @submit.prevent="forgotPassword">
            <BaseText v-model="email" label="Email" for="email" type="email" placeholder="johndoe@gmail.com" />

            <button v-if="isLoading" type="button" class="btn w-100 text-center" disabled>
                <IconLoading />
            </button>

            <button v-else type="submit" class="btn w-100 text-center">
                Request password reset
                <IconArrow direction="right" />
            </button>
        </form>

        <nuxt-link to="/">Back to Login Page</nuxt-link>
    </div>
</template>

<style lang="scss" scoped>
.auth__form {
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

    a {
        margin-top: 1rem;
        @include font(1.6rem, 1.8rem);
        color: $col-bluePurple;
        text-decoration: underline;
        cursor: pointer;
    }
}
</style>
