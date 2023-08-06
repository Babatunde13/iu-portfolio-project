<script lang="ts" setup>
interface Props {
    direction: 'up' | 'down';
}

defineProps<Props>();
</script>

<template>
    <svg v-if="direction === 'down'" width="16" height="16" viewBox="0 0 16 16" fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd"
            d="M3.64645 5.65967C3.84171 5.44678 4.15829 5.44678 4.35355 5.65967L7.64645 9.25C7.84171 9.4629 8.15829 9.4629 8.35355 9.25L11.6464 5.65968C11.8417 5.44678 12.1583 5.44678 12.3536 5.65968C12.5488 5.87257 12.5488 6.21775 12.3536 6.43065L9.06066 10.021C8.47487 10.6597 7.52513 10.6597 6.93934 10.021L3.64645 6.43065C3.45118 6.21775 3.45118 5.87257 3.64645 5.65967Z"
            fill="currentColor" fill-opacity="0.4" />
    </svg>

    <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd"
            d="M12.3536 10.3403C12.1583 10.5532 11.8417 10.5532 11.6464 10.3403L8.35355 6.75C8.15829 6.5371 7.84171 6.5371 7.64645 6.75L4.35355 10.3403C4.15829 10.5532 3.84171 10.5532 3.64645 10.3403C3.45118 10.1274 3.45118 9.78225 3.64645 9.56935L6.93934 5.97902C7.52513 5.34033 8.47487 5.34032 9.06066 5.97902L12.3536 9.56935C12.5488 9.78225 12.5488 10.1274 12.3536 10.3403Z"
            fill="currentColor" fill-opacity="0.4" />
    </svg>
</template>

