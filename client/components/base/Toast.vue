<script lang="ts" setup>
defineProps<{
    type: string;
    message: string;
}>();
</script>

<template>
    <div class="toast d-flex align-items-center position-fixed"
        :style="{ backgroundColor: type === 'error' ? '#e2454a' : '#3F00F2' }">
        <IconStatus :type="type" />
        <span class="weight-600">{{ message }}</span>
    </div>
</template>

<style scoped lang="scss">
.toast {
    bottom: 2rem;
    left: 2rem;
    padding: 1rem 2.4rem;
    color: $col-white;
    border-radius: 0.8rem;
    box-shadow: 0 0.4rem 1.2rem rgba(0, 0, 0, 0.1);
    z-index: 1000000;
    animation: scale-up-hor-left 0.4s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;

    span {
        margin-left: 0.8rem;
        @include font(1rem, 1.3rem);
    }
}

@keyframes scale-up-hor-left {
    0% {
        transform: scaleX(0.4);
        transform-origin: 0% 0%;
    }

    100% {
        transform: scaleX(1);
        transform-origin: 0% 0%;
    }
}
</style>
