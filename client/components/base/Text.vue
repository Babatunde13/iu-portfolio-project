<script lang="ts" setup>
interface Props {
    for: string;
    label: string;
    type: string;
    placeholder: string;
    modelValue: string | number;
}

interface InputEmits {
    (event: "update:modelValue", value: string): void;
}

const props = defineProps<Props>();
defineEmits<InputEmits>();

const showPassword = ref(false);

// toggle password visibility
const togglePasswordVisibility = () => {
    const input = document.getElementById(props.for) as HTMLInputElement;
    if (input.type === "password") {
        input.type = "text";
        showPassword.value = true;
    } else {
        input.type = "password";
        showPassword.value = false;
    }
};
</script>

<template>
    <label :for="for" class="w-100 d-flex flex-column position-relative">
        <span class="weight-400">{{ label }}</span>
        <input :value="modelValue" :type="type" :id="for" :placeholder="placeholder" @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)" />
        <IconVisibility v-if="type === 'password'" :visibility="showPassword ? 'show' : 'hide'" class="visibility position-absolute" @click="togglePasswordVisibility" />
    </label>
</template>

<style scoped lang="scss">
label {
    gap: 0.5rem;

    span {
        @include font(1.2rem, 1.6rem);
        color: $col-black;
    }

    input {
        @include font(1.4rem, 1.6rem);
        color: $col-black;
        padding: 1.5rem;
        border-radius: 0.8rem;
        border: 1px solid #E4E4E7;
        outline: none;
        transition: all 0.2s;

        &:focus {
            border-color: $col-bluePurple;
        }
    }

    .visibility {
        top: 3.7rem;
        right: 2rem;
        cursor: pointer;
    }
}
</style>
