<script lang="ts" setup>
const showToast = ref(false);
const toastMessage = ref("");
const toastType = ref()

useListen("showToast", (message: string) => {
    showToast.value = true;
    toastMessage.value = message;
    toastType.value = "success";
    setTimeout(() => {
        showToast.value = false;
        toastMessage.value = "";
    }, 3000);
});

useListen("showError", (message: string) => {
    showToast.value = true;
    toastMessage.value = message;
    toastType.value = "error";
    setTimeout(() => {
        showToast.value = false;
        toastMessage.value = "";
    }, 3000);
});
</script>

<template>
    <slot />
    <!-- TOAST NOTIFICATION -->
    <BaseToast v-if="showToast" :message="toastMessage" :type="toastType" />
</template>
