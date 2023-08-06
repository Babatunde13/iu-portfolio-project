<script lang="ts" setup>
const { user, logOut } = useStore();
const showMenu = ref(false);
</script>

<template>
    <header class="d-flex align-items-center justify-content-space-between position-relative">
        <IconLogo class="logo" />

        <button class="account d-flex align-items-center" @click="showMenu = !showMenu">
            <img :src="`https://ui-avatars.com/api/?name=${user?.username}`" :alt="user?.username">
            <span class="weight-400">{{ user?.email }}</span>
            <IconCaret :direction="showMenu ? 'up' : 'down'" />
        </button>

        <div v-show="showMenu" class="dropdown position-absolute d-flex flex-column align-items-start">
            <button class="d-flex align-items-center" @click="logOut">
                <IconDropdown type="logout" />
                Sign Out
            </button>
        </div>
    </header>
</template>

<style scoped lang="scss">
header {
    padding: 2.2rem 6rem;
    background-color: $col-white;
    border-bottom: 0.1rem solid $col-grey;

    @media screen and (max-width: 768px) {
        padding: 2.2rem 2.4rem;
    }

    @media screen and (min-width: 769px) and (max-width: 950px) {
        padding: 2.2rem 3.4rem;
    }

    .logo {
        width: 22.8rem;

        @media screen and (max-width: 423px) {
            width: 10rem;
        }

        @media screen and (min-width: 423px) and (max-width: 485px) {
            width: 18rem;
        }
    }

    .account {
        gap: 0.8rem;

        img {
            width: 2.8rem;
            height: 2.8rem;
            border-radius: 50%;
        }

        span {
            @include font(1.2rem, 2rem);
            color: $col-darkGrey;
        }
    }

    .dropdown {
        top: 9rem;
        right: 6rem;
        width: 22rem;
        padding: 2rem;
        background-color: $col-white;
        border-radius: 1.1rem;
        box-shadow: #64646f33 0px 7px 29px 0px;
        z-index: 9999999;
        gap: 2rem;
        animation: scale-up-top 0.4s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;

        @media screen and (max-width: 768px) {
            right: 2.4rem;
        }

        @media screen and (min-width: 769px) and (max-width: 950px) {
            right: 3.4rem;
        }

        button {
            @include font(1.6rem, 3.3rem);
            font-weight: 400;
            gap: 1.2rem;
            color: $col-black;
            transition: color 0.3s ease-in-out;

            &:hover {
                color: $col-fadedBlack;
            }
        }
    }
}

@keyframes scale-up-top {
    0% {
        transform: scale(0.5);
        transform-origin: 50% 0%;
    }

    100% {
        transform: scale(1);
        transform-origin: 50% 0%;
    }
}
</style>
