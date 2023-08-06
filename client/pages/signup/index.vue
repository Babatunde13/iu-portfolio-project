<script lang="ts" setup>
definePageMeta({
    title: "signup",
    middleware: ["guest"],
})
</script>

<template>
    <div class="signup">
        <AuthForm />
    </div>
</template>
