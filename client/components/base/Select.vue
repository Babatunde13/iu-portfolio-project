<script lang="ts" setup>
interface Props {
    for: string;
    label: string;
    values: Category[];
    modelValue: string
}

interface Emits {
    (event: "update:modelValue", value: string): void;
}

defineProps<Props>();
defineEmits<Emits>();
</script>

<template>
    <label class="w-100 d-flex flex-column" :for="for">
        <span>{{ label }}</span>
        <select class="add__password-form-input" :id="for" @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)">
            <option value="" disabled selected>Select a category</option>
            <option v-for="value in values" :value="value._id" :selected="value.name === modelValue">{{ value.name }}</option>
        </select>
    </label>
</template>

<style scoped lang="scss">
label {
    gap: 0.5rem;

    span {
        @include font(1.2rem, 1.6rem);
        color: $col-black;
    }

    select {
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
}
</style>
