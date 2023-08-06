<script lang="ts" setup>

</script>

<template>
    <div class="spinner">
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    </div>
</template>

<style scoped lang="scss">
.spinner {
    margin: 0 auto;
}

.spinner > div {
    width: 1rem;
    height: 1rem;
    background-color: $col-white;
    border-radius: 100%;
    display: inline-block;
    -webkit-animation: ball 1.4s infinite ease-in-out both;
    animation: ball 1.4s infinite ease-in-out both;
}

.spinner .bounce1 {
    -webkit-animation-delay: -0.32s;
    animation-delay: -0.32s;
    margin-right: 0.5rem;
}

.spinner .bounce2 {
    -webkit-animation-delay: -0.16s;
    animation-delay: -0.16s;
    margin-right: 0.5rem;
}

@-webkit-keyframes ball {

    0%,
    80%,
    100% {
        -webkit-transform: scale(0)
    }

    40% {
        -webkit-transform: scale(1.0)
    }
}

@keyframes ball {

    0%,
    80%,
    100% {
        -webkit-transform: scale(0);
        transform: scale(0);
    }

    40% {
        -webkit-transform: scale(1.0);
        transform: scale(1.0);
    }
}
</style>