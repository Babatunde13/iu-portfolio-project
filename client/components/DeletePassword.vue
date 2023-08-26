<script lang="ts" setup>
const props = defineProps<{
    id: string;
}>();

const { deletePassword } = useStore();
const emits = defineEmits(["close"]);

/**
 * Removes the password from the database and store then closes the modal
 */
const removePassword = () => {
    try {
        const status = deletePassword(props.id);
        if (!status) throw new Error();
        useEvent("showToast", "Password deleted successfully!");
        emits("close");
    } catch {
        useEvent("showError", "Failed to delete password!");
    }
};
</script>

<template>
    <div class="delete__password d-flex flex-column align-items-center w-100 position-relative">
        <h3 class="delete__password-text weight-400">Are you sure you want to delete this password?</h3>

        <div class="delete__password-btns d-flex align-items-center">
            <button class="delete__password-btns-delete" @click="removePassword">Delete</button>
            <button class="delete__password-btns-cancel" @click="$emit('close')">Cancel</button>
        </div>
    </div>
</template>

<style scoped lang="scss">
.delete__password {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    &-text {
        @include font(1.5rem, 1.8rem);
        color: $col-black;
        margin-bottom: 3rem;
    }

    &-btns {
        gap: 3rem;

        button {
            width: 13.5rem;
            @include font(1.2rem, 1.6rem);
            border-radius: 0.5rem;
            padding: 1rem 2rem;
        }

        &-delete {
            color: $col-white;
            background-color: $col-bluePurple;
            transition: all 0.2s ease-in-out;

            &:hover {
                opacity: 0.8;
            }
        }

        &-cancel {
            color: $col-fadedBlack;
            background-color: $col-lightGrey;
        }
    }
}
</style>
