<script lang="ts" setup>
definePageMeta({
    title: "login",
    middleware: ["guest"],
})
</script>

<template>
    <div class="login">
        <AuthForm />
    </div>
</template>
