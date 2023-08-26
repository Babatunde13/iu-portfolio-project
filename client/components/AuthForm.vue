<script lang="ts" setup>
const { $axios } = useNuxtApp();
const route = useRoute();
const { logIn } = useStore(); // this is a vuex action defined in store/index.ts to log in a user

/**
 * The text to display on the page
 */
const pageText = computed(() => {
    if (route.name === "signup") {
        return "Create an account and start managing your passwords effectively.";
    } else {
        return "Easy to use Password Manager";
    }
});

const isLoading = ref(false);
const name = ref("");
const username = ref("");
const email = ref("");
const password = ref("");
const cpassword = ref("");

const registerObj: RegisterData = reactive({
    name,
    username,
    email,
    password,
});

const submitForm = async () => {
    try {
        if (!email.value || !password.value) {
            useEvent("showError", "Please fill in all fields");
            return;
        }

        isLoading.value = true;
        if (route.name === "signup") { // if the user is signing up
            if (password.value !== cpassword.value) {
                useEvent("showError", "Passwords do not match");
                isLoading.value = true;
                return;
            }

            const response = await $axios.post("register", registerObj);
            if (!response.data.success) {
                return useEvent("showError", response.data.message);
            }

            useEvent("showToast", "Account created successfully");
            // if signup is successful, log the user in and redirect to dashboard
            return navigateTo("/");
        }

        // if the user is logging in
        const data: LoginData = {
            email: email.value,
            password: password.value,
        };

        const response = await logIn(data);
        isLoading.value = false;
        // temporal fix
        typeof response === "string"
            ? useEvent("showError", response)
            : window.location.reload();
    } catch (error: any) {
        isLoading.value = false;
        useEvent("showError", error?.response?.data?.message || "An error occurred while processing your request!");
    }
};
</script>

<template>
    <div class="auth__form w-100 d-flex flex-column align-items-center">
        <IconLogo />
        <span class="auth__form-desc w-100 weight-500 text-center">
            {{ pageText }}
        </span>

        <form class="d-flex flex-column" @submit.prevent="submitForm">
            <BaseText v-if="route.name === 'signup'" v-model="name" label="Full Name" for="name" type="text"
                placeholder="John Idan" />
            <BaseText v-if="route.name === 'signup'" v-model="username" label="Username" for="username" type="text"
                placeholder="highdan" />
            <BaseText v-model="email" label="Email" for="email" type="email" placeholder="johndoe@gmail.com" />
            <BaseText v-model="password" label="Password" for="password" type="password"
                placeholder="********************" />
            <BaseText v-if="route.name === 'signup'" v-model="cpassword" label="Confirm Password" for="cpassword"
                type="password" placeholder="********************" />

            <button class="btn w-100 text-center" v-if="!isLoading">
                {{ route.name === "signup" ? "Sign Up" : "Login" }}
                <IconArrow direction="right" />
            </button>

            <button v-else class="btn w-100 text-center" disabled>
                <IconLoading />
            </button>
        </form>
        <p v-if="route.name === 'signup'" class="forgot-password d-flex align-items-center justify-content-center">
            Already have an account?
            <nuxt-link to="/">Login</nuxt-link>
        </p>
        <p v-else class="forgot-password d-flex align-items-center justify-content-center">
            Forgot Password?
            <nuxt-link to="/forgot-password">Request a new one</nuxt-link>
        </p>

        <p v-if="route.name !== 'signup'" class="forgot-password d-flex align-items-center justify-content-center"
            style="margin-top: 5rem">
            Don’t have an Account?
            <nuxt-link to="/signup">Sign Up</nuxt-link>
        </p>
    </div>
</template>

<style lang="scss" scoped>
.auth__form {
    max-width: 60rem;
    margin: 0 auto;
    padding: 4rem 2rem;

    &-desc {
        max-width: 37rem;
        @include font(2rem, 2.4rem);
        color: $col-black;
        margin-top: 1rem;
    }

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
        }
    }

    .forgot-password {
        gap: 1rem;
        margin-top: 1rem;
        @include font(1.6rem, 1.8rem);
        color: $col-black;

        @media screen and (max-width: 400px) {
            gap: 0.5rem;
            @include font(1.2rem, 1.6rem);
            white-space: nowrap;
        }

        a {
            color: $col-bluePurple;
            text-decoration: underline;
            cursor: pointer;
        }
    }
}
</style>
