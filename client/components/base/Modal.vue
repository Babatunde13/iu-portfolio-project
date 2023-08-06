<script lang="ts" setup>
interface Props {
    width: string;
    height: string;
}

defineProps<Props>();

defineEmits(["close"]);
</script>

<template>
    <div class="modal position-fixed w-100">
        <div class="modal__overlay position-absolute w-100" @click="$emit('close')"></div>
        <div class="modal__content position-absolute w-100">
            <slot />
        </div>
    </div>
</template>

<style scoped lang="scss">
.modal {
    top: 0;
    left: 0;
    z-index: 9999;
    height: 100vh;
    background-color: $col-lightBlack;
    backdrop-filter: blur(2px);

    &__overlay {
        top: 0;
        left: 0;
        z-index: 9999;
        height: 100vh;
        background-color: $col-lightBlack;
    }

    &__content {
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 9999;
        max-width: v-bind(width);
        height: v-bind(height);
        background-color: $col-white;
        border-radius: 2rem;
        padding: 6rem;
        overflow-y: auto;
        animation: scale-up-center 0.4s cubic-bezier(0.215, 0.610, 0.355, 1.000) ;

        @media screen and (max-width: 768px) {
            max-width: 100%;
            top: auto;
            left: 0;
            right: 0;
            bottom: 0;
            transform: translate(0, 0);
            padding: 3rem;
            border-radius: 2rem 2rem 0 0;
            animation: mobile-scale-up-center 0.4s cubic-bezier(0.215, 0.610, 0.355, 1.000) ;
        }

        @media screen and (min-width: 769px) and (max-width: 950px) {
            padding: 4rem;
        }
    }
}

@keyframes scale-up-center {
  0% {
    transform: translate(-50%, -50%) scale(0);
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
  }
}

@keyframes mobile-scale-up-center {
  0% {
    transform: translate(0, 0) scale(0);
  }
  100% {
    transform: translate(0, 0) scale(1);
  }
}
</style>
