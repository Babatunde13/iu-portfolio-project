<script lang="ts" setup>
const { filteredPasswords } = storeToRefs(useStore());

defineEmits<{
    (event: "toggle-delete-modal", id: string): void;
    (event: "toggle-edit-modal", password: Object): void;
}>();

const selectedPassword = ref("");
const accountOpened = ref(false);
const showPassword = ref(false);

const toggleAccount = (id: string) => {
    showPassword.value = false;
    selectedPassword.value = selectedPassword.value === id ? "" : id;
    accountOpened.value = selectedPassword.value !== "";
};

/*
* Copies the text to the clipboard
* @param {string} text the text to copy to the clipboard
*/
const copyToClipboard = async (text: string) => {
    try {
        await navigator.clipboard.writeText(text);
        useEvent("showToast", "Copied to clipboard!");
    } catch {
        useEvent("showError", "Failed to copy to clipboard!");
    }
};

/**
 * Toggles the visibility of the password
 * @param {string} id the id of the password
 */
const togglePasswordVisibility = (id: string) => {
    if (selectedPassword.value === id) {
        showPassword.value = !showPassword.value;
    }
};

/**
 * if the password is visible, show the password, else show *********
 */
const revealPassword = computed(() =>
    showPassword.value
        ? filteredPasswords.value.find(
            (password: Password) => password._id === selectedPassword.value
        )?.password
        : "*********"
);
</script>

<template>
    <div class="passwords d-flex flex-column w-100">
        <template v-if="filteredPasswords.length > 0">
            <div v-for="password in filteredPasswords" class="passwords__card position-relative">
                <div class="account d-flex align-items-center justify-content-space-between"
                    @click="toggleAccount(password._id)">
                    <div class="account__info d-flex align-items-center">
                        <img :src="`https://ui-avatars.com/api/?name=${password.account_name}`"
                            :alt="password.account_name" />
                        <h4>
                            {{ password.account_name }}
                            <span>- {{ password.username }}</span>
                        </h4>
                    </div>
                    <button class="account__toggle">
                        <IconCaret :direction="accountOpened && selectedPassword === password._id ? 'up' : 'down'
                            " />
                    </button>
                </div>

                <!-- account password info -->
                <div v-show="accountOpened && selectedPassword === password._id" class="passwords__card-body">
                    <button class="edit d-flex align-items-center justify-content-center weight-400"
                        @click="$emit('toggle-edit-modal', password)">
                        Edit
                    </button>

                    <ul class="passwords__card-body-content w-100 d-flex flex-column">
                        <div
                            class="passwords__card-body-content-item d-flex align-items-center justify-content-space-between">
                            <span class="weight-500">Email: {{ password.username }}</span>
                            <button @click="copyToClipboard(password.username)">
                                <IconCopy />
                            </button>
                        </div>

                        <div
                            class="passwords__card-body-content-item d-flex align-items-center justify-content-space-between">
                            <div class="d-flex align-items-center" style="gap: 1rem">
                                <span class="weight-500">Password: {{ revealPassword }}</span>
                                <button @click="togglePasswordVisibility(password._id)">
                                    <IconVisibility :visibility="showPassword ? 'hidden' : 'show'" />
                                </button>
                            </div>
                            <button @click="copyToClipboard(password.password)">
                                <IconCopy />
                            </button>
                        </div>

                        <a :href="password.website" target="_blank"
                            class="passwords__card-body-content-item d-flex align-items-center justify-content-space-between">
                            <span class="weight-500">Website: {{ password.website }}</span>
                            <IconArrow direction="up" />
                        </a>
                    </ul>
                </div>

                <!-- remove password -->
                <button class="position-absolute remove" @click="$emit('toggle-delete-modal', password._id)">
                    <IconRemove />
                </button>
            </div>
        </template>

        <h3 v-else>No Passwords!</h3>
    </div>
</template>

<style scoped lang="scss">
.passwords {
    margin-top: 4.2rem;
    margin-bottom: 15rem;
    gap: 1.6rem;

    &__card {
        padding: 1.5rem 2.4rem;
        border-radius: 1.6rem;
        background-color: $col-grayishBlue;

        .account {
            cursor: pointer;

            &__info {
                gap: 1.6rem;

                img {
                    width: 3.2rem;
                    height: 3.2rem;
                    border-radius: 0.4rem;
                    object-fit: cover;
                }

                h4 {
                    @include font(1.4rem, 2rem);
                    font-weight: 600;
                    color: $col-black;

                    span {
                        font-weight: 400;
                    }
                }
            }
        }

        &-body {
            margin-top: 2rem;

            .edit {
                margin-bottom: 2rem;
                border: 0.5px solid $col-fadedBlack;
                border-radius: 0.4rem;
                width: 6.4rem;
                height: 2.4rem;
                @include font(1.2rem, 2rem);
                color: $col-black;
                transition: all 0.2s ease-in-out;

                &:hover {
                    background-color: $col-fadedBlack;
                    color: $col-white;
                }
            }

            &-content {
                max-width: 35rem;
                gap: 1.6rem;

                &-item {
                    gap: 1.6rem;
                    color: $col-black;

                    span {
                        @include font(1.2rem, 2rem);
                    }
                }
            }
        }
    }
}

.remove {
    right: -3rem;
    top: 1.5rem;
}</style>
